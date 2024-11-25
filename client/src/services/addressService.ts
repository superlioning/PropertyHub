import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { AddressDto } from '../models/AddressDto';
import { AddressCreateDto } from '../models/AddressCreateDto';
import { AddressUpdateDto } from '../models/AddressUpdateDto';
import { PropertyDto } from '../models/PropertyDto';

const ADDRESS_API_URL = `${API_BASE_URL}/address`;

export const getAddresses = async (): Promise<AddressDto[]> => {
    const response = await axios.get<AddressDto[]>(ADDRESS_API_URL);
    return response.data;
};

export const getPropertiesByStreet = async (streetNumber: string, streetName: string, unit?: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${ADDRESS_API_URL}/streetProperty/${streetNumber}/${streetName}/${unit}`);
    return response.data;
};

export const getPropertiesByCity = async (city: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${ADDRESS_API_URL}/cityProperty/${city}`);
    return response.data;
};

export const getPropertiesByPostalCode = async (postalCode: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${ADDRESS_API_URL}/postalCodeProperty/${postalCode}`);
    return response.data;
};

export const addAddressToProperty = async (mls: string, addressCreateDto: AddressCreateDto): Promise<void> => {
    await axios.post(`${ADDRESS_API_URL}/${mls}/addAddress`, addressCreateDto);
};

export const updateAddressInProperty = async (mls: string, addressUpdateDto: AddressUpdateDto): Promise<void> => {
    await axios.put(`${ADDRESS_API_URL}/${mls}/updateAddress`, addressUpdateDto);
};

export const patchAddressInProperty = async (mls: string, patchDocument: any): Promise<void> => {
    await axios.patch(`${ADDRESS_API_URL}/${mls}/patchAddress`, patchDocument);
};

export const deleteAddressFromProperty = async (mls: string): Promise<void> => {
    await axios.delete(`${ADDRESS_API_URL}/${mls}/deleteAddress`);
};