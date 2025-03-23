"use client";

import { AuthForm } from "@/components/forms/auth-form";
import GoogleLoginComponent from "@/components/forms/google-login";
import { api } from "@/lib/axios";
import Link from "next/link";
import { useEffect } from "react";

export default function LoginPage() {
   return (
      <div className="flex min-h-[calc(100vh-80px)] justify-center">
         <div className="-mt-20 flex w-1/2 flex-1 flex-col justify-center sm:px-6 lg:flex-none">
            <div className="flex justify-center">
               <div className="w-full px-5 md:w-[500px]">
                  <div className="mt-3">
                     <h2 className="mt-6 text-3xl font-extrabold">
                        Entre na sua conta
                     </h2>
                     <p className="my-3 text-sm text-gray-600">
                        Ou{" "}
                        <Link
                           href="/cliente/cadastro"
                           className="font-medium text-primary hover:text-primary/90"
                        >
                           crie uma nova conta
                        </Link>
                     </p>
                     <GoogleLoginComponent />
                     <AuthForm isLogin />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
