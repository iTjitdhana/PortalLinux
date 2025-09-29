import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Thai } from "next/font/google"
import "./globals.css"

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-noto-sans-thai",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ระบบจัดการองค์กร",
  description: "ศูนย์รวมแอปพลิเคชันทั้งหมดขององค์กร",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
