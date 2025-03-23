import { Button } from "@/components/ui/button";
import { ChevronDown, HomeIcon } from "lucide-react";
import Link from "next/link";

type SideBarIconProps = {
   href: string;
   icon: any;
   label: string;
   hasChevron?: boolean;
};

const sidebarItems: SideBarIconProps[] = [
   { href: "/admin/home", icon: HomeIcon, label: "Página Principal" },
];

export function SidebarItems() {
   return (
      <ul>
         {sidebarItems.map((item, index) => (
            <li key={index}>
               <Link href={item.href}>
                  <Button
                     variant="ghost"
                     className="w-full justify-start gap-2"
                  >
                     <item.icon className="h-4 w-4" />
                     {item.label}
                     {item.hasChevron && (
                        <ChevronDown className="ml-auto h-4 w-4" />
                     )}
                  </Button>
               </Link>
            </li>
         ))}
      </ul>
   );
}
