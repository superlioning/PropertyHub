import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addAgent } from '../services/agentService';
import { AgentCreateDto } from '../models/AgentCreateDto';
import { AddressCreateDto } from '../models/AddressCreateDto';

const AgentAdd: React.FC = () => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAgent(agent);
            navigate('/agent');
        } catch (error) {
            console.error('Error adding agent:', error);
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

    const sectionStyle = {
        padding: '1rem',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        marginBottom: '1rem'
    };

    return (
        <div className="container mt-5">
            <div style={sectionStyle}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
                        <input type="text" className="form-control" id="registrationNumber" name="registrationNumber" value={agent.registrationNumber} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={agent.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="registrationCategory" className="form-label">Registration Category</label>
                        <select className="form-select" id="registrationCategory" name="registrationCategory" value={agent.registrationCategory} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Salesperson">Salesperson</option>
                            <option value="Broker">Broker</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokerageTradeName" className="form-label">Brokerage Trade Name</label>
                        <input type="text" className="form-control" id="brokerageTradeName" name="brokerageTradeName" value={agent.brokerageTradeName} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokeragePhone" className="form-label">Brokerage Phone</label>
                        <input type="text" className="form-control" id="brokeragePhone" name="brokeragePhone" value={agent.brokeragePhone} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="brokerageEmail" className="form-label">Brokerage Email</label>
                        <input type="email" className="form-control" id="brokerageEmail" name="brokerageEmail" value={agent.brokerageEmail} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Brokerage Address</label>
                        <input type="text" className="form-control mb-2" placeholder="Street Number" name="brokerageAddress.streetNumber" value={agent.brokerageAddress.streetNumber} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Street Name" name="brokerageAddress.streetName" value={agent.brokerageAddress.streetName} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Unit (Optional)" name="brokerageAddress.unit" value={agent.brokerageAddress.unit} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="City" name="brokerageAddress.city" value={agent.brokerageAddress.city} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Province" name="brokerageAddress.province" value={agent.brokerageAddress.province} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Postal Code" name="brokerageAddress.postalCode" value={agent.brokerageAddress.postalCode} onChange={handleChange} required />
                        <input type="text" className="form-control" placeholder="Country" name="brokerageAddress.country" value={agent.brokerageAddress.country} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Agent</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    );
};

export default AgentAdd;