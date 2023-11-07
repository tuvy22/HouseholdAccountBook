import axios from "axios";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.match("/((?!login|user-register|user-invite).*)")
  ) {
    const jwtToken = request.cookies.get("jwt");

    if (!jwtToken) {
      //JWTが存在しない場合、ログインページに
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const cookie = `${jwtToken.name}=${jwtToken.value}`;

    const options: RequestInit = {
      headers: {
        cookie,
      },
      cache: "no-store",
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/private/check-auth`,
        options
      );
      if (response.status !== 200) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
