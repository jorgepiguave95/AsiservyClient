import { useMutation } from '@tanstack/react-query';
import {
  activateProduct,
  createProduct,
  updateProduct,
  deactivateProduct,
  createProductDetails,
} from './products.service';

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProduct(id, data),
  });
}

export function useActivateProduct() {
  return useMutation({
    mutationFn: activateProduct,
  });
}

export function useDeactivateProduct() {
  return useMutation({
    mutationFn: deactivateProduct,
  });
}

export function useCreateProductDetails() {
  return useMutation({
    mutationFn: createProductDetails,
  });
}
