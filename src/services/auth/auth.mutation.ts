// useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { getErrorMessage } from '@/lib/utils';
import { extraerMensaje } from '../../lib/utils';
import { loginService } from './auth.service';
import type { Login } from '@/interfaces/auth/auth.interface';

//#region POST LOGIN
export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string; user?: string }, Error, Login>({
    mutationKey: ['login-user'],
    mutationFn: loginService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.user} bienvenido.`, {
          id: 'login-toast',
        });
        navigate({ to: '/home' });
      } else {
        toast.error(data.message, {
          id: 'login-toast',
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
//#endregion
