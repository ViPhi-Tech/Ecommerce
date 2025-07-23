export interface Stock {
  id: string | number; // Identificador único do estoque
  productId: string | number; // ID do produto associado
  quantity: number; // Quantidade em estoque
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data da última atualização
}
