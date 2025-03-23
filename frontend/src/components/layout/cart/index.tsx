import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetDescription,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import OpenCart from "./open-card";

export function Cart({
   className,
   quantity,
}: {
   className?: string;
   quantity?: number;
}) {
   return (
      <Sheet>
         <SheetTrigger asChild>
            <OpenCart />
         </SheetTrigger>
         <SheetContent className="w-full">
            <SheetHeader>
               <SheetTitle>Carrinho</SheetTitle>
               <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">aa</div>
            <SheetFooter>
               <SheetClose asChild></SheetClose>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   );
}
