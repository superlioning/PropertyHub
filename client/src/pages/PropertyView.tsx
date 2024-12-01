import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBed, FaBath, FaCar, FaRulerCombined, FaCalendarAlt, 
         FaDollarSign, FaHome, FaMapMarkerAlt, FaMoneyBill, FaCalendar } from 'react-icons/fa';
import { Carousel } from 'react-bootstrap';
import "./PropertyView.css";
import { getPropertyByMLS, deleteProperty } from "../services/propertyService";
import { PropertyDto } from "../models/PropertyDto";
import { AgentDto } from "../models/AgentDto";
import { getAgentByRegistrationNumber } from "../services/agentService";
import { Link } from "react-router-dom";

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
            try {
              const agentData = await getAgentByRegistrationNumber(
                data.agentRegistrationNumber
              );
              setAgent(agentData);
            } catch (agentError) {
              console.error("Error fetching agent:", agentError);
              // Don't set the main error state, just log agent error
            }
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
      <div className="property-container">
        {/* Header Section */}
        <div className="property-header mb-4">
          <h1>{property.mls}</h1>
          <h2 className="text-primary">${property.price.toLocaleString()}</h2>
          <p className="lead">
            <FaMapMarkerAlt className="icon me-2" />
            {address}
          </p>
        </div>

        {/* Image Gallery */}
        {property.imageUrls && property.imageUrls.length > 0 && (
          <div className="property-gallery mb-4">
            <Carousel>
              {property.imageUrls.map((url, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={url}
                    alt={`Property Image ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}

        {/* Main Info Cards */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Property Details</h3>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaHome className="icon" />
                      <span className="label">Type</span>
                      <span className="value">{property.type}</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaBed className="icon" />
                      <span className="label">Bedrooms</span>
                      <span className="value">{property.bedrooms}</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaBath className="icon" />
                      <span className="label">Bathrooms</span>
                      <span className="value">{property.bathrooms}</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaCar className="icon" />
                      <span className="label">Parking</span>
                      <span className="value">{property.parkings}</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaCalendar className="icon" />
                      <span className="label">Year Built</span>
                      <span className="value">{property.yearBuilt}</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaRulerCombined className="icon" />
                      <span className="label">Size</span>
                      <span className="value">{property.size.toLocaleString()} sq ft</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="detail-item">
                      <FaMoneyBill className="icon" />
                      <span className="label">Tax</span>
                      <span className="value">${property.tax.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Status Info</h3>
                <div className="status-item">
                  <FaHome className="icon" />
                  <span className="label">Status</span>
                  <span className="value badge bg-success">{property.status}</span>
                </div>
                <div className="status-item">
                  <FaCalendarAlt className="icon" />
                  <span className="label">Listed</span>
                  <span className="value">{new Date(property.dateListed).toLocaleDateString()}</span>
                </div>
                <div className="status-item">
                  <FaCalendarAlt className="icon" />
                  <span className="label">Update</span>
                  <span className="value">{new Date(property.lastUpdate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Description</h3>
            <p className="card-text">{property.description}</p>
          </div>
        </div>

        {/* Features Section */}
        {property.feature && (
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-4">Location Features</h3>
              <div className="row">
                {[
                  { label: 'Walk Score', value: property.feature.walkScore },
                  { label: 'Transit Score', value: property.feature.transitScore },
                  { label: 'Bike Score', value: property.feature.bikeScore },
                  { label: 'Education Score', value: property.feature.educationScore }
                ].map((item, index) => (
                  <div key={index} className="col-md-3 col-6">
                    <div className="score-item">
                      <div className="score-circle">{item.value}</div>
                      <div className="score-label">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Agent Section */}
        {agent && (
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-4">Agent Information</h3>
              <div className="agent-info">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h4>{agent.name}</h4>
                    <p className="mb-2">{agent.registrationCategory}</p>
                    <p className="mb-2">{agent.brokerageTradeName}</p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Link to={`/agent/${agent.registrationNumber}`}
                      className="btn btn-primary mb-2 w-100">
                      View Agent Details
                    </Link>
                    <button className="btn btn-outline-primary w-100"
                      onClick={() => window.location.href = `mailto:?subject=Property Inquiry: ${property.mls}`}>
                      Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-primary"
            onClick={() => navigate(`/property/update/${mls}`)}>
            Update Property
          </button>
          <button className="btn btn-danger"
            onClick={handleDelete}>
            Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyView;