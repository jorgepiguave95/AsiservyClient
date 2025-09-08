import axios from 'axios';
import { handleAxiosError } from '@/lib/utils';
import type {
  CreacionProductoDto,
  ActualizacionProductoDto,
  CrearProductDetailDto,
  ProductDetailResponseDto,
} from '@/interfaces/products/products.interface';

const API_URL = 'http://localhost:3000/api/';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}Products`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const createProduct = async (productData: CreacionProductoDto) => {
  try {
    const response = await axios.post(`${API_URL}Products`, productData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const updateProduct = async (id: string, productData: ActualizacionProductoDto) => {
  try {
    const response = await axios.put(`${API_URL}Products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const activateProduct = async (id: string): Promise<void> => {
  try {
    const response = await axios.patch(`${API_URL}Products/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const deactivateProduct = async (id: string): Promise<void> => {
  try {
    const response = await axios.patch(`${API_URL}Products/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const fetchProductDetails = async (
  productControlId: string,
): Promise<ProductDetailResponseDto[]> => {
  try {
    const response = await axios.get(`${API_URL}Products/${productControlId}/details`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const createProductDetails = async (detailData: CrearProductDetailDto) => {
  try {
    const response = await axios.post(`${API_URL}Products/details`, detailData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

export const fetchAllProductDetails = async (): Promise<ProductDetailResponseDto[]> => {
  try {
    const response = await axios.get(`${API_URL}Products/all-details`);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};
