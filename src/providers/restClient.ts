import { axiosInstance } from '@/lib/axios-interceptor';

interface GetConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  [key: string]: any; // permite pasar otras opciones como `timeout`, `signal`, etc.
}

export const networkClient = {
  async get<T>(url: string, config?: GetConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  async post<T>(url: string, data: any, config?: object): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  async patch<T>(url: string, data: any, config?: object): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  async delete<T>(url: string, config?: GetConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};
