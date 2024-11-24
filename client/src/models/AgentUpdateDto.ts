import { AddressDto } from './AddressDto';

export interface AgentUpdateDto {
    name?: string;
    registrationCategory?: string;
    brokerageTradeName?: string;
    brokeragePhone?: string;
    brokerageEmail?: string;
    brokerageAddress?: AddressDto;
}