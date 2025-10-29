export interface IBillingAddress {
  street: string; // Logradouro/Endereço
  number: string; // Número
  neighborhood: string; // Bairro
  zipCode: string; // CEP
  city: string; // Cidade
  state: string; // Estado/UF
  complement?: string; // Complemento (opcional)
}
