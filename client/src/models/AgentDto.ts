import { AddressDto } from './AddressDto';

export interface AgentDto {
    registrationNumber: string;
    name: string;
    registrationCategory: string;
    brokerageTradeName: string;
    brokeragePhone: string;
    brokerageEmail: string;
    brokerageAddress: AddressDto;
}