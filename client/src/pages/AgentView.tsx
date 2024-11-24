import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAgentByRegistrationNumber } from '../services/agentService';
import { AgentDto } from '../models/AgentDto';

const AgentView: React.FC = () => {
    const { registrationNumber } = useParams<{ registrationNumber: string }>();
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!agent) {
        return <div>Agent not found</div>;
    }

    return (
        <div>
            <h1>{agent.name}</h1>
            <p>Registration Number: {agent.registrationNumber}</p>
            <p>Registration Category: {agent.registrationCategory}</p>
            <p>Brokerage Trade Name: {agent.brokerageTradeName}</p>
            <p>Brokerage Phone: {agent.brokeragePhone}</p>
            <p>Brokerage Email: {agent.brokerageEmail}</p>
            <p>Brokerage Address: {agent.brokerageAddress.streetNumber} {agent.brokerageAddress.streetName}, {agent.brokerageAddress.city}, {agent.brokerageAddress.province}, {agent.brokerageAddress.postalCode}, {agent.brokerageAddress.country}</p>
        </div>
    );
};

export default AgentView;