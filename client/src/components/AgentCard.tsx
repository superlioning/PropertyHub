import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import { AgentDto } from "../models/AgentDto";

interface AgentCardProps {
  agent: AgentDto;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex align-items-center mb-3">
          <FaUser className="me-2 text-primary" />
          {agent.name}
        </Card.Title>
        <Card.Text>
          <p className="mb-2">
            <strong>Category:</strong> {agent.registrationCategory}
          </p>
          <p className="mb-2">
            <FaBuilding className="me-2" />
            {agent.brokerageTradeName}
          </p>
        </Card.Text>
        <Button
          as={Link as any}
          to={`/agent/${agent.registrationNumber}`}
          variant="outline-primary"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AgentCard;