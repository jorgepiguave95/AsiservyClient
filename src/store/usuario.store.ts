import { Store } from '@tanstack/react-store';

const getInitialAuthState = (): boolean => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-state');
    return stored ? JSON.parse(stored) : false;
  }
  return false;
};

export const authStore = new Store<{ autenticado: boolean }>({
  autenticado: getInitialAuthState(),
});

authStore.subscribe(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-state', JSON.stringify(authStore.state.autenticado));
  }
});
