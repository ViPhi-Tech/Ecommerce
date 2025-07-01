export interface BrandCreateDTO {
    id?: number;
    name: string;
    isActive?: boolean | null
}

export interface BrandUpdateDTO {
    name?: string;
    isActive?: boolean | null;
}