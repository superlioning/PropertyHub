import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyByMLS, deleteProperty } from '../services/propertyService';
import { PropertyDto } from '../models/PropertyDto';
import { AgentDto } from '../models/AgentDto';
import { getAgentByRegistrationNumber } from '../services/agentService';
import { Link } from 'react-router-dom';
import { sectionStyle } from '../styles/styles';

const PropertyView: React.FC = () => {
    const { mls } = useParams<{ mls: string }>();
    const [property, setProperty] = useState<PropertyDto | null>(null);
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

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
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [mls]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(mls!);
                navigate('/property');
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!property) {
        return <div>Property not found</div>;
    }

    const address = `${property.address.streetNumber} ${property.address.streetName}, ${property.address.city}, ${property.address.province}, ${property.address.postalCode}, ${property.address.country}`;

    return (
        <div className="container mt-5">
            <div style={sectionStyle}>
                <h1>{property.mls}</h1>
                <p>Type: {property.type}</p>
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
                <p>Date Listed: {new Date(property.dateListed).toLocaleDateString()}</p>
                <p>Last Update: {new Date(property.lastUpdate).toLocaleDateString()}</p>
                {property.imageUrls && property.imageUrls.length > 0 && (
                    <div>
                        <h2>Images</h2>
                        {property.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Property Image ${index + 1}`} style={{ width: '200px', marginRight: '10px' }} />
                        ))}
                    </div>
                )}
                {property.feature && (
                    <div>
                        <h2>Features</h2>
                        <p>Walk Score: {property.feature.walkScore}</p>
                        <p>Transit Score: {property.feature.transitScore}</p>
                        <p>Bike Score: {property.feature.bikeScore}</p>
                        <p>Education Score: {property.feature.educationScore}</p>
                    </div>
                )}
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
                <button className="btn btn-primary" onClick={() => navigate(`/property/update/${mls}`)}>Update</button>
                <button className="btn btn-danger ms-2" onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default PropertyView;