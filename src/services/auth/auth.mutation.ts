// useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { getErrorMessage } from '@/lib/utils';
import { extraerMensaje } from '../../lib/utils';
import { loginService, logoutService } from './auth.service';
import type { Login } from '@/interfaces/auth/auth.interface';
import { authStore } from '@/store/usuario.store';

//#region POST LOGIN
export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string; user?: string }, Error, Login>({
    mutationKey: ['login-user'],
    mutationFn: loginService,
    onSuccess: (data) => {
      if (data.success) {
        authStore.setState((state) => ({
          ...state,
          autenticado: true,
        }));

        toast.success(`${data.user} bienvenido.`, {
          id: 'login-toast',
          position: 'top-right',
        });
        navigate({ to: '/home' });
      } else {
        toast.error(data.message, {
          id: 'login-toast',
          position: 'top-right',
        });
      }
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      toast.error(extraerMensaje(message), {
        id: 'login-toast',
      });
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string }, Error>({
    mutationKey: ['logout-user'],
    mutationFn: logoutService,
    onSuccess: (data) => {
      if (data.success) {
        authStore.setState((state) => ({
          ...state,
          autenticado: false,
        }));

        toast.success(`Cierre de sesión exitoso.`, {
          id: 'login-toast',
        });
        navigate({ to: '/login' });
      } else {
        toast.error(data.message, {
          id: 'logout-toast',
        });
      }
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      toast.error(extraerMensaje(message), {
        id: 'logout-toast',
      });
    },
  });
}
//#endregion
