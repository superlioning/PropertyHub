import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { FeatureDto } from '../models/FeatureDto';
import { FeatureCreateDto } from '../models/FeatureCreateDto';
import { FeatureUpdateDto } from '../models/FeatureUpdateDto';
import { PropertyDto } from '../models/PropertyDto';

const FEATURE_API_URL = `${API_BASE_URL}/feature`;

export const getFeatures = async (): Promise<FeatureDto[]> => {
    const response = await axios.get<FeatureDto[]>(FEATURE_API_URL);
    return response.data;
};

export const getPropertiesByWalkScore = async (walkScore: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${FEATURE_API_URL}/walkFeature/${walkScore}`);
    return response.data;
};

export const getPropertiesByTransitScore = async (transitScore: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${FEATURE_API_URL}/transitFeature/${transitScore}`);
    return response.data;
};

export const getPropertiesByBikeScore = async (bikeScore: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${FEATURE_API_URL}/bikeFeature/${bikeScore}`);
    return response.data;
};

export const getPropertiesByEducationScore = async (educationScore: number): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${FEATURE_API_URL}/educationFeature/${educationScore}`);
    return response.data;
};

export const addFeatureToProperty = async (mls: string, featureCreateDto: FeatureCreateDto): Promise<void> => {
    await axios.post(`${FEATURE_API_URL}/${mls}/addFeature`, featureCreateDto);
};

export const updateFeatureInProperty = async (mls: string, featureUpdateDto: FeatureUpdateDto): Promise<void> => {
    await axios.put(`${FEATURE_API_URL}/${mls}/updateFeature`, featureUpdateDto);
};

export const patchFeatureInProperty = async (mls: string, patchDocument: any): Promise<void> => {
    await axios.patch(`${FEATURE_API_URL}/${mls}/patchFeature`, patchDocument);
};

export const deleteFeatureFromProperty = async (mls: string): Promise<void> => {
    await axios.delete(`${FEATURE_API_URL}/${mls}/deleteFeature`);
};