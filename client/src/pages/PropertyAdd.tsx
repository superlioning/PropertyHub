import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../services/propertyService';
import { PropertyCreateDto } from '../models/PropertyCreateDto';
import { AddressCreateDto } from '../models/AddressCreateDto';
import { FeatureCreateDto } from '../models/FeatureCreateDto';
import { sectionStyle } from '../styles/styles';

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
    const navigate = useNavigate();

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
        try {
            await addProperty(property);
            navigate('/property');
        } catch (error) {
            console.error('Error adding property:', error);
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
        <div className="container mt-5">
            <div style={sectionStyle}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="mls" className="form-label">MLS</label>
                        <input type="text" className="form-control" id="mls" name="mls" value={property.mls} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type</label>
                        <select className="form-select" id="type" name="type" value={property.type} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Semi">Semi</option>
                            <option value="Detached">Detached</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input type="number" className="form-control" id="price" name="price" value={property.price} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
                        <input type="number" className="form-control" id="bedrooms" name="bedrooms" value={property.bedrooms} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
                        <input type="number" className="form-control" id="bathrooms" name="bathrooms" value={property.bathrooms} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="parkings" className="form-label">Parkings</label>
                        <input type="number" className="form-control" id="parkings" name="parkings" value={property.parkings} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="size" className="form-label">Size (sq ft)</label>
                        <input type="number" className="form-control" id="size" name="size" value={property.size} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="yearBuilt" className="form-label">Year Built</label>
                        <input type="number" className="form-control" id="yearBuilt" name="yearBuilt" value={property.yearBuilt} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tax" className="form-label">Tax</label>
                        <input type="number" className="form-control" id="tax" name="tax" value={property.tax} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control mb-2" placeholder="Street Number" name="address.streetNumber" value={property.address.streetNumber} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Street Name" name="address.streetName" value={property.address.streetName} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Unit (Optional)" name="address.unit" value={property.address.unit} onChange={handleChange} />
                        <input type="text" className="form-control mb-2" placeholder="City" name="address.city" value={property.address.city} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Province" name="address.province" value={property.address.province} onChange={handleChange} required />
                        <input type="text" className="form-control mb-2" placeholder="Postal Code" name="address.postalCode" value={property.address.postalCode} onChange={handleChange} required />
                        <input type="text" className="form-control" placeholder="Country" name="address.country" value={property.address.country} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select className="form-select" id="status" name="status" value={property.status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="For Sale">For Sale</option>
                            <option value="Sold">Sold</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="description" value={property.description} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="agentRegistrationNumber" className="form-label">Agent Registration Number</label>
                        <input type="text" className="form-control" id="agentRegistrationNumber" name="agentRegistrationNumber" value={property.agentRegistrationNumber} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Features</label>
                        <input type="number" className="form-control mb-2" placeholder="Walk Score" name="feature.walkScore" value={property.feature?.walkScore ?? ''} onChange={handleChange} />
                        <input type="number" className="form-control mb-2" placeholder="Transit Score" name="feature.transitScore" value={property.feature?.transitScore ?? ''} onChange={handleChange} />
                        <input type="number" className="form-control mb-2" placeholder="Bike Score" name="feature.bikeScore" value={property.feature?.bikeScore ?? ''} onChange={handleChange} />
                        <input type="number" className="form-control" placeholder="Education Score" name="feature.educationScore" value={property.feature?.educationScore ?? ''} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Property</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={handleReset}>Reset</button>
                </form>
            </div>
        </div>
    );
};

export default PropertyAdd;