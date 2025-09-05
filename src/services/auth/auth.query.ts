import type { Oficina, Rol, User } from '@/interfaces/parametros/usuarios/usuario.interface';
import { graphqlQuery } from '@/providers/graphqlClient';
import { useQuery } from '@tanstack/react-query';

//#region GET ALL OFFICES
export const GET_OFFICES = `
query OfficeGetAll {
  OfficeGetAll {
    estaActivo
    nombre
    secuencial
    idOficina
    secuencialDivision
  }
}
`;

export function useAllOfficeQuery() {
  return useQuery({
    queryKey: ['offices'],
    queryFn: () => graphqlQuery<{ OfficeGetAll: Oficina[] }>(GET_OFFICES),
    select: (data) => data.OfficeGetAll ?? [],
  });
}
//#endregion

//#region GET ALL USERS
export const GET_USERS = `
query UsersGetAll {
  UsersGetAll {
    codigo
    correo
    estaActivo
    idUsuario
    nombre
    identificacion
    secuencialPersona
    oficina {
      nombre
      idOficina
      secuencialDivision
      estaActivo
    }
    usuarioRoles {
      estaActivo
      rol {
        descripcion
        codigo
        secuencial
        idRol
        estaActivo
      }
    }
  }
}
`;

export function useAllUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => graphqlQuery<{ UsersGetAll: User[] }>(GET_USERS),
    select: (data) => data.UsersGetAll ?? [],
  });
}
//#endregion

//#region GET ALL ROLLS
export const GET_ROLL_ALL = `
query RollGetAll {
  RollGetAll {
    descripcion
    estaActivo
    secuencial
    codigo
    idRol
  }
}
`;

export function useAllRollQuery() {
  return useQuery({
    queryKey: ['rolls'],
    queryFn: () => graphqlQuery<{ RollGetAll: Rol[] }>(GET_ROLL_ALL),
    select: (data) => data.RollGetAll ?? [],
  });
}
//#endregion

//#region GET ONE USER
export const GET_ONE_USER = `
query UserGetOne($termino: String!) {
  UserGetOne(termino: $termino) {
    idUsuario
  }
}
`;
export const oneGetUserQuery = async (codigo: string) => {
  return await graphqlQuery<{ UserGetOne: User }>(GET_ONE_USER, {
    termino: codigo,
  });
};
//#endregion
