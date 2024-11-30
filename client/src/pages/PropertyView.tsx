import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyByMLS, deleteProperty } from "../services/propertyService";
import { PropertyDto } from "../models/PropertyDto";
import { AgentDto } from "../models/AgentDto";
import { getAgentByRegistrationNumber } from "../services/agentService";
import { Link } from "react-router-dom";
import { sectionStyle } from "../styles/styles";

const PropertyView: React.FC = () => {
  const { mls } = useParams<{ mls: string }>();
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [agent, setAgent] = useState<AgentDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (mls) {
          const data = await getPropertyByMLS(mls);
          setProperty(data);
          if (data.agentRegistrationNumber) {
            const agentData = await getAgentByRegistrationNumber(
              data.agentRegistrationNumber
            );
            setAgent(agentData);
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [mls]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(mls!);
        navigate("/property");
      } catch (error) {
        console.error("Error deleting property:", error);
        setError("Failed to delete property");
      }
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Property not found
      </div>
    );
  }

  const address = `${property.address.streetNumber} ${property.address.streetName}, ${property.address.city}, ${property.address.province}, ${property.address.postalCode}, ${property.address.country}`;

  return (
    <div className="container mt-5">
      <div style={sectionStyle}>
        <h1 className="mb-4">{property.mls}</h1>

        <div className="row">
          <div className="col-md-6">
            <p>Type: {property.type}</p>
            <p>Price: ${property.price.toLocaleString()}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Parkings: {property.parkings}</p>
            <p>Size: {property.size.toLocaleString()} sq ft</p>
            <p>Year Built: {property.yearBuilt}</p>
            <p>Tax: ${property.tax.toLocaleString()}</p>
            <p>Address: {address}</p>
            <p>Status: {property.status}</p>
          </div>
          <div className="col-md-6">
            <p>Description: {property.description}</p>
            <p>
              Date Listed: {new Date(property.dateListed).toLocaleDateString()}
            </p>
            <p>
              Last Update: {new Date(property.lastUpdate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {property.imageUrls && property.imageUrls.length > 0 && (
          <div className="mt-4">
            <h2 className="mb-3">Images</h2>
            <div className="row g-3">
              {property.imageUrls.map((url, index) => (
                <div key={index} className="col-md-4">
                  <img
                    src={url}
                    alt={`Property Image ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {property.feature && (
          <div className="mt-4">
            <h2 className="mb-3">Features</h2>
            <div className="row">
              <div className="col-md-3">
                <p>Walk Score: {property.feature.walkScore}</p>
              </div>
              <div className="col-md-3">
                <p>Transit Score: {property.feature.transitScore}</p>
              </div>
              <div className="col-md-3">
                <p>Bike Score: {property.feature.bikeScore}</p>
              </div>
              <div className="col-md-3">
                <p>Education Score: {property.feature.educationScore}</p>
              </div>
            </div>
          </div>
        )}

        {agent && (
          <div className="mt-4">
            <h2 className="mb-3">Agent Information</h2>
            <div className="card">
              <div className="card-body">
                <p>Name: {agent.name}</p>
                <p>Registration Category: {agent.registrationCategory}</p>
                <p>Brokerage Trade Name: {agent.brokerageTradeName}</p>
                <Link
                  to={`/agent/${agent.registrationNumber}`}
                  className="btn btn-primary"
                >
                  View Agent Details
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/property/update/${mls}`)}
          >
            Update Property
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyView;