import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgentByRegistrationNumber,
  updateAgent,
  patchAgent,
} from "../services/agentService";
import { AgentCreateDto } from "../models/AgentCreateDto";
import { AgentUpdateDto } from "../models/AgentUpdateDto";
import axios from "axios";
import { FaUser, FaBuilding, FaPhone, FaEnvelope, FaMapMarkedAlt } from "react-icons/fa";

const AgentUpdate: React.FC = () => {
  const { registrationNumber } = useParams<{ registrationNumber: string }>();
  const [agent, setAgent] = useState<AgentCreateDto>({
    registrationNumber: "",
    name: "",
    registrationCategory: "",
    brokerageTradeName: "",
    brokeragePhone: "",
    brokerageEmail: "",
    brokerageAddress: {
      streetNumber: "",
      streetName: "",
      unit: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        if (registrationNumber) {
          const data = await getAgentByRegistrationNumber(registrationNumber);
          setAgent(data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to fetch agent");
        } else {
          setError("An unexpected error occurred while fetching agent");
        }
        console.error("Error fetching agent:", error);
      }
    };

    fetchAgent();
  }, [registrationNumber]);

  const validateForm = (): boolean => {
    if (!agent.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!agent.registrationCategory) {
      setError("Registration category is required");
      return false;
    }
    if (!agent.brokerageTradeName.trim()) {
      setError("Brokerage trade name is required");
      return false;
    }
    if (!agent.brokeragePhone.trim()) {
      setError("Brokerage phone is required");
      return false;
    }
    if (!agent.brokerageEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Invalid email format");
      return false;
    }
    if (
      !agent.brokerageAddress.streetNumber.trim() ||
      !agent.brokerageAddress.streetName.trim() ||
      !agent.brokerageAddress.city.trim() ||
      !agent.brokerageAddress.province.trim() ||
      !agent.brokerageAddress.postalCode.trim() ||
      !agent.brokerageAddress.country.trim()
    ) {
      setError("All address fields except unit are required");
      return false;
    }
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setError(""); // Clear error when user makes changes
    if (name.startsWith("brokerageAddress.")) {
      const addressField = name.split(".")[1];
      setAgent({
        ...agent,
        brokerageAddress: {
          ...agent.brokerageAddress,
          [addressField]: value,
        },
      });
    } else {
      setAgent({ ...agent, [name]: value });
    }
  };

  const handleSubmitPatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    const agentUpdateDto: AgentUpdateDto = {
      name: agent.name,
      registrationCategory: agent.registrationCategory,
      brokerageTradeName: agent.brokerageTradeName,
      brokeragePhone: agent.brokeragePhone,
      brokerageEmail: agent.brokerageEmail,
      brokerageAddress: agent.brokerageAddress,
    };

    try {
      await patchAgent(registrationNumber!, agentUpdateDto);
      navigate("/agent");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to update agent");
      } else {
        setError("An unexpected error occurred while updating agent");
      }
      console.error("Error updating agent with PATCH:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setError("");
    setAgent({
      registrationNumber: "",
      name: "",
      registrationCategory: "",
      brokerageTradeName: "",
      brokeragePhone: "",
      brokerageEmail: "",
      brokerageAddress: {
        streetNumber: "",
        streetName: "",
        unit: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Update Agent</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitPatch(e);
                }}
              >
                {/* Agent Information Section */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <FaUser className="me-2" />
                      Agent Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="registrationNumber"
                            className="form-label"
                          >
                            Registration Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="registrationNumber"
                            name="registrationNumber"
                            value={agent.registrationNumber}
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={agent.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="registrationCategory"
                        className="form-label"
                      >
                        Registration Category
                      </label>
                      <select
                        className="form-select"
                        id="registrationCategory"
                        name="registrationCategory"
                        value={agent.registrationCategory}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Salesperson">Salesperson</option>
                        <option value="Broker">Broker</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Brokerage Information Section */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <FaBuilding className="me-2" />
                      Brokerage Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label
                            htmlFor="brokerageTradeName"
                            className="form-label"
                          >
                            <FaBuilding className="me-2" />
                            Brokerage Trade Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="brokerageTradeName"
                            name="brokerageTradeName"
                            value={agent.brokerageTradeName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="brokeragePhone"
                            className="form-label"
                          >
                            <FaPhone className="me-2" />
                            Brokerage Phone
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="brokeragePhone"
                            name="brokeragePhone"
                            value={agent.brokeragePhone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="brokerageEmail"
                            className="form-label"
                          >
                            <FaEnvelope className="me-2" />
                            Brokerage Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="brokerageEmail"
                            name="brokerageEmail"
                            value={agent.brokerageEmail}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <FaMapMarkedAlt className="me-2" />
                      Brokerage Address
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Street Number</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.streetNumber"
                            value={agent.brokerageAddress.streetNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label className="form-label">Street Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.streetName"
                            value={agent.brokerageAddress.streetName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Unit (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.unit"
                            value={agent.brokerageAddress.unit}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.city"
                            value={agent.brokerageAddress.city}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Province</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.province"
                            value={agent.brokerageAddress.province}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.postalCode"
                            value={agent.brokerageAddress.postalCode}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            name="brokerageAddress.country"
                            value={agent.brokerageAddress.country}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating Agent...
                      </>
                    ) : (
                      "Update Agent"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentUpdate;