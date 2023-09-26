import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {

  if (request.nextUrl.pathname.match('/((?!login).*)')) {
    const jwtToken = request.cookies.get('jwt')
    console.log("request.url:"+request.url)
    //JWTが存在しない場合、ログインページにリダイレクト
    if (!jwtToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const cookie = `${jwtToken.name}=${jwtToken.value}`;
    console.log("MW:"+cookie);
    const options: RequestInit = {
        headers: {
        cookie,
        },
        cache: "no-store",
    };

    const response = await fetch(`http://localhost:8080/check-auth`, options);
    if (response.status !== 200) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}
export const config = {
  matcher: [

    '/((?!api|_next|favicon.ico).*)',
  ],
}