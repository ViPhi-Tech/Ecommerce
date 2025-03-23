import Link from "next/link";
import { User, MapPin, ShoppingBag, LogOut } from "lucide-react";

const SidebarAccount = () => {
   return (
      <div className="sticky hidden w-64 bg-white shadow-md sm:block">
         <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
               Minha Conta
            </h2>
         </div>
         <nav className="mt-6">
            <Link
               href="/cliente/minha-conta/dados-pessoais"
               className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
               <User className="mr-2 inline-block" size={20} />
               Dados Pessoais
            </Link>
            <Link
               href="/cliente/minha-conta/enderecos"
               className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
               <MapPin className="mr-2 inline-block" size={20} />
               Endereços
            </Link>
            <Link
               href="/cliente/minha-conta/pedidos"
               className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
               <ShoppingBag className="mr-2 inline-block" size={20} />
               Pedidos
            </Link>
            <Link
               href="/logout"
               className="block px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            >
               <LogOut className="mr-2 inline-block" size={20} />
               Sair
            </Link>
         </nav>
      </div>
   );
};

export default SidebarAccount;
