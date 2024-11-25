import { AddressDto } from './AddressDto';
import { FeatureDto } from './FeatureDto';

export interface PropertyCreateDto {
    mls: string;
    type: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    parkings: number;
    size: number;
    yearBuilt: number;
    tax: number;
    address: AddressDto;
    status: string;
    description: string;
    agentRegistrationNumber: string;
    imageUrls?: string[];
    feature?: FeatureDto;
    dateListed: Date;
    lastUpdate: Date;
}