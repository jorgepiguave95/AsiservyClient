export interface ProductResponseDto {
  id: string;
  producto?: string;
  nombreCliente?: string;
  marca?: string;
  porcentajeMiga?: number;
  pesoDrenado?: number;
  pesoEnvase?: number;
  estaActivo: boolean;
}

export interface CreacionProductoDto {
  producto: string;
  nombreCliente: string;
  marca: string;
  porcentajeMiga: number;
  pesoDrenado: number;
  pesoEnvase: number;
}

export interface ActualizacionProductoDto {
  producto: string;
  nombreCliente: string;
  marca: string;
  porcentajeMiga: number;
  pesoDrenado: number;
  pesoEnvase: number;
}

export interface EditarProductoFormProps {
  producto: {
    id: string;
    producto: string;
    nombreCliente: string;
    marca: string;
    porcentajeMiga: number;
    pesoDrenado: number;
    pesoEnvase: number;
  };
  onClose?: () => void;
}

export interface ProductDetailResponseDto {
  id: string;
  productControlId: string;
  fecha: string;
  peso: number;
  tipoControl: string;
}

export interface CrearProductDetailDto {
  productControlId: string;
  fecha: string;
  peso: number;
  tipoControl: string;
}

export interface ProductDetailsRequestDto {
  productControlId: string;
}
