import React, { useEffect, useState } from 'react';
import { getProperties, getPropertyByMLS } from '../services/propertyService';
import { getPropertiesByAgent } from '../services/agentService';
import { getPropertiesByStreet, getPropertiesByCity, getPropertiesByPostalCode } from '../services/addressService';
import { PropertyDto } from '../models/PropertyDto';
import PropertyCard from '../components/PropertyCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Property: React.FC = () => {
    const [properties, setProperties] = useState<PropertyDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [streetNumber, setStreetNumber] = useState<string>('');
    const [streetName, setStreetName] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('mls');
    const [searchResult, setSearchResult] = useState<PropertyDto[] | null>(null);
    const [filteredProperties, setFilteredProperties] = useState<PropertyDto[] | null>(null);
    const [propertyType, setPropertyType] = useState<string>('');
    const [propertyStatus, setPropertyStatus] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000000]);
    const [bedroomsRange, setBedroomsRange] = useState<[number, number]>([0, 10]);
    const [bathroomsRange, setBathroomsRange] = useState<[number, number]>([0, 10]);
    const [parkingsRange, setParkingsRange] = useState<[number, number]>([0, 10]);
    const [sizeRange, setSizeRange] = useState<[number, number]>([0, 100000]);
    const [yearBuiltRange, setYearBuiltRange] = useState<[number, number]>([1900, new Date().getFullYear()]);
    const [taxRange, setTaxRange] = useState<[number, number]>([0, 100000]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getProperties();
                setProperties(data);
                setFilteredProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            let result: PropertyDto[] | PropertyDto | null = null;
            switch (searchType) {
                case 'mls':
                    result = [await getPropertyByMLS(search)];
                    break;
                case 'agent':
                    result = await getPropertiesByAgent(search);
                    break;
                case 'street':
                    result = await getPropertiesByStreet(streetNumber.trim(), streetName.trim(), unit.trim());
                    break;
                case 'city':
                    result = await getPropertiesByCity(search);
                    break;
                case 'postalCode':
                    result = await getPropertiesByPostalCode(search);
                    break;
                default:
                    break;
            }
            setSearchResult(result ? (Array.isArray(result) ? result : [result]) : null);
            setFilteredProperties(result ? (Array.isArray(result) ? result : [result]) : null);
        } catch (error) {
            console.error(`Error fetching properties by ${searchType}:`, error);
            setSearchResult(null);
            setFilteredProperties(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearch('');
        setStreetNumber('');
        setStreetName('');
        setUnit('');
        setSearchResult(null);
        setFilteredProperties(properties);
        setPropertyType('');
        setPropertyStatus('');
        setPriceRange([0, 1000000000]);
        setBedroomsRange([0, 10]);
        setBathroomsRange([0, 10]);
        setParkingsRange([0, 10]);
        setSizeRange([0, 100000]);
        setYearBuiltRange([1900, new Date().getFullYear()]);
        setTaxRange([0, 100000]);
    };

    const handleFilter = () => {
        let filtered = searchResult || properties;
        if (propertyType) {
            filtered = filtered.filter(property => property.type === propertyType);
        }
        if (propertyStatus) {
            filtered = filtered.filter(property => property.status === propertyStatus);
        }
        filtered = filtered.filter(property =>
            property.price >= priceRange[0] && property.price <= priceRange[1] &&
            property.bedrooms >= bedroomsRange[0] && property.bedrooms <= bedroomsRange[1] &&
            property.bathrooms >= bathroomsRange[0] && property.bathrooms <= bathroomsRange[1] &&
            property.parkings >= parkingsRange[0] && property.parkings <= parkingsRange[1] &&
            property.size >= sizeRange[0] && property.size <= sizeRange[1] &&
            property.yearBuilt >= yearBuiltRange[0] && property.yearBuilt <= yearBuiltRange[1] &&
            property.tax >= taxRange[0] && property.tax <= taxRange[1]
        );
        setFilteredProperties(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [propertyType, propertyStatus, priceRange, bedroomsRange, bathroomsRange, parkingsRange, sizeRange, yearBuiltRange, taxRange]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const sectionStyle = {
        padding: '1rem',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        marginBottom: '1rem'
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-6" style={sectionStyle}>
                    <h3>Search Criteria</h3>
                    <div className="mb-3">
                        <select className="form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="mls">MLS</option>
                            <option value="agent">Agent</option>
                            <option value="street">Street</option>
                            <option value="city">City</option>
                            <option value="postalCode">Postal Code</option>
                        </select>
                        {searchType === 'street' ? (
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Enter Street Number"
                                    value={streetNumber}
                                    onChange={(e) => setStreetNumber(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Enter Street Name"
                                    value={streetName}
                                    onChange={(e) => setStreetName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Unit (Optional)"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                />
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder={`Enter ${searchType}`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        )}
                        <button className="btn btn-primary mt-2" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="btn btn-secondary mt-2 ms-2" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
                <div className="col-md-6" style={sectionStyle}>
                    <h3>Additional Filter</h3>
                    <div className="mb-3">
                        <select className="form-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                            <option value="">All Types</option>
                            <option value="Condo">Condo</option>
                            <option value="Townhouse">Townhouse</option>
                            <option value="Semi">Semi</option>
                            <option value="Detached">Detached</option>
                        </select>
                        <select className="form-select mt-2" value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="For Sale">For Sale</option>
                            <option value="Sold">Sold</option>
                            <option value="Terminated">Terminated</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                        <Slider
                            range
                            max={1000000000}
                            min={0}
                            value={priceRange}
                            onChange={value => setPriceRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'CornflowerBlue' },
                                track: { backgroundColor: 'CornflowerBlue' }
                            }}
                        />
                        <label>Bedrooms: {bedroomsRange[0]} - {bedroomsRange[1]}</label>
                        <Slider
                            range
                            max={10}
                            min={0}
                            value={bedroomsRange}
                            onChange={value => setBedroomsRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'DarkSeaGreen' },
                                track: { backgroundColor: 'DarkSeaGreen' }
                            }}
                        />
                        <label>Bathrooms: {bathroomsRange[0]} - {bathroomsRange[1]}</label>
                        <Slider
                            range
                            max={10}
                            min={0}
                            value={bathroomsRange}
                            onChange={value => setBathroomsRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'IndianRed' },
                                track: { backgroundColor: 'IndianRed' }
                            }}
                        />
                        <label>Parkings: {parkingsRange[0]} - {parkingsRange[1]}</label>
                        <Slider
                            range
                            max={10}
                            min={0}
                            value={parkingsRange}
                            onChange={value => setParkingsRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'MediumPurple' },
                                track: { backgroundColor: 'MediumPurple' }
                            }}
                        />
                        <label>Size (sq ft): {sizeRange[0]} - {sizeRange[1]}</label>
                        <Slider
                            range
                            max={100000}
                            min={0}
                            value={sizeRange}
                            onChange={value => setSizeRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'Tomato' },
                                track: { backgroundColor: 'Tomato' }
                            }}
                        />
                        <label>Year Built: {yearBuiltRange[0]} - {yearBuiltRange[1]}</label>
                        <Slider
                            range
                            max={new Date().getFullYear()}
                            min={1900}
                            value={yearBuiltRange}
                            onChange={value => setYearBuiltRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'Sienna' },
                                track: { backgroundColor: 'Sienna' }
                            }}
                        />
                        <label>Tax: ${taxRange[0]} - ${taxRange[1]}</label>
                        <Slider
                            range
                            max={100000}
                            min={0}
                            value={taxRange}
                            onChange={value => setTaxRange(value as [number, number])}
                            styles={{
                                handle: { borderColor: 'GoldenRod' },
                                track: { backgroundColor: 'GoldenRod' }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="row mt-4" style={sectionStyle}>
                <div className="col-md-12">
                    <h3>Results</h3>
                    <div className="row">
                        {filteredProperties && filteredProperties.length > 0 ? (
                            filteredProperties.map((property) => (
                                <div className="col-md-4 mb-3" key={property.mls}>
                                    <PropertyCard property={property} />
                                </div>
                            ))
                        ) : (
                            <div>No properties found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Property;