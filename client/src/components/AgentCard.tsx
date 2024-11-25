import React from 'react';
import { Link } from 'react-router-dom';
import { AgentDto } from '../models/AgentDto';

interface AgentCardProps {
    agent: AgentDto;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{agent.name}</h5>
                <p className="card-text">Category: {agent.registrationCategory}</p>
                <p className="card-text">Brokerage: {agent.brokerageTradeName}</p>
                <Link to={`/agent/${agent.registrationNumber}`} className="btn btn-primary">
                    View Detail
                </Link>
            </div>
        </div>
    );
};

export default AgentCard;