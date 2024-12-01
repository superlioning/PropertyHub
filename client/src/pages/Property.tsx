import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getProperties, getPropertyByMLS } from "../services/propertyService";
import { getPropertiesByAgent } from "../services/agentService";
import {
  getPropertiesByStreet,
  getPropertiesByCity,
  getPropertiesByPostalCode,
} from "../services/addressService";
import { PropertyDto } from "../models/PropertyDto";
import PropertyCard from "../components/PropertyCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Property.css";
import {
  FaSearch,
  FaFilter,
  FaHome,
  FaDollarSign,
  FaBed,
  FaBath,
  FaCar,
  FaRuler,
  FaCalendar,
  FaMoneyBill,
} from "react-icons/fa";

const Property: React.FC = () => {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [streetNumber, setStreetNumber] = useState<string>("");
  const [streetName, setStreetName] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("mls");
  const [searchResult, setSearchResult] = useState<PropertyDto[]>([]);
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyStatus, setPropertyStatus] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 1000000000,
  ]);
  const [bedroomsRange, setBedroomsRange] = useState<[number, number]>([0, 10]);
  const [bathroomsRange, setBathroomsRange] = useState<[number, number]>([
    0, 10,
  ]);
  const [parkingsRange, setParkingsRange] = useState<[number, number]>([0, 10]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 100000]);
  const [yearBuiltRange, setYearBuiltRange] = useState<[number, number]>([
    1900,
    new Date().getFullYear(),
  ]);
  const [taxRange, setTaxRange] = useState<[number, number]>([0, 100000]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
        setSearchResult(data);
        setError("");
      } catch (error) {
        setError("Error fetching properties. Please try again later.");
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = async () => {
    setSearchLoading(true);
    setError("");
    try {
      let result: PropertyDto[] = [];
      switch (searchType) {
        case "mls":
          const property = await getPropertyByMLS(search);
          result = property ? [property] : [];
          break;
        case "agent":
          result = await getPropertiesByAgent(search);
          break;
        case "street":
          if (!streetNumber || !streetName) {
            throw new Error("Street number and name are required");
          }
          result = await getPropertiesByStreet(
            streetNumber.trim(),
            streetName.trim(),
            unit.trim()
          );
          break;
        case "city":
          result = await getPropertiesByCity(search);
          break;
        case "postalCode":
          result = await getPropertiesByPostalCode(search);
          break;
        default:
          break;
      }
      setSearchResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during search";
      setError(errorMessage);
      setSearchResult([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setSearch("");
    setStreetNumber("");
    setStreetName("");
    setUnit("");
    setSearchResult(properties);
    setPropertyType("");
    setPropertyStatus("");
    setPriceRange([0, 1000000000]);
    setBedroomsRange([0, 10]);
    setBathroomsRange([0, 10]);
    setParkingsRange([0, 10]);
    setSizeRange([0, 100000]);
    setYearBuiltRange([1900, new Date().getFullYear()]);
    setTaxRange([0, 100000]);
    setError("");
  }, [properties]);

  const filteredProperties = useMemo(() => {
    // Start with the original properties array for filter operations
    let filtered = properties; // Changed from searchResult

    // Only apply searchResult filter if there are search results
    if (searchResult.length > 0) {
      const searchMLSSet = new Set(searchResult.map((p) => p.mls));
      filtered = filtered.filter((p) => searchMLSSet.has(p.mls));
    }

    if (propertyType) {
      filtered = filtered.filter((property) => property.type === propertyType);
    }
    if (propertyStatus) {
      filtered = filtered.filter(
        (property) => property.status === propertyStatus
      );
    }
    return filtered.filter(
      (property) =>
        property.price >= priceRange[0] &&
        property.price <= priceRange[1] &&
        property.bedrooms >= bedroomsRange[0] &&
        property.bedrooms <= bedroomsRange[1] &&
        property.bathrooms >= bathroomsRange[0] &&
        property.bathrooms <= bathroomsRange[1] &&
        property.parkings >= parkingsRange[0] &&
        property.parkings <= parkingsRange[1] &&
        property.size >= sizeRange[0] &&
        property.size <= sizeRange[1] &&
        property.yearBuilt >= yearBuiltRange[0] &&
        property.yearBuilt <= yearBuiltRange[1] &&
        property.tax >= taxRange[0] &&
        property.tax <= taxRange[1]
    );
  }, [
    properties,
    searchResult,
    propertyType,
    propertyStatus,
    priceRange,
    bedroomsRange,
    bathroomsRange,
    parkingsRange,
    sizeRange,
    yearBuiltRange,
    taxRange,
  ]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="property-container">
      <div className="row">
        <div className="col-md-6">
          <div className="search-section">
            <h3 className="section-title">
              <FaSearch /> Search Properties
            </h3>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <select
                className="form-select form-select-lg mb-3"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="mls">MLS</option>
                <option value="agent">Agent</option>
                <option value="street">Street</option>
                <option value="city">City</option>
                <option value="postalCode">Postal Code</option>
              </select>
              {searchType === "street" ? (
                <div className="street-inputs">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter Street Number"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    aria-label="Street number input"
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter Street Name"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    aria-label="Street name input"
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Unit (Optional)"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    aria-label="Unit number input"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder={`Enter ${searchType}`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
              <div className="search-buttons">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSearch}
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" /> Search
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="filter-section">
            <h3 className="section-title">
              <FaFilter /> Filters
            </h3>

            <div className="filter-group">
              <select
                className="form-select mb-3"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Semi">Semi</option>
                <option value="Detached">Detached</option>
              </select>

              <select
                className="form-select mt-2"
                value={propertyStatus}
                onChange={(e) => setPropertyStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="For Sale">For Sale</option>
                <option value="Sold">Sold</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaDollarSign /> Price Range
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={1000000000}
                  min={0}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                  className="custom-slider"
                />
                <div className="range-value">
                  ${priceRange[0].toLocaleString()} - $
                  {priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaBed /> Bedrooms
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={10}
                  min={0}
                  value={bedroomsRange}
                  onChange={(value) =>
                    setBedroomsRange(value as [number, number])
                  }
                  className="custom-slider"
                />
                <div className="range-value">
                  {bedroomsRange[0].toLocaleString()} -{" "}
                  {bedroomsRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaBath /> Bathrooms
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={10}
                  min={0}
                  value={bathroomsRange}
                  onChange={(value) =>
                    setBathroomsRange(value as [number, number])
                  }
                  className="custom-slider"
                />
                <div className="range-value">
                  {bathroomsRange[0].toLocaleString()} -{" "}
                  {bathroomsRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaCar /> Parkings
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={10}
                  min={0}
                  value={parkingsRange}
                  onChange={(value) =>
                    setParkingsRange(value as [number, number])
                  }
                  className="custom-slider"
                />
                <div className="range-value">
                  {parkingsRange[0].toLocaleString()} -{" "}
                  {parkingsRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaRuler /> Size (sq ft)
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={100000}
                  min={0}
                  value={sizeRange}
                  onChange={(value) => setSizeRange(value as [number, number])}
                  className="custom-slider"
                />
                <div className="range-value">
                  {sizeRange[0].toLocaleString()} -{" "}
                  {sizeRange[1].toLocaleString()}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">
                <FaCalendar /> Year Built
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={new Date().getFullYear()}
                  min={1900}
                  value={yearBuiltRange}
                  onChange={(value) =>
                    setYearBuiltRange(value as [number, number])
                  }
                  className="custom-slider"
                />
                <div className="range-value">
                  {yearBuiltRange[0].toLocaleString()} -{" "}
                  {yearBuiltRange[1].toLocaleString()}
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label className="filter-label">
                <FaMoneyBill /> Tax
              </label>
              <div className="slider-container">
                <Slider
                  range
                  max={100000}
                  min={0}
                  value={taxRange}
                  onChange={(value) => setTaxRange(value as [number, number])}
                  className="custom-slider"
                />
                <div className="range-value">
                  {taxRange[0].toLocaleString()} -{" "}
                  {taxRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="results-section mt-4">
        <h3 className="section-title mb-3">
          <FaHome /> Properties ({filteredProperties.length})
        </h3>

        <div className="property-grid">
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.mls} property={property} />
            ))
          ) : (
            <div className="no-results">No properties found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Property;