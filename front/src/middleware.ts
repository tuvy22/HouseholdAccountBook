import { NextRequest, NextResponse } from "next/server";
import { SESSION_ID_COOKIE } from "./app/util/constants";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.match("/((?!login|user-register|user-invite).*)")
  ) {
    const sessionId = request.cookies.get(SESSION_ID_COOKIE);

    if (!sessionId) {
      //セッションIDが存在しない場合、ログインページに
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const cookie = `${sessionId.name}=${sessionId.value}`;

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
