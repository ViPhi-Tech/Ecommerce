import { ReactNode } from "react";

type LayoutProps = {
   children: ReactNode;
   params: {
      productId: string;
   };
};

export async function generateMetadata({ params }: LayoutProps) {
   const { productId } = params;
   return {
      title: `Produto ${productId}`,
   };
}

export default async function ProdutoSlugLayout({
   children,
   params,
}: LayoutProps) {
   const { productId } = params;

   return (
      <>
         <div className="container">
            <header>
               <div className="pt-5">
                  <div className="mb-8 flex w-max min-w-full items-center border-b border-gray-300 pb-3 text-sm leading-4 text-gray-600">
                     <span className="font-semibold">Você está em:</span>
                     <a
                        href="/gamer"
                        className="ml-1 text-primary-orange hover:text-primary-orange"
                     >
                        Games<span> &gt;</span>
                     </a>
                     <a
                        href="/gamer/playstation"
                        className="ml-1 hover:text-primary-orange"
                     >
                        Playstation<span> &gt;</span>
                     </a>
                     <a
                        href="/gamer/playstation/consoles-playstation"
                        className="ml-1 hover:text-primary-orange"
                     >
                        Consoles Playstation<span> &gt;</span>
                     </a>
                     <a
                        href="/gamer/playstation/consoles-playstation/playstation-5"
                        className="ml-1 hover:text-primary-orange"
                     >
                        Playstation 5<span> &gt;</span>
                     </a>
                     <span className="ml-1 font-semibold text-primary-orange">
                        Código: {productId}
                     </span>
                  </div>
               </div>
            </header>
            {children}
         </div>
      </>
   );
}
