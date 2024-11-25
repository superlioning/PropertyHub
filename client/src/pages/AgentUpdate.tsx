import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgentByRegistrationNumber, updateAgent, patchAgent } from '../services/agentService';
import { AgentCreateDto } from '../models/AgentCreateDto';
import { AgentUpdateDto } from '../models/AgentUpdateDto';
import { AddressCreateDto } from '../models/AddressCreateDto';
import { sectionStyle } from '../styles/styles';

const AgentUpdate: React.FC = () => {
    const { registrationNumber } = useParams<{ registrationNumber: string }>();
    const [agent, setAgent] = useState<AgentCreateDto>({
        registrationNumber: '',
        name: '',
        registrationCategory: '',
        brokerageTradeName: '',
        brokeragePhone: '',
        brokerageEmail: '',
        brokerageAddress: {
            streetNumber: '',
            streetName: '',
            unit: '',
            city: '',
            province: '',
            postalCode: '',
            country: ''
        }
    });
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
            }
        };

        fetchAgent();
    }, [registrationNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('brokerageAddress.')) {
            const addressField = name.split('.')[1];
            setAgent({
                ...agent,
                brokerageAddress: {
                    ...agent.brokerageAddress,
                    [addressField]: value
                }
            });
        } else {
            setAgent({ ...agent, [name]: value });
        }
    };

    const handleSubmitPut = async (e: React.FormEvent) => {
        e.preventDefault();
        const agentUpdateDto: AgentUpdateDto = {
            name: agent.name,
            registrationCategory: agent.registrationCategory,
            brokerageTradeName: agent.brokerageTradeName,
            brokeragePhone: agent.brokeragePhone,
            brokerageEmail: agent.brokerageEmail,
            brokerageAddress: agent.brokerageAddress
        };
        try {
            await updateAgent(registrationNumber!, agentUpdateDto);
            navigate('/agent');
        } catch (error) {
            console.error('Error updating agent with PUT:', error);
        }
    };

    const handleSubmitPatch = async (e: React.FormEvent) => {
        e.preventDefault();
        const agentUpdateDto: AgentUpdateDto = {
            name: agent.name,
            registrationCategory: agent.registrationCategory,
            brokerageTradeName: agent.brokerageTradeName,
            brokeragePhone: agent.brokeragePhone,
            brokerageEmail: agent.brokerageEmail,
            brokerageAddress: agent.brokerageAddress
        };
        try {
            await patchAgent(registrationNumber!, agentUpdateDto);
            navigate('/agent');
        } catch (error) {
            console.error('Error updating agent with PATCH:', error);
        }
    };

    const handleReset = () => {
        setAgent({
            registrationNumber: '',
            name: '',
            registrationCategory: '',
            brokerageTradeName: '',
            brokeragePhone: '',
            brokerageEmail: '',
            brokerageAddress: {
                streetNumber: '',
                streetName: '',
                unit: '',
                city: '',
                province: '',
                postalCode: '',
                country: ''
            }
        });
    };

    return (
        <div className="container mt-5">
            <div style={sectionStyle}>
                <form onSubmit={handleSubmitPut}>
                    <div className="mb-3">
                        <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
                        <input type="text" className="form-control" id="registrationNumber" name="registrationNumber" value={agent.registrationNumber} readOnly />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={agent.name} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="registrationCategory" className="form-label">Registration Category</label>
                        <select className="form-select" id="registrationCategory" name="registrationCategory" value={agent.registrationCategory} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="Salesperson">Salesperson</option>
                            <option value="Broker">Broker</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokerageTradeName" className="form-label">Brokerage Trade Name</label>
                        <input type="text" className="form-control" id="brokerageTradeName" name="brokerageTradeName" value={agent.brokerageTradeName} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokeragePhone" className="form-label">Brokerage Phone</label>
                        <input type="text" className="form-control" id="brokeragePhone" name="brokeragePhone" value={agent.brokeragePhone} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokerageEmail" className="form-label">Brokerage Email</label>
                        <input type="email" className="form-control" id="brokerageEmail" name="brokerageEmail" value={agent.brokerageEmail} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Brokerage Address</label>
                        <input type="text" className="form-control mb-2" placeholder="Street Number" name="brokerageAddress.streetNumber" value={agent.brokerageAddress.streetNumber} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Street Name" name="brokerageAddress.streetName" value={agent.brokerageAddress.streetName} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Unit (Optional)" name="brokerageAddress.unit" value={agent.brokerageAddress.unit} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="City" name="brokerageAddress.city" value={agent.brokerageAddress.city} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Province" name="brokerageAddress.province" value={agent.brokerageAddress.province} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="Postal Code" name="brokerageAddress.postalCode" value={agent.brokerageAddress.postalCode} onChange={handleChange} />
                        <input type="text" className="form-control" placeholder="Country" name="brokerageAddress.country" value={agent.brokerageAddress.country} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Agent (PUT)</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleSubmitPatch}>Update Agent (PATCH)</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    );
};

export default AgentUpdate;