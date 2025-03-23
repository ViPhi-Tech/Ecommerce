import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/navbar";

const { SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
   : "http://localhost:3000";

export const metadata = {
   metadataBase: new URL(baseUrl),
   title: {
      default: "E-commerce",
      template: `%s | ${SITE_NAME}`,
   },
   robots: {
      follow: true,
      index: true,
   },
};

export default async function RootLayout({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <html
         lang="en"
         className={cn("light", GeistSans.variable)}
         suppressHydrationWarning
      >
         <body className="min-h-screen bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               {children}
            </ThemeProvider>
            <Toaster />
         </body>
      </html>
   );
}
