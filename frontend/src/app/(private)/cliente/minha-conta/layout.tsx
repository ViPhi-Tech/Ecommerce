import SidebarAccount from "@/components/layout/account/sidebar-account";
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
         <div className="relative min-h-[calc(100vh-80px)] bg-[#f2f3f4]">
            <div className="flex w-full bg-gray-100">
               <SidebarAccount />
               <main className="w-full flex-1 overflow-y-auto p-8">
                  {children}
               </main>
            </div>
         </div>
      </main>
   );
}
