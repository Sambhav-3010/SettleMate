import type React from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { AuthProvider } from "../contexts/authContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans antialiased">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: "SettleMate",
  description: "Split expenses with friends",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}
