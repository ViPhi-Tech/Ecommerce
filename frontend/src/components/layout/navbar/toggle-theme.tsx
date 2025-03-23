"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
   const { setTheme } = useTheme();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <div className="relative mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-neutral-200 text-white transition-colors">
               <Sun className="w-[1.2rem] rotate-0 scale-100 transition-all ease-in-out hover:scale-110 dark:-rotate-90 dark:scale-0" />
               <Moon className="absolute w-[1.2rem] rotate-90 scale-0 transition-all ease-in-out hover:scale-110 dark:rotate-0 dark:scale-100" />
               <span className="sr-only h-4 transition-all ease-in-out hover:scale-110">
                  Toggle theme
               </span>
            </div>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem
               className="cursor-pointer"
               onClick={() => setTheme("light")}
            >
               Claro
            </DropdownMenuItem>
            <DropdownMenuItem
               className="cursor-pointer"
               onClick={() => setTheme("dark")}
            >
               Escuro
            </DropdownMenuItem>
            <DropdownMenuItem
               className="cursor-pointer"
               onClick={() => setTheme("system")}
            >
               Sistema
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
