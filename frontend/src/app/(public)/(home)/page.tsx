import { api } from "@/lib/axios";
import { ProductsCarousel } from "@/components/layout/main-products";
import Banners, { Banner, BannersConfig } from "@/components/layout/banners";
import Brands, { Brand } from "@/components/layout/brands";
import { Product } from "@/types/product";

export const metadata = {
   title: "Loja de Ecommerce",
   description:
      "Loja de ecommerce de alto desempenho construída com Next.js, Vercel e Shopify. Descubra uma ampla gama de produtos com uma experiência de compra perfeita.",
   openGraph: {
      type: "website",
      title: "Loja de Ecommerce",
      description:
         "Loja de ecommerce de alto desempenho construída com Next.js, Vercel e Shopify. Descubra uma ampla gama de produtos com uma experiência de compra perfeita.",
   },
};

const getProducts = async (): Promise<Product[]> => {
   try {
      const { data } = await api.get("http://localhost:3001/products");
      return data;
   } catch {
      return [];
   }
};

const getBrands = async (): Promise<Brand[]> => {
   try {
      const { data } = await api.get("http://localhost:3001/brands");
      return data;
   } catch {
      return [];
   }
};

const getBanners = async (): Promise<Banner[]> => {
   try {
      const { data } = await api.get("http://localhost:3001/banners");
      return data;
   } catch {
      return [];
   }
};

export default async function HomePage() {
   const products = await getProducts();
   const banners = await getBanners();
   const brands = await getBrands();

   return (
      <div>
         <ProductsCarousel products={products} />
         <Banners banners={banners} config={{ bannersRow: 2 }} />
         <ProductsCarousel products={products} />
         <Brands brands={brands} config={{ brandsRow: 4 }} />
      </div>
   );
}
