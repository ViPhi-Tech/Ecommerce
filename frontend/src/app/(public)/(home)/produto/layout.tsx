import { ReactNode } from "react";

export default function ProdutoLayout({ children }: { children: ReactNode }) {
   return (
      <>
         <div className="flex flex-col items-center">{children}</div>
      </>
   );
}
