import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgentByRegistrationNumber,
  deleteAgent,
} from "../services/agentService";
import { AgentDto } from "../models/AgentDto";
import { sectionStyle } from "../styles/styles";
import { Modal, Button, Spinner } from "react-bootstrap";

const AgentView: React.FC = () => {
  const { registrationNumber } = useParams<{ registrationNumber: string }>();
  const [agent, setAgent] = useState<AgentDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

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
    <div className="container mt-5">
      <div style={sectionStyle}>
        <h1>{agent.registrationNumber}</h1>
        <p>Name: {agent.name}</p>
        <p>Registration Category: {agent.registrationCategory}</p>
        <p>Brokerage Trade Name: {agent.brokerageTradeName}</p>
        <p>Brokerage Phone: {agent.brokeragePhone}</p>
        <p>Brokerage Email: {agent.brokerageEmail}</p>
        <p>
          Brokerage Address: {agent.brokerageAddress.streetNumber}{" "}
          {agent.brokerageAddress.streetName}, {agent.brokerageAddress.city},{" "}
          {agent.brokerageAddress.province}, {agent.brokerageAddress.postalCode}
          , {agent.brokerageAddress.country}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/agent/update/${registrationNumber}`)}
        >
          Update
        </button>
        <button
          className="btn btn-danger ms-2"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
      </div>

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
    </div>
  );
};

export default AgentView;