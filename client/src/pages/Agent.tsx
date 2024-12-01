import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { FaSearch, FaUserTie, FaUndo } from "react-icons/fa";
import {
  getAgents,
  getAgentByRegistrationNumber,
} from "../services/agentService";
import { AgentDto } from "../models/AgentDto";
import AgentCard from "../components/AgentCard";

const customStyles = {
  header: {
    backgroundColor: "#f8f9fa",
    padding: "2rem 0",
    marginBottom: "2rem",
    borderBottom: "1px solid #e9ecef",
  },
  searchSection: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  resultsSection: {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  icon: {
    marginRight: "0.5rem",
  },
};

const Agent: React.FC = () => {
  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<AgentDto | null>(null);
  const [registrationCategory, setRegistrationCategory] = useState<string>("");
  const [filteredAgents, setFilteredAgents] = useState<AgentDto[]>([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
        setFilteredAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await getAgentByRegistrationNumber(search);
      setSearchResult(result);
      setFilteredAgents(result ? [result] : []);
    } catch (error) {
      console.error("Error fetching agent by registration number:", error);
      setSearchResult(null);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    setSearchResult(null);
    setRegistrationCategory("");
    setFilteredAgents(agents);
  };

  const handleFilter = () => {
    let filtered = searchResult ? [searchResult] : agents;
    if (registrationCategory) {
      filtered = filtered.filter(
        (agent) => agent.registrationCategory === registrationCategory
      );
    }
    setFilteredAgents(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [registrationCategory, searchResult, agents]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <div style={customStyles.header}>
        <Container className="text-center">
          <h2>
            <FaUserTie style={customStyles.icon} />
            Real Estate Agents Directory
          </h2>
        </Container>
      </div>

      <Container>
        <Card style={customStyles.searchSection}>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4 className="mb-3">Search Agents</h4>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter Registration Number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Group>
                <div>
                  <Button variant="primary" onClick={handleSearch}>
                    <FaSearch style={customStyles.icon} />
                    Search
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    className="ms-2"
                  >
                    <FaUndo style={customStyles.icon} />
                    Reset
                  </Button>
                </div>
              </Col>
              <Col md={6}>
                <h4 className="mb-3">Filter by Category</h4>
                <Form.Select
                  value={registrationCategory}
                  onChange={(e) => setRegistrationCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Salesperson">Salesperson</option>
                  <option value="Broker">Broker</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div style={customStyles.resultsSection}>
          <h4 className="mb-4">
            Search Results ({filteredAgents.length} agents found)
          </h4>
          <Row>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <Col md={4} key={agent.registrationNumber} className="mb-4">
                  <AgentCard agent={agent} />
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-muted">
                  No agents found matching your criteria
                </p>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Agent;