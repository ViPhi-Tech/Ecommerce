import { Address } from './Address';

export interface Recipient {
  name: string;
  cnpj: string;
  address: Address;
}
