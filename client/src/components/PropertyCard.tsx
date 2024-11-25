import React from 'react';
import { Link } from 'react-router-dom';
import { PropertyDto } from '../models/PropertyDto';

interface PropertyCardProps {
    property: PropertyDto;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const address = `${property.address.unit ? property.address.unit + ' ' : ''}${property.address.streetNumber} ${property.address.streetName}, ${property.address.city}, ${property.address.province} ${property.address.postalCode}, ${property.address.country}`;

    return (
        <div className="card mb-3">
            <img src={property.imageUrls?.[0]} className="card-img-top" alt="Property" />
            <div className="card-img-overlay text-white bg-dark bg-opacity-50">
                <h5 className="card-title">{property.type}</h5>
                <p className="card-text">${property.price}</p>
                <p className="card-text">{property.bedrooms} Bedrooms</p>
                <p className="card-text">{property.bathrooms} Bathrooms</p>
                <p className="card-text">{property.parkings} Parkings</p>
                <p className="card-text">{address}</p>
                <Link to={`/property/${property.mls}`} className="btn btn-primary">
                    View Detail
                </Link>
            </div>
        </div>
    );
};

export default PropertyCard;