"use client";

import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/axios";

const GoogleLoginComponent = ({ onSuccess, onFailure }: any) => {
   const { toast } = useToast();

   return (
      <div>
         <GoogleLogin
            onSuccess={async (credentialResponse: CredentialResponse) => {
               const response = await api
                  .post("/auth/callback", credentialResponse)
                  .then((response: any) => {
                     if (response.status === 200) {
                     }
                  })
                  .catch((error: any) => {
                     toast({
                        title: "Erro",
                        description: "Não foi possível realizar o login.",
                        variant: "destructive",
                     });
                  });
            }}
            onError={() => {
               console.log("Login Failed");
            }}
            shape="pill"
            use_fedcm_for_prompt={true}
         />
      </div>
   );
};

export default GoogleLoginComponent;
