import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropertyByMLS, updateProperty, patchProperty, addPropertyImages, updatePropertyImage, deletePropertyImages } from '../services/propertyService';
import { PropertyDto } from '../models/PropertyDto';
import { PropertyUpdateDto } from '../models/PropertyUpdateDto';
import { sectionStyle } from '../styles/styles';

const PropertyUpdate: React.FC = () => {
    const { mls } = useParams<{ mls: string }>();
    const [property, setProperty] = useState<PropertyDto>({
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

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                if (mls) {
                    const data = await getPropertyByMLS(mls);
                    setProperty(data);
                }
            } catch (error) {
                console.error('Error fetching property:', error);
            }
        };

        fetchProperty();
    }, [mls]);

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
        // Create a patch document with only changed fields
        const patchDocument = [
          { op: "replace", path: "/type", value: property.type },
          { op: "replace", path: "/price", value: property.price },
          { op: "replace", path: "/bedrooms", value: property.bedrooms },
          { op: "replace", path: "/bathrooms", value: property.bathrooms },
          { op: "replace", path: "/parkings", value: property.parkings },
          { op: "replace", path: "/size", value: property.size },
          { op: "replace", path: "/yearBuilt", value: property.yearBuilt },
          { op: "replace", path: "/tax", value: property.tax },
          { op: "replace", path: "/address", value: property.address },
          { op: "replace", path: "/status", value: property.status },
          { op: "replace", path: "/description", value: property.description },
          {
            op: "replace",
            path: "/agentRegistrationNumber",
            value: property.agentRegistrationNumber,
          },
          { op: "replace", path: "/imageUrls", value: property.imageUrls },
          { op: "replace", path: "/feature", value: property.feature },
          { op: "replace", path: "/lastUpdate", value: new Date() },
        ];

        await patchProperty(mls!, patchDocument);

        // Then upload any new images
        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => formData.append("imageUrls", file));
          await addPropertyImages(mls!, formData);
        }
        navigate("/property");
      } catch (error) {
        console.error("Error updating property:", error);
        setErrorMessage("Failed to update property. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleReset = async () => {
      if (window.confirm("Are you sure you want to reset all changes?")) {
        try {
          setIsSubmitting(true);
          if (mls) {
            const data = await getPropertyByMLS(mls);
            setProperty(data);
            setErrorMessage("");
          }
        } catch (error) {
          setErrorMessage("Failed to reset form. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const handleDeleteImages = async (imageUrls: string[]) => {
      try {
        setIsSubmitting(true);
        await deletePropertyImages(mls!, imageUrls);
        const data = await getPropertyByMLS(mls!);
        setProperty(data);
      } catch (error) {
        console.error("Error deleting property images:", error);
        setErrorMessage("Failed to delete images. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setErrorMessage("");

      if (files.length + (property.imageUrls?.length || 0) > MAX_FILES) {
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

    const removeImage = (index: number, isExisting: boolean) => {
      if (isExisting) {
        if (!property.imageUrls) return;
        if (window.confirm("Are you sure you want to delete this image?")) {
          const imageUrl = property.imageUrls[index];
          handleDeleteImages([imageUrl]);
        }
      } else {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="container mt-5">
        <div style={sectionStyle}>
          {errorMessage && (
            <div className="alert alert-danger mb-3">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mls" className="form-label">
                MLS
              </label>
              <input
                type="text"
                className="form-control"
                id="mls"
                name="mls"
                value={property.mls}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <select
                className="form-select"
                id="type"
                name="type"
                value={property.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Semi">Semi</option>
                <option value="Detached">Detached</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={property.price}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bedrooms" className="form-label">
                Bedrooms
              </label>
              <input
                type="number"
                className="form-control"
                id="bedrooms"
                name="bedrooms"
                value={property.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bathrooms" className="form-label">
                Bathrooms
              </label>
              <input
                type="number"
                className="form-control"
                id="bathrooms"
                name="bathrooms"
                value={property.bathrooms}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="parkings" className="form-label">
                Parkings
              </label>
              <input
                type="number"
                className="form-control"
                id="parkings"
                name="parkings"
                value={property.parkings}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="size" className="form-label">
                Size (sq ft)
              </label>
              <input
                type="number"
                className="form-control"
                id="size"
                name="size"
                value={property.size}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="yearBuilt" className="form-label">
                Year Built
              </label>
              <input
                type="number"
                className="form-control"
                id="yearBuilt"
                name="yearBuilt"
                value={property.yearBuilt}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tax" className="form-label">
                Tax
              </label>
              <input
                type="number"
                className="form-control"
                id="tax"
                name="tax"
                value={property.tax}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Street Number"
                name="address.streetNumber"
                value={property.address.streetNumber}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Street Name"
                name="address.streetName"
                value={property.address.streetName}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Unit (Optional)"
                name="address.unit"
                value={property.address.unit}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="City"
                name="address.city"
                value={property.address.city}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Province"
                name="address.province"
                value={property.address.province}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Postal Code"
                name="address.postalCode"
                value={property.address.postalCode}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                name="address.country"
                value={property.address.country}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={property.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="For Sale">For Sale</option>
                <option value="Sold">Sold</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={property.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="agentRegistrationNumber" className="form-label">
                Agent Registration Number
              </label>
              <input
                type="text"
                className="form-control"
                id="agentRegistrationNumber"
                name="agentRegistrationNumber"
                value={property.agentRegistrationNumber}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Features</label>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Walk Score"
                name="feature.walkScore"
                value={property.feature?.walkScore ?? ""}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Transit Score"
                name="feature.transitScore"
                value={property.feature?.transitScore ?? ""}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Bike Score"
                name="feature.bikeScore"
                value={property.feature?.bikeScore ?? ""}
                onChange={handleChange}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Education Score"
                name="feature.educationScore"
                value={property.feature?.educationScore ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Property Images</label>
              <input
                type="file"
                className="form-control"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <small className="text-muted d-block mt-1">
                Accepted formats: JPG, PNG, WebP. Max size: 5MB per file. Max
                files: {MAX_FILES}
              </small>

              <div className="mt-3 d-flex flex-wrap gap-3">
                {/* Existing Images */}
                {property.imageUrls?.map((url, index) => (
                  <div key={`existing-${index}`} className="position-relative">
                    <img
                      src={url}
                      alt={`Existing ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      onClick={() => removeImage(index, true)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* New Image Previews */}
                {previewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="position-relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      onClick={() => removeImage(index, false)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Property"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default PropertyUpdate;