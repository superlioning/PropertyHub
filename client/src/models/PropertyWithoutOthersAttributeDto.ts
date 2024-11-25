import { AddressDto } from './AddressDto';

export interface PropertyWithoutOthersAttributeDto {
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
}