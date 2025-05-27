export interface CreateCategoryInput {
  id?: number;
  name: string;
  isActive?: boolean | null;
  companyId?: number | null;
}

export interface Category extends CreateCategoryInput {
  createdAt: Date;
  updatedAt: Date;
}
