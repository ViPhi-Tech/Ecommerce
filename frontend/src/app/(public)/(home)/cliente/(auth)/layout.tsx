import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactNode } from "react";

const clientId = process.env.GOOGLE_CLIENT_ID as string;

export default async function AuthLayout({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
   );
}
