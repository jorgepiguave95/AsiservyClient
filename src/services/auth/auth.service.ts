import { authStore } from '@/store/usuario.store';
import type { Login } from '@/interfaces/auth/auth.interface';

export const loginService = async (
  credentials: Login,
): Promise<{ success: boolean; message: string; user?: string }> => {
  const validCredentials = {
    user: 'admin',
    password: 'sistemas',
  };

  if (
    credentials.user === validCredentials.user &&
    credentials.password === validCredentials.password
  ) {
    authStore.setState((prev) => ({
      ...prev,
      autenticado: true,
    }));

    return {
      success: true,
      message: 'Login exitoso',
      user: 'Admin User',
    };
  } else {
    return {
      success: false,
      message: 'Credenciales incorrectas',
    };
  }
};

export const logoutService = async (): Promise<{ success: boolean; message: string }> => {
  authStore.setState((prev) => ({
    ...prev,
    autenticado: false,
  }));

  return {
    success: true,
    message: 'Logout exitoso',
  };
};
