"use client";

import { useRouter } from "next/navigation";

type ProductPageProps = {
   id: string;
   name: string;
};

export default function ProductPage() {
   return (
      <>
         <div>Pagina do produto</div>
      </>
   );
}
