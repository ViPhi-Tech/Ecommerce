import { IProduct } from '../product/Product';

export interface IProductStock extends IProduct {
  name: string;
  sku: string;
}
