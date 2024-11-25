import { AddressDto } from './AddressDto';

export interface AgentCreateDto {
    registrationNumber: string;
    name: string;
    registrationCategory: string;
    brokerageTradeName: string;
    brokeragePhone: string;
    brokerageEmail: string;
    brokerageAddress: AddressDto;
}