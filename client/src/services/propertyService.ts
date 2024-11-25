import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { PropertyDto } from '../models/PropertyDto';
import { PropertyCreateDto } from '../models/PropertyCreateDto';
import { PropertyUpdateDto } from '../models/PropertyUpdateDto';

const PROPERTY_API_URL = `${API_BASE_URL}/property`;

export const getProperties = async (): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(PROPERTY_API_URL);
    return response.data;
};

export const getPropertyByMLS = async (mls: string): Promise<PropertyDto> => {
    const response = await axios.get<PropertyDto>(`${PROPERTY_API_URL}/${mls}`);
    return response.data;
};

export const getPropertiesByType = async (type: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/type/${type}`);
    return response.data;
};

export const getPropertiesByPriceLimit = async (price: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/price/${price}`);
    return response.data;
};

export const getPropertiesByBedroomsLimit = async (bedrooms: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/bedrooms/${bedrooms}`);
    return response.data;
};

export const getPropertiesByBathroomsLimit = async (bathrooms: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/bathrooms/${bathrooms}`);
    return response.data;
};

export const getPropertiesByParkingsLimit = async (parkings: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/parkings/${parkings}`);
    return response.data;
};

export const getPropertiesBySizeLimit = async (size: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/size/${size}`);
    return response.data;
};

export const getPropertiesByYearBuiltLimit = async (yearBuilt: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/yearBuilt/${yearBuilt}`);
    return response.data;
};

export const getPropertiesByTaxLimit = async (tax: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/tax/${tax}`);
    return response.data;
};

export const getPropertiesByStatus = async (status: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${PROPERTY_API_URL}/status/${status}`);
    return response.data;
};

export const addProperty = async (propertyCreateDto: PropertyCreateDto): Promise<void> => {
    await axios.post(PROPERTY_API_URL, propertyCreateDto);
};

export const updateProperty = async (mls: string, propertyUpdateDto: PropertyUpdateDto): Promise<void> => {
    await axios.put(`${PROPERTY_API_URL}/${mls}`, propertyUpdateDto);
};

export const patchProperty = async (mls: string, patchDocument: any): Promise<void> => {
    await axios.patch(`${PROPERTY_API_URL}/${mls}`, patchDocument);
};

export const deleteProperty = async (mls: string): Promise<void> => {
    await axios.delete(`${PROPERTY_API_URL}/${mls}`);
};

export const addPropertyImages = async (mls: string, imageUrls: FormData): Promise<void> => {
    await axios.post(`${PROPERTY_API_URL}/${mls}/images`, imageUrls, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updatePropertyImage = async (mls: string, existingImageUrl: string, newImage: FormData): Promise<void> => {
    await axios.put(`${PROPERTY_API_URL}/${mls}/images`, newImage, {
        params: { existingImageUrl },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deletePropertyImages = async (mls: string, imageUrls: string[]): Promise<void> => {
    await axios.delete(`${PROPERTY_API_URL}/${mls}/images`, {
        data: imageUrls
    });
};