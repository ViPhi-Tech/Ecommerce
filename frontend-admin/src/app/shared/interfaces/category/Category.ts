export interface Category {
  id: string; // Identificador único da categoria
  name: string; // Nome da categoria
  description?: string; // Descrição opcional da categoria
  parentCategoryId?: string; // ID da categoria pai (para categorias hierárquicas)
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data da última atualização
  isActive: boolean; // Indica se a categoria está ativa
  imageUrl?: string; // URL de uma imagem representativa da categoria
}
