export interface InvoiceDetails {
  identification: Identification;
  issuer: Issuer;
  recipient: Recipient;
  products: Product[];
  totals: Totals;
  transportation: Transportation;
}

export interface Identification {
  number: string;
  series: string;
  issueDate: string;
  operationType: string;
  model: string;
}

export interface Issuer {
  name: string;
  cnpj: string;
  address: Address;
}

export interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  cityCode: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  country: string;
  phone: string;
}

export interface Recipient {
  name: string;
  cnpj: string;
  address: Address;
}

export interface Product {
  itemNumber: string;
  description: string;
  quantity: string;
  unit: string;
  unitValue: string;
  totalValue: string;
  cfop: string;
}

export interface Totals {
  productValue: string;
  invoiceValue: string;
  icmsValue: string;
  pisValue: string;
  cofinsValue: string;
}

export interface Transportation {
  freightMode: string;
  carrier: Carrier;
}

export interface Carrier {
  cnpj: string;
  name: string;
  stateRegistration: string;
  address: string;
  city: string;
  state: string;
}
