import React from "react";
import { CSSProperties } from "react";
import { FaHome, FaSearchLocation, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const imageStyle: CSSProperties = {
    height: "600px",
    objectFit: "cover",
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))",
    zIndex: 1,
  };

  const navigate = useNavigate();
  const handleViewProperties = () => {
    navigate("/property");
  };

  const handleContactAgent = () => {
    navigate("/agent");
  };

  return (
    <>
      <div className="hero-section position-relative">
        <div
          id="carouselExampleRide"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div style={overlayStyle}></div>
              <img
                src="/home_1.jpg"
                className="d-block w-100"
                alt="Home 1"
                style={imageStyle}
              />
              <div className="carousel-caption" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-4">
                  Find Your Dream Property
                </h1>
                <p className="lead mb-4">
                  Discover the perfect place to call home
                </p>
                <button
                  className="btn btn-primary btn-lg px-4 me-2"
                  onClick={handleViewProperties}
                >
                  View Properties
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={handleContactAgent}
                >
                  Contact Agent
                </button>
              </div>
            </div>
            <div className="carousel-item">
              <div style={overlayStyle}></div>
              <img
                src="/home_2.jpg"
                className="d-block w-100"
                alt="Home 2"
                style={imageStyle}
              />
              <div className="carousel-caption" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-4">
                  Find Your Dream Property
                </h1>
                <p className="lead mb-4">
                  Discover the perfect place to call home
                </p>
                <button className="btn btn-primary btn-lg px-4 me-2">
                  View Properties
                </button>
                <button className="btn btn-outline-light btn-lg px-4">
                  Contact Agent
                </button>
              </div>
            </div>
            <div className="carousel-item">
              <div style={overlayStyle}></div>
              <img
                src="/home_3.jpg"
                className="d-block w-100"
                alt="Home 3"
                style={imageStyle}
              />
              <div className="carousel-caption" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-4">
                  Find Your Dream Property
                </h1>
                <p className="lead mb-4">
                  Discover the perfect place to call home
                </p>
                <button className="btn btn-primary btn-lg px-4 me-2">
                  View Properties
                </button>
                <button className="btn btn-outline-light btn-lg px-4">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleRide"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleRide"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose PropertyHub?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <FaHome
                    className="feature-icon mb-3"
                    size={80}
                    color="#0d6efd"
                  />
                  <h4>Wide Selection</h4>
                  <p className="text-muted">
                    Browse through thousands of properties that match your
                    criteria.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <FaSearchLocation
                    className="feature-icon mb-3"
                    size={80}
                    color="#0d6efd"
                  />
                  <h4>Smart Search</h4>
                  <p className="text-muted">
                    Find exactly what you're looking for with our advanced
                    filters.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body text-center p-4">
                  <FaHandshake
                    className="feature-icon mb-3"
                    size={80}
                    color="#0d6efd"
                  />
                  <h4>Expert Agents</h4>
                  <p className="text-muted">
                    Connect with professional agents who can guide you through
                    the process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;