import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { AgentDto } from '../models/AgentDto';
import { AgentCreateDto } from '../models/AgentCreateDto';
import { AgentUpdateDto } from '../models/AgentUpdateDto';
import { PropertyDto } from '../models/PropertyDto';

const AGENT_API_URL = `${API_BASE_URL}/agent`;

export const getAgents = async (): Promise<AgentDto[]> => {
    const response = await axios.get<AgentDto[]>(AGENT_API_URL);
    return response.data;
};

export const getAgentByRegistrationNumber = async (registrationNumber: string): Promise<AgentDto> => {
    const response = await axios.get<AgentDto>(`${AGENT_API_URL}/${registrationNumber}`);
    return response.data;
};

export const getPropertiesByAgent = async (registrationNumber: string): Promise<PropertyDto[]> => {
    const response = await axios.get<PropertyDto[]>(`${AGENT_API_URL}/${registrationNumber}/properties`);
    return response.data;
};

export const addAgent = async (agentCreateDto: AgentCreateDto): Promise<void> => {
    await axios.post(AGENT_API_URL, agentCreateDto);
};

export const updateAgent = async (registrationNumber: string, agentUpdateDto: AgentUpdateDto): Promise<void> => {
    await axios.put(`${AGENT_API_URL}/${registrationNumber}`, agentUpdateDto);
};

export const patchAgent = async (registrationNumber: string, patchDocument: any): Promise<void> => {
    await axios.patch(`${AGENT_API_URL}/${registrationNumber}`, patchDocument);
};

export const deleteAgent = async (registrationNumber: string): Promise<void> => {
    await axios.delete(`${AGENT_API_URL}/${registrationNumber}`);
};