// useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { loginService } from '@/services/parametros/auth/auth.service';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { extraerMensaje } from '@/commons/funtions';
import { graphqlMutation } from '@/providers/graphqlClient';
import type { createUsers, User } from '@/interfaces/parametros/usuarios/usuario.interface';
import { getErrorMessage } from '@/lib/utils';

//#region POST LOGIN
export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['login-user'],
    mutationFn: loginService,
    onSuccess: (data) => {
      const [primerNombre, primerApellido] = data.split(' ');
      toast.success(`${primerNombre} ${primerApellido} bienvenido a CoacUtilities`, {
        id: 'login-toast',
      });
      navigate({ to: '/home' });
    },
    onError: (error: any) => {
      let message = getErrorMessage(error);
      toast.error(extraerMensaje(message), {
        id: 'login-toast',
      });
    },
  });
}
//#endregion

//#region POST CREATE USER
export const POST_CREATE_USER = `
mutation UserCreate($createUsuarioDto: CreateUsuarioDto!) {
    UserCreate(createUsuarioDto: $createUsuarioDto) {
      estaActivo
      nombre
    }
  }
`;

export const createUser = async (input: createUsers) => {
  return graphqlMutation<{ UserCreate: { estaActivo: boolean; nombre: string } }>(
    POST_CREATE_USER,
    { createUsuarioDto: input },
  );
};
//#endregion

//#region POST UPDATE USER
export const POST_UPDATE_USER = `
mutation UserUpdate($updateUsuarioDto: UpdateUsuarioDto!) {
  UserUpdate(updateUsuarioDto: $updateUsuarioDto) {
    nombre
    estaActivo
  }
}
`;

export const updateUser = async (inputUpdate: any) => {
  return graphqlMutation<{ UserUpdate: { estaActivo: boolean; nombre: string } }>(
    POST_UPDATE_USER,
    { updateUsuarioDto: inputUpdate },
  );
};
//#endregion

//#region POST CREATE & UPDATE ROLL USER
export const POST_CREATE_UPDATE_ROLL_USER = `
mutation UserRolesCreate($createUsuarioRolDto: CreateUsuarioRolDto!) {
  UserRolesCreate(createUsuarioRolDto: $createUsuarioRolDto) {
    usuario {
      idUsuario
      codigo
      identificacion
    }
    idUsuarioRol
    secuencial
    rol {
      idRol
      secuencial
      codigo
      descripcion
      estaActivo
    }
  }
}
`;

export const createUpdateRollUser = async (inputCreateRoll: any) => {
  return graphqlMutation<{ UserRolesCreate: User[] }>(POST_CREATE_UPDATE_ROLL_USER, {
    createUsuarioRolDto: inputCreateRoll,
  });
};
//#endregion
