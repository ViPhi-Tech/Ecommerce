import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Wallet } from "lucide-react";
import { SidebarItems } from "@/components/layout/admin/sidebar-items";

export default async function AdminLayout({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <main className="dark">
         <div className="min-h-screen bg-black text-white">
            <div className="grid lg:grid-cols-[280px_1fr]">
               <aside className="border-r bg-background/50 backdrop-blur">
                  <div className="flex h-16 items-center gap-2 border-b px-6">
                     <Wallet className="h-6 w-6" />
                     <span className="font-bold">Beelz Tech</span>
                  </div>
                  <div className="px-4 py-4">
                     <Input
                        placeholder="Pesquisar"
                        className="bg-background/50"
                     />
                  </div>
                  <nav className="space-y-2 px-2">
                     <SidebarItems />
                  </nav>
               </aside>
               <main className="p-6">{children}</main>
            </div>
         </div>
      </main>
   );
}
