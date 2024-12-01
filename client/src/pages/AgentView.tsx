import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAgentByRegistrationNumber, deleteAgent } from "../services/agentService";
import { AgentDto } from "../models/AgentDto";
import { Modal, Button, Spinner, Card, Container, Row, Col } from "react-bootstrap";
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";

const AgentView: React.FC = () => {
  const { registrationNumber } = useParams<{ registrationNumber: string }>();
  const [agent, setAgent] = useState<AgentDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const cardStyle = {
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
  };

  const iconStyle = {
    marginRight: "10px",
    color: "#666",
  };

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        if (registrationNumber) {
          const data = await getAgentByRegistrationNumber(registrationNumber);
          setAgent(data);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching agent details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [registrationNumber]);

  const handleDelete = async () => {
    try {
      await deleteAgent(registrationNumber!);
      setShowDeleteModal(false);
      navigate("/agent");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the agent"
      );
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Agent not found
        </div>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Card style={cardStyle}>
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">
              <FaIdCard style={iconStyle} className="text-white" />
              Agent Details
            </h2>
            <div>
              <Button
                variant="outline-light"
                onClick={() => navigate(`/agent/update/${registrationNumber}`)}
                className="me-2"
              >
                Update
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card className="h-100" style={cardStyle}>
                <Card.Header className="bg-light">
                  <h4 className="mb-0">
                    <FaUser style={iconStyle} />
                    Personal Information
                  </h4>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Registration Number:</strong>{" "}
                    {agent?.registrationNumber}
                  </p>
                  <p>
                    <strong>Name:</strong> {agent?.name}
                  </p>
                  <p>
                    <strong>Registration Category:</strong>{" "}
                    {agent?.registrationCategory}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100" style={cardStyle}>
                <Card.Header className="bg-light">
                  <h4 className="mb-0">
                    <FaBuilding style={iconStyle} />
                    Brokerage Information
                  </h4>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Trade Name:</strong> {agent?.brokerageTradeName}
                  </p>
                  <p>
                    <FaPhone style={iconStyle} />
                    <strong>Phone:</strong> {agent?.brokeragePhone}
                  </p>
                  <p>
                    <FaEnvelope style={iconStyle} />
                    <strong>Email:</strong> {agent?.brokerageEmail}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Card style={cardStyle}>
                <Card.Header className="bg-light">
                  <h4 className="mb-0">
                    <FaMapMarkerAlt style={iconStyle} />
                    Brokerage Address
                  </h4>
                </Card.Header>
                <Card.Body>
                  <p className="lead">
                    {agent?.brokerageAddress.streetNumber}{" "}
                    {agent?.brokerageAddress.streetName},<br />
                    {agent?.brokerageAddress.city},{" "}
                    {agent?.brokerageAddress.province}{" "}
                    {agent?.brokerageAddress.postalCode},<br />
                    {agent?.brokerageAddress.country}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this agent? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AgentView;