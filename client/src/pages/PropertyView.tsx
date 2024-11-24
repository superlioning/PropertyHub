import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyByMLS } from '../services/propertyService';
import { getAgentByRegistrationNumber } from '../services/agentService';
import { PropertyDto } from '../models/PropertyDto';
import { AgentDto } from '../models/AgentDto';

const PropertyView: React.FC = () => {
    const { mls } = useParams<{ mls: string }>();
    const [property, setProperty] = useState<PropertyDto | null>(null);
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                if (mls) {
                    const data = await getPropertyByMLS(mls);
                    setProperty(data);
                    if (data.agentRegistrationNumber) {
                        const agentData = await getAgentByRegistrationNumber(data.agentRegistrationNumber);
                        setAgent(agentData);
                    }
                }
            } catch (error) {
                console.error('Error fetching property or agent:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [mls]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    const address = `${property.address.unit ? property.address.unit + ' ' : ''}${property.address.streetNumber} ${property.address.streetName}, ${property.address.city}, ${property.address.province} ${property.address.postalCode}, ${property.address.country}`;

    return (
        <div>
            <h1>{property.type}</h1>
            <p>Price: ${property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Parkings: {property.parkings}</p>
            <p>Size: {property.size} sq ft</p>
            <p>Year Built: {property.yearBuilt}</p>
            <p>Tax: ${property.tax}</p>
            <p>Address: {address}</p>
            <p>Status: {property.status}</p>
            <p>Description: {property.description}</p>
            {agent && (
                <div>
                    <h2>Agent Information</h2>
                    <p>Name: {agent.name}</p>
                    <p>Registration Category: {agent.registrationCategory}</p>
                    <p>Brokerage Trade Name: {agent.brokerageTradeName}</p>
                    <Link to={`/agent/${agent.registrationNumber}`} className="btn btn-primary">
                        Agent Detail
                    </Link>
                </div>
            )}
            <div>
                {property.imageUrls?.map((url, index) => (
                    <img key={index} src={url} alt={`Property image ${index + 1}`} className="img-fluid mb-2" />
                ))}
            </div>
        </div>
    );
};

export default PropertyView;