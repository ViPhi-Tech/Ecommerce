import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const toBRL = (price: number) => {
   if (!price) return null;
   return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   }).format(price);
};

// Função para formatar o preço
export const formatPrice = (price: number) => {
   return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
   }).format(price);
};

export const statusColorMap: { [key: string]: string } = {
   Entregue: "bg-green-500",
   "Em trânsito": "bg-blue-500",
   Processando: "bg-yellow-500",
   default: "bg-gray-500",
};
