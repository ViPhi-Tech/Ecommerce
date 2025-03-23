"use client";

import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function RegisterPage() {
   return (
      <div className="flex min-h-[calc(100vh-80px)] justify-center">
         <div className="-mt-20 flex w-1/2 flex-1 flex-col justify-center sm:px-6 lg:flex-none">
            <div className="flex justify-center">
               <div className="w-full px-5 md:w-[500px]">
                  <div className="mt-3">
                     <h2 className="mt-6 text-3xl font-extrabold">
                        Crie sua conta
                     </h2>
                     <p className="my-3 text-sm text-gray-600">
                        Já tem uma conta?{" "}
                        <Link
                           href="/cliente/login"
                           className="font-medium text-primary hover:text-primary/90"
                        >
                           Faça login
                        </Link>
                     </p>
                     <AuthForm />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
