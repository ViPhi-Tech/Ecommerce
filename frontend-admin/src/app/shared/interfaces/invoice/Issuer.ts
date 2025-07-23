import { Address } from './Address';

export interface Issuer {
  name: string;
  cnpj: string;
  address: Address;
}
