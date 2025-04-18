"use client";

import { Button } from "@/components/ui/button";
import { toBRL } from "@/lib/utils";
import { Product as ProductType } from "@/types/product";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

type ProductsProps = {
   product: ProductType;
};

export function Product({ product }: ProductsProps) {
   const [isVisible, setShowDiv] = useState(false);

   const image = `${product?.images?.[0]}`
      .replaceAll(`"`, "")
      .replaceAll(`[`, "")
      .replaceAll(`]`, "");

   const price = toBRL(product?.price);
   const oldPrice = toBRL(product?.oldPrice);

   const toggleDiv = (visible: boolean) => {
      setShowDiv(visible);
   };

   return (
      <>
         <div
            className="flex flex-col items-center shadow-product dark:shadow-product-dark"
            onMouseEnter={() => toggleDiv(true)}
            onMouseLeave={() => toggleDiv(false)}
         >
            <div className="relative flex h-6 w-full items-start justify-between p-8 pb-0">
               <motion.div
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                     opacity: isVisible ? 1 : 0,
                  }}
                  transition={{
                     duration: 0.3,
                  }}
               >
                  <div className="absolute right-0 top-0 flex gap-2 rounded-bl-lg rounded-tr-lg p-2">
                     <Heart
                        size={18}
                        className="animation-delay-400 cursor-pointer text-gray-400 transition-all ease-in-out hover:text-red-900 dark:text-white dark:hover:text-red-900"
                     />
                     <ShoppingCart
                        size={18}
                        className="animation-delay-400 cursor-pointer text-gray-400 transition-all ease-in-out hover:text-green-800 dark:text-white dark:hover:text-green-800"
                     />
                  </div>
               </motion.div>
            </div>
            <img
               src={image}
               style={{ width: "auto", maxWidth: "100%", maxHeight: "256px" }}
               alt={product?.title}
            />

            <div className="w-full p-3">
               <h3 className="min-h-[3.75rem] leading-4">
                  <span className="mt-2 min-h-[3.75rem] text-sm font-semibold text-gray-800 dark:text-white">
                     {product?.title}
                  </span>
               </h3>
               <div className="flex h-4 items-center justify-between gap-8">
                  <span className="flex h-3 items-center text-xs font-normal leading-[1.375rem] text-gray-600 line-through dark:text-white">
                     {oldPrice}
                  </span>
               </div>
               <p className="mt-1 h-7 text-xl font-bold leading-7 text-green-700">
                  {price}
               </p>
               <div className="mt-2">
                  <Button className="w-full" variant={"success"}>
                     <span>Comprar</span>
                  </Button>
               </div>
            </div>
         </div>
      </>
   );
}
