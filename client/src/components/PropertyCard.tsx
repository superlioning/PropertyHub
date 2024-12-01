import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyDto } from '../models/PropertyDto';

interface PropertyCardProps {
    property: PropertyDto;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const shortAddress = `${property.address.streetNumber} ${property.address.streetName}, ${property.address.city}`;

  return (
    <div className="property-card-container">
      <div className="property-image">
        <img
          src={property.imageUrls?.[0] || "/placeholder-home.jpg"}
          alt="Property"
        />
      </div>
      <div className="property-info">
        <div className="property-price">{formatPrice(property.price)}</div>
        <div className="property-type">{property.type}</div>
        <div className="property-specs">
          <span>
            <strong>{property.bedrooms}</strong> beds
          </span>
          <span>
            <strong>{property.bathrooms}</strong> baths
          </span>
          <span>
            <strong>{property.size}</strong> sqft
          </span>
        </div>
        <div className="property-address">{shortAddress}</div>
        <Link to={`/property/${property.mls}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;