import { cookies } from 'next/headers';
import { redirect } from "next/navigation"

export async function auth() {
  //   const { req } = context;
    const jwtToken = cookies().get('jwt')
    // JWTが存在しない場合、ログインページにリダイレクト
    if (!jwtToken) {
      return false;
    }
    
    const cookie = `${jwtToken.name}=${jwtToken.value}`;
    console.log(cookie);
    const options: RequestInit = {
      headers: {
          cookie,
      },
      cache: "no-store",
    };
    const response = await fetch(
      `http://localhost:8080/check-auth`,
      options,
    );
  
    if (response.status !== 200) {
      return false;
    }
      return true;
  }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if(!await auth()){
    redirect(`/login`);
  };
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
