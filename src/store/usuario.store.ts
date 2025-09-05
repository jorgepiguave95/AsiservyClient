import { Store } from '@tanstack/react-store';

export const authStore = new Store<{ autenticado: boolean }>({
  autenticado: false,
});
