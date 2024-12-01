import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBed, FaBath, FaCar, FaRuler, FaCalendar, 
         FaDollarSign, FaMapMarkerAlt, FaClipboardList, FaUserTie, 
         FaImage, FaWalking, FaBus, FaBiking, FaGraduationCap, FaMoneyBill } from 'react-icons/fa';
import { addProperty, addPropertyImages } from "../services/propertyService";
import { PropertyCreateDto } from '../models/PropertyCreateDto';

const sectionCardStyle = {
    padding: '1.5rem',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
    marginBottom: '1.5rem'
};

const iconStyle = {
    marginRight: '0.5rem',
    color: '#6c757d'
};

const PropertyAdd: React.FC = () => {
  const [property, setProperty] = useState<PropertyCreateDto>({
    mls: '',
    type: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkings: 0,
    size: 0,
    yearBuilt: new Date().getFullYear(),
    tax: 0,
    address: {
      streetNumber: '',
      streetName: '',
      unit: '',
      city: '',
      province: '',
      postalCode: '',
      country: ''
    },
    status: '',
    description: '',
    agentRegistrationNumber: '',
    imageUrls: [],
    feature: {
      walkScore: undefined,
      transitScore: undefined,
      bikeScore: undefined,
      educationScore: undefined
    },
    dateListed: new Date(),
    lastUpdate: new Date()
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 10;

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setErrorMessage(
        "Invalid file format. Only JPG, PNG and WebP are allowed."
      );
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size too large. Maximum size is 5MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setErrorMessage("");

    if (files.length + selectedFiles.length > MAX_FILES) {
      setErrorMessage(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }

    const validFiles = files.filter(validateFile);
    setSelectedFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProperty({
        ...property,
        address: {
          ...property.address,
          [addressField]: value
        }
      });
    } else if (name.startsWith('feature.')) {
      const featureField = name.split('.')[1];
      setProperty({
        ...property,
        feature: {
          ...property.feature,
          [featureField]: value === '' ? undefined : Number(value)
        }
      });
    } else {
      setProperty({ ...property, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // First, create the property
      await addProperty(property);

      // Then, upload images if any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("imageUrls", file);
        });
        await addPropertyImages(property.mls, formData);
      }

      navigate("/property");
    } catch (error) {
      console.error("Error adding property:", error);
      setErrorMessage("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setProperty({
      mls: '',
      type: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      parkings: 0,
      size: 0,
      yearBuilt: new Date().getFullYear(),
      tax: 0,
      address: {
        streetNumber: '',
        streetName: '',
        unit: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
      },
      status: '',
      description: '',
      agentRegistrationNumber: '',
      imageUrls: [],
      feature: {
        walkScore: undefined,
        transitScore: undefined,
        bikeScore: undefined,
        educationScore: undefined
      },
      dateListed: new Date(),
      lastUpdate: new Date()
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <h2 className="text-center mb-4">
            <FaHome style={iconStyle} />
            Add New Property
          </h2>

          {errorMessage && (
            <div className="alert alert-danger mb-4">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">Basic Information</h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaClipboardList style={iconStyle} />
                    MLS Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="mls"
                    value={property.mls}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaHome style={iconStyle} />
                    Property Type
                  </label>
                  <select
                    className="form-select"
                    name="type"
                    value={property.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Semi">Semi-Detached</option>
                    <option value="Detached">Detached</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <FaDollarSign style={iconStyle} />
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={property.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">Property Details</h4>
              <div className="row">
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaBed style={iconStyle} />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="bedrooms"
                    value={property.bedrooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaBath style={iconStyle} />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaCar style={iconStyle} />
                    Parkings
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="parkings"
                    value={property.parkings}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaRuler style={iconStyle} />
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="size"
                    value={property.size}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaCalendar style={iconStyle} />
                    Year Built
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="yearBuilt"
                    value={property.yearBuilt}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaMoneyBill style={iconStyle} />
                    Tax
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="tax"
                    value={property.tax}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">
                <FaMapMarkerAlt style={iconStyle} />
                Address
              </h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Street Number"
                    name="address.streetNumber"
                    value={property.address.streetNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Street Name"
                    name="address.streetName"
                    value={property.address.streetName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Unit (Optional)"
                    name="address.unit"
                    value={property.address.unit}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    name="address.city"
                    value={property.address.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Province"
                    name="address.province"
                    value={property.address.province}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Postal Code"
                    name="address.postalCode"
                    value={property.address.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Country"
                    name="address.country"
                    value={property.address.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            {/* Additional Details Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">
                <FaClipboardList style={iconStyle} />
                Additional Details
              </h4>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">
                    <FaHome style={iconStyle} />
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={property.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="For Sale">For Sale</option>
                    <option value="Sold">Sold</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="agentRegistrationNumber"
                    className="form-label"
                  >
                    <FaUserTie style={iconStyle} />
                    Agent Registration Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="agentRegistrationNumber"
                    name="agentRegistrationNumber"
                    value={property.agentRegistrationNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="description" className="form-label">
                    <FaClipboardList style={iconStyle} />
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={property.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">Property Scores</h4>
              <div className="row">
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaWalking style={iconStyle} />
                    Walk Score
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="feature.walkScore"
                    value={property.feature?.walkScore ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaBus style={iconStyle} />
                    Transit Score
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="feature.transitScore"
                    value={property.feature?.transitScore ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaBiking style={iconStyle} />
                    Bike Score
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="feature.bikeScore"
                    value={property.feature?.bikeScore ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <label className="form-label">
                    <FaGraduationCap style={iconStyle} />
                    Education Score
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="feature.educationScore"
                    value={property.feature?.educationScore ?? ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Card */}
            <div style={sectionCardStyle}>
              <h4 className="mb-4">
                <FaImage style={iconStyle} />
                Property Images
              </h4>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <small className="text-muted d-block mt-2">
                  Accepted formats: JPG, PNG, WebP. Max size: 5MB per file. Max
                  files: {MAX_FILES}
                </small>
              </div>
              <div className="row g-3 mt-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-3">
                    <div className="position-relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="img-fluid rounded"
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex gap-3 justify-content-center mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Property..." : "Add Property"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyAdd;