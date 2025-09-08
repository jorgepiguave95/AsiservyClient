import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

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

export function handleAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Error de respuesta del servidor (4xx, 5xx)
    if (error.response?.data) {
      const data = error.response.data;

      // El backend envía el mensaje directamente en data como string
      if (typeof data === 'string') {
        return data;
      }

      // Si es un objeto, buscar el mensaje en diferentes propiedades
      if (data && typeof data === 'object') {
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (data.details) return data.details;

        // Si es un array de errores (validaciones múltiples)
        if (Array.isArray(data.errors)) {
          return data.errors.join(', ');
        }

        // Si tiene una propiedad específica del error
        if (data.statusText) return data.statusText;

        return 'Error del servidor';
      }

      return 'Error del servidor';
    }

    // Error de solicitud (no hay respuesta)
    if (error.request) {
      return 'Error de conexión. Verifica tu conexión a internet';
    } // Error en la configuración de la solicitud
    return error.message || 'Error en la configuración de la solicitud';
  }

  // Error que no es de Axios
  if (error instanceof Error) {
    return error.message;
  }

  return 'Error desconocido';
}
