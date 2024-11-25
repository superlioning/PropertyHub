export interface AddressCreateDto {
    streetNumber: string;
    streetName: string;
    unit?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}