import { ArrowRight, ArrowRightToLine, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BrandsProps {
   brands: Brand[];
   config: BrandsConfig;
}

export type Brand = {
   id: number;
   name: string;
   image: string;
   url: string;
};

export type BrandsConfig = {
   brandsRow: number;
};

export default async function Brands({
   brands,
   config: { brandsRow },
}: BrandsProps) {
   return (
      <>
         <div className="flex w-full justify-center">
            <div className="container px-0">
               <div
                  className={`grid grid-cols-1 md:grid-cols-${brandsRow} gap-y-10`}
               >
                  {brands.map((brand: Brand, index: number) => (
                     <div
                        key={index}
                        className="col-span-1 flex justify-center"
                     >
                        <Link href={brand?.url || "/"} prefetch={true}>
                           <div className="flex flex-col items-center justify-center rounded-sm p-4 shadow-md">
                              <img
                                 src={brand.image}
                                 alt={"brand_" + index}
                                 width={0}
                                 height={0}
                                 style={{
                                    width: "auto",
                                    maxWidth: "100%",
                                    maxHeight: "168px",
                                 }}
                              />
                              <h3 className="mt-2 text-xl font-bold uppercase text-black-800">
                                 {brand.name}
                              </h3>
                              <p className="flex items-center text-sm font-semibold uppercase text-primary-orange">
                                 Ver Produtos <ChevronRight size={16} />
                              </p>
                           </div>
                        </Link>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}
