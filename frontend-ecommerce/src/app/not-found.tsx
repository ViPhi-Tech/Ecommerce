import Link from "next/link";

export default function NotFound() {
   return (
      <div className="flex min-h-screen items-center px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
         <div className="w-full space-y-6 text-center">
            <div className="space-y-3">
               <h1 className="animate-bounce text-4xl font-bold tracking-tighter sm:text-5xl">
                  404
               </h1>
               <p className="text-gray-500">
                  Parece que você está perdido. Vamos te ajudar a encontrar o
                  que você está procurando.
               </p>
            </div>
            <Link
               href="/"
               className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
               prefetch={false}
            >
               Retornar para a página inicial
            </Link>
         </div>
      </div>
   );
}
