export interface Supplier {
    id?: string;
    tradeName: string;
    legalName: string;
    cnpj: string;
    address: string;
    email?: string | null;
    phone?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}