import { useQuery } from '@tanstack/react-query';
import { fetchClients } from './customer.service';

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });
}
