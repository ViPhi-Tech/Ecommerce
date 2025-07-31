export interface SupplierCreateDTO {
    id?: number;
    uuid?: string,
    tradeName: string;
    legalName: string;
    cnpj: string;
    address: string;
    email?: string | null;
    phone?: string | null;
}

export interface SupplierUpdateDTO {
    tradeName?: string;
    legalName?: string;
    cnpj?: string;
    address?: string;
    email?: string | null;
    phone?: string | null;
}