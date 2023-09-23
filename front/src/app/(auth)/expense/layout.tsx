
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '家計簿一覧',
  description: '家計簿一覧です。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
