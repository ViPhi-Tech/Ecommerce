import { IAddress } from './Address';

export interface Recipient {
  name: string;
  cnpj: string;
  address: IAddress;
}
