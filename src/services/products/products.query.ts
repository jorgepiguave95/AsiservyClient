import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails, fetchProducts, fetchAllProductDetails } from './products.service';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}

export function useProductDetails(productId: string) {
  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: () => fetchProductDetails(productId),
  });
}

export function useAllProductDetails() {
  return useQuery({
    queryKey: ['allProductDetails'],
    queryFn: fetchAllProductDetails,
  });
}
