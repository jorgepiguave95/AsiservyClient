export interface CustomerResponseDto {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    estaActivo: boolean;
}

export interface CreacionClienteDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface ActualizacionClienteDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

 export interface EditarClienteFormProps {
  cliente: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onClose?: () => void;
}