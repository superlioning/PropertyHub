import { AddressDto } from './AddressDto';
import { FeatureDto } from './FeatureDto';

export interface PropertyUpdateDto {
    type?: string;
    price?: number;
    bedrooms?: number;
    bathrooms?: number;
    parkings?: number;
    size?: number;
    yearBuilt?: number;
    tax?: number;
    address?: AddressDto;
    status?: string;
    description?: string;
    agentRegistrationNumber?: string;
    imageUrls?: string[];
    feature?: FeatureDto;
    lastUpdate: Date;
}