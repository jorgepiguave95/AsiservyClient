import { useMutation } from '@tanstack/react-query';
import { createClient, activateClient, deactivateClient, updateClient } from './customer.service';

export function useCreateClient() {
  return useMutation({
    mutationFn: createClient,
  });
}

export function useActivateClient() {
  return useMutation({
    mutationFn: activateClient,
  });
}

export function useDeactivateClient() {
  return useMutation({
    mutationFn: deactivateClient,
  });
}

export function useUpdateClient() {
  return useMutation({
    mutationFn: ({
      id,
      clientData,
    }: {
      id: string;
      clientData: { firstName: string; lastName: string; email: string; phone: string };
    }) => updateClient(id, clientData),
  });
}
