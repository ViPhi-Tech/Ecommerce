import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import { ModeToggle } from "./toggle-theme";
import { Cart } from "../cart";
import { CircleUserRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

const { SITE_NAME } = process.env;

export async function Navbar() {
   const cookieStore = await cookies();

   const menu = [
      { id: 1, title: "Categoria 1", path: "/pesquisa/1" },
      { id: 2, title: "Categoria 1", path: "/pesquisa/2" },
   ];

   return (
      <nav className="sticky top-0 z-10 flex items-center justify-center border-b-4 border-[#ff6500] bg-primary-500 p-4 lg:px-6">
         <div className="block flex-none md:hidden">
            <MobileMenu menu={menu} />
         </div>
         <div className="container flex w-full items-center">
            <div className="flex w-full md:w-1/3">
               <Link
                  href="/"
                  prefetch={true}
                  className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
               >
                  <div className="ml-2 flex-none text-sm font-medium uppercase text-white md:hidden lg:block">
                     <Image
                        src="/assets/logos/logo.svg"
                        alt={SITE_NAME || "Logo"}
                        width={100}
                        height={100}
                     />
                  </div>
               </Link>
               <ul className="hidden gap-6 text-sm md:flex md:items-center">
                  {menu.map((item: any) => (
                     <li key={item.id}>
                        <Link
                           href={item.path}
                           prefetch={true}
                           className="text-white decoration-transparent transition duration-300 ease-in-out hover:text-black hover:underline"
                        >
                           {item.title}
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="hidden justify-center md:flex md:w-1/3">
               <Suspense fallback={<SearchSkeleton />}>
                  <Search />
               </Suspense>
            </div>
            <div className="flex justify-end md:w-1/3">
               <div className="mr-5 flex items-center">
                  <CircleUserRound size={24} color="#fff" />
                  <p className="ml-2 hidden whitespace-nowrap text-sm text-white sm:block">
                     <Link
                        href="/cliente/login"
                        prefetch={true}
                        className="text-sm"
                     >
                        <span className="font-semibold">Entre</span>
                     </Link>{" "}
                     ou <br />
                     <Link
                        href="/cliente/cadastro"
                        prefetch={true}
                        className="text-sm"
                     >
                        <span className="font-semibold">Cadastre-se</span>
                     </Link>
                  </p>
               </div>
               <div className="flex items-center">
                  <ModeToggle />
                  <Cart />
               </div>
            </div>
         </div>
      </nav>
   );
}
