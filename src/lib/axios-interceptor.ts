import axios from 'axios';
import Cookies from 'js-cookie';

export const axiosInstance = axios.create({
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', error);
    return Promise.reject(error);
  },
);
