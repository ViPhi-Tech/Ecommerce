import { IAddress } from './Address';

export interface Issuer {
  name: string;
  cnpj: string;
  address: IAddress;
}
