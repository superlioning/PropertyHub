import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgentByRegistrationNumber, deleteAgent } from '../services/agentService';
import { AgentDto } from '../models/AgentDto';
import { sectionStyle } from '../styles/styles';

const AgentView: React.FC = () => {
    const { registrationNumber } = useParams<{ registrationNumber: string }>();
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                if (registrationNumber) {
                    const data = await getAgentByRegistrationNumber(registrationNumber);
                    setAgent(data);
                }
            } catch (error) {
                console.error('Error fetching agent:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgent();
    }, [registrationNumber]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            try {
                await deleteAgent(registrationNumber!);
                navigate('/agent');
            } catch (error) {
                console.error('Error deleting agent:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!agent) {
        return <div>Agent not found</div>;
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
                <p>Brokerage Address: {agent.brokerageAddress.streetNumber} {agent.brokerageAddress.streetName}, {agent.brokerageAddress.city}, {agent.brokerageAddress.province}, {agent.brokerageAddress.postalCode}, {agent.brokerageAddress.country}</p>
                <button className="btn btn-primary" onClick={() => navigate(`/agent/update/${registrationNumber}`)}>Update</button>
                <button className="btn btn-danger ms-2" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default AgentView;