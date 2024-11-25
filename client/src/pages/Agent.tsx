import React, { useEffect, useState } from 'react';
import { getAgents, getAgentByRegistrationNumber } from '../services/agentService';
import { AgentDto } from '../models/AgentDto';
import AgentCard from '../components/AgentCard';
import { sectionStyle } from '../styles/styles';

const Agent: React.FC = () => {
    const [agents, setAgents] = useState<AgentDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<AgentDto | null>(null);
    const [registrationCategory, setRegistrationCategory] = useState<string>('');
    const [filteredAgents, setFilteredAgents] = useState<AgentDto[]>([]);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const data = await getAgents();
                setAgents(data);
                setFilteredAgents(data);
            } catch (error) {
                console.error('Error fetching agents:', error);
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
            console.error('Error fetching agent by registration number:', error);
            setSearchResult(null);
            setFilteredAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearch('');
        setSearchResult(null);
        setRegistrationCategory('');
        setFilteredAgents(agents);
    };

    const handleFilter = () => {
        let filtered = searchResult ? [searchResult] : agents;
        if (registrationCategory) {
            filtered = filtered.filter(agent => agent.registrationCategory === registrationCategory);
        }
        setFilteredAgents(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [registrationCategory, searchResult, agents]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6" style={sectionStyle}>
                    <h3>Search Criteria</h3>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Registration Number"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="btn btn-secondary mt-2 ms-2" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
                <div className="col-md-6" style={sectionStyle}>
                    <h3>Additional Filter</h3>
                    <div className="mb-3">
                        <select className="form-select" value={registrationCategory} onChange={(e) => setRegistrationCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="Salesperson">Salesperson</option>
                            <option value="Broker">Broker</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="row mt-4" style={sectionStyle}>
                <div className="col-md-12">
                    <h3>Results</h3>
                    <div className="row">
                        {filteredAgents.length > 0 ? (
                            filteredAgents.map((agent) => (
                                <div className="col-md-4 mb-3" key={agent.registrationNumber}>
                                    <AgentCard agent={agent} />
                                </div>
                            ))
                        ) : (
                            <div>No agents found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Agent;