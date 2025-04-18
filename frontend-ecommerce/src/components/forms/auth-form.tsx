"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import CustomFormField, { FormFieldType } from "../custom-input";
import { LockKeyhole, Mail } from "lucide-react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

interface AuthFormProps {
   isLogin?: boolean;
}

const signInFormSchema = z.object({
   email: z
      .string({ message: "O campo email é obrigatório" })
      .email("Email inválido"),
   password: z
      .string({ message: "O campo senha é obrigatório" })
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const signUpFormSchema = signInFormSchema.extend({
   confirmPassword: z
      .string({ message: "O campo confirmar senha é obrigatório" })
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export function AuthForm({ isLogin }: AuthFormProps) {
   const router = useRouter();

   const form = useForm<z.infer<typeof signInFormSchema>>({
      resolver: zodResolver(isLogin ? signInFormSchema : signUpFormSchema),
   });

   const login = async (data: SignInFormData) => {
      const { email, password } = data;
      const { data: response } = await api("auth/token", {
         method: "POST",
         data: JSON.stringify({ email: email, password }),
      });

      if (response?.status) {
         router.push("/cliente/minha-conta/dados-pessoais");
      }
   };

   const register = async (data: SignInFormData) => {
      const { email, password } = data;
      const response = await api("auth/register", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         data: JSON.stringify({ username: email, password }),
      });

      console.log(response);
   };

   const onSubmit = form.handleSubmit(async data => {
      if (isLogin) {
         await login(data);
         return;
      }

      await register(data);
      return;
   });

   return (
      <Form {...form}>
         <form onSubmit={onSubmit} className="w-full space-y-4">
            <div className="space-y-2">
               <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="exemplo@gmail.com"
                  icon={<Mail className="text-gray-500" size={18} />}
                  iconAlt="email"
               />
            </div>
            <div className="space-y-2">
               <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="password"
                  label="Senha"
                  placeholder="********"
                  type="password"
                  icon={<LockKeyhole className="text-gray-500" size={18} />}
                  iconAlt="senha"
               />
            </div>
            {!isLogin && (
               <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="confirmPassword"
                  label="Confirmar Senha"
                  placeholder="********"
                  type="password"
                  icon={<LockKeyhole className="text-gray-500" size={18} />}
                  iconAlt="senha"
               />
            )}
            <Button type="submit" className="w-full" variant={"primary-orange"}>
               {isLogin ? "Entrar" : "Cadastrar"}
            </Button>
         </form>
      </Form>
   );
}
