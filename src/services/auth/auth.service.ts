import { envs } from '@/commons/envs';
import type { Auth } from '@/interfaces/parametros/usuarios/auth.interface';
import { networkClient } from '@/providers/restClient';
import { authStore, usuarioStore } from '@/store/parametros/usuario.store';
import Cookies from 'js-cookie';

export const loginService = async (payload: { codigo: string; clave: string }): Promise<string> => {
  const response = await networkClient.post<Auth>(
    envs.COAC_SERVERS + 'api/auth/loginUser',
    payload,
  );

  if (!response || !response.user || !response.token) throw new Error('Credenciales invalidas');

  Cookies.set('auth_token', response.token, {
    secure: envs.PRODUCTION === 'true',
    sameSite: 'lax',
    expires: 1,
  });

  usuarioStore.setState((prev) => ({
    ...prev,
    usuario: response.user,
  }));

  authStore.setState((prev) => ({
    ...prev,
    autenticado: true,
  }));

  return response.user.nombre;
};
