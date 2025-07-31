export interface SupplierCreateDTO {
    id?: string;
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