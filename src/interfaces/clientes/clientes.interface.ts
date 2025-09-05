export interface CustomerResponseDto {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    estaActivo: boolean;
}