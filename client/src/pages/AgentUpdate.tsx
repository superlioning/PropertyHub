import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgentByRegistrationNumber,
  updateAgent,
  patchAgent,
} from "../services/agentService";
import { AgentCreateDto } from "../models/AgentCreateDto";
import { AgentUpdateDto } from "../models/AgentUpdateDto";
import { AddressCreateDto } from "../models/AddressCreateDto";
import { sectionStyle } from "../styles/styles";
import axios from "axios";

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
    <div className="container mt-5">
      <div style={sectionStyle}>
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
          <div className="mb-3">
            <label htmlFor="registrationNumber" className="form-label">
              Registration Number
            </label>
            <input
              type="text"
              className="form-control"
              id="registrationNumber"
              name="registrationNumber"
              value={agent.registrationNumber}
              readOnly
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="registrationCategory" className="form-label">
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
          <div className="mb-3">
            <label htmlFor="brokerageTradeName" className="form-label">
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
          <div className="mb-3">
            <label htmlFor="brokeragePhone" className="form-label">
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
          <div className="mb-3">
            <label htmlFor="brokerageEmail" className="form-label">
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
          <div className="mb-3">
            <label className="form-label">Brokerage Address</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Street Number"
              name="brokerageAddress.streetNumber"
              value={agent.brokerageAddress.streetNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Street Name"
              name="brokerageAddress.streetName"
              value={agent.brokerageAddress.streetName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Unit (Optional)"
              name="brokerageAddress.unit"
              value={agent.brokerageAddress.unit}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="City"
              name="brokerageAddress.city"
              value={agent.brokerageAddress.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Province"
              name="brokerageAddress.province"
              value={agent.brokerageAddress.province}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Postal Code"
              name="brokerageAddress.postalCode"
              value={agent.brokerageAddress.postalCode}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              name="brokerageAddress.country"
              value={agent.brokerageAddress.country}
              onChange={handleChange}
              required
            />
          </div>
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
                Updating...
              </>
            ) : (
              "Update Agent"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentUpdate;