"use client";

import { Product as ProductType } from "@/types/product";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { Product } from "./product";

type ProductsCarouselProps = {
   products: ProductType[];
};

export function ProductsCarousel({ products }: ProductsCarouselProps) {
   return (
      <>
         <div className="flex w-full justify-center">
            <div className="container p-12">
               <Carousel
                  opts={{
                     align: "start",
                     loop: true,
                  }}
                  plugins={[
                     Autoplay({
                        delay: 8000,
                     }),
                  ]}
               >
                  <CarouselContent>
                     {products?.map(product => {
                        return (
                           <CarouselItem
                              className="basis-1/1 md:basis-1/4 lg:basis-1/5"
                              key={product.id}
                           >
                              <Product key={product.id} product={product} />
                           </CarouselItem>
                        );
                     })}

                     {!products?.length && (
                        <>
                           {Array.from({ length: 4 }).map((_, index) => (
                              <CarouselItem
                                 key={index}
                                 className="basis-1/1 md:basis-1/4"
                              >
                                 <p>sem items</p>
                              </CarouselItem>
                           ))}
                        </>
                     )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
               </Carousel>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-4"></div>
            </div>
         </div>
      </>
   );
}
