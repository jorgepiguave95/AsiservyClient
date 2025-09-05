import { authStore } from '@/store/usuario.store';
import type { Login } from '@/interfaces/auth/auth.interface';

export const loginService = async (
  credentials: Login,
): Promise<{ success: boolean; message: string; user?: string }> => {
  // Validación manual de credenciales
  const validCredentials = {
    user: 'admin',
    password: 'admin',
  };

  // Simular delay de autenticación
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    credentials.user === validCredentials.user &&
    credentials.password === validCredentials.password
  ) {
    // Login exitoso
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
    // Login fallido
    return {
      success: false,
      message: 'Credenciales incorrectas',
    };
  }
};
