import { Navbar } from "@/components/layout/navbar";
import { ReactNode } from "react";

export default async function BaseLayout({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <main>
         <Navbar />
         {children}
      </main>
   );
}
