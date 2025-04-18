import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const REDIRECT_WHEN_NOT_AUTHENTICATED = "cliente/login";

const publicRoutes = [
   { path: "/cliente/login", whenAuthenticated: "redirect" },
   { path: "/cliente/cadastro", whenAuthenticated: "redirect" },
   { path: "/", whenAuthenticated: "redirect" },
] as const;

const privateRoutes = [
   { path: "/admin", whenAuthenticated: "auth" },
   { path: "/cliente/minha-conta", whenAuthenticated: "auth" },
] as const;

export function middleware(request: NextRequest) {
   const path = request.nextUrl.pathname;
   const authToken = request.cookies.get("access_token");
   console.log(path);

   const privateRoute = privateRoutes.find(route =>
      path.startsWith(route.path),
   );

   if (privateRoute && !authToken) {
      const redirectPath = request.nextUrl.clone();
      redirectPath.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      return NextResponse.redirect(redirectPath);
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
   ],
};
