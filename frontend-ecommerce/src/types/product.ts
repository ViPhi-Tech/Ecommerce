export interface Product {
   id: number;
   title: string;
   price: number;
   oldPrice: number;
   description: string;
   category: string;
   images: string[];
   rating: Rating;
}

export interface Rating {
   rate: number;
   count: number;
}
