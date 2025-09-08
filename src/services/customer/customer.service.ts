import axios from 'axios';
import { handleAxiosError } from '@/lib/utils';

const API_URL = 'http://localhost:3000/api/';

export const fetchClients = async () => {
  try {
    const response = await axios.get(`${API_URL}Customers`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const createClient = async (CreacionClienteDto: any) => {
  try {
    const response = await axios.post(`${API_URL}Customers`, CreacionClienteDto);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const activateClient = async (id: string): Promise<void> => {
  try {
    const response = await axios.patch(`${API_URL}Customers/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const deactivateClient = async (id: string): Promise<void> => {
  try {
    const response = await axios.patch(`${API_URL}Customers/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const updateClient = async (
  id: string,
  clientData: { firstName: string; lastName: string; email: string; phone: string },
): Promise<void> => {
  try {
    const response = await axios.put(`${API_URL}Customers/${id}`, clientData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
