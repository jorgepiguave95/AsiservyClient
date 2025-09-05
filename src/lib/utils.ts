import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any): string {
  let message = 'Error desconocido';

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  return message;
}

export function extraerMensaje(error: string): string {
  const partes = error.split(':');
  return partes.length > 1 ? partes[1].trim() : error;
}
