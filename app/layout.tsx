import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { PageTransition } from "@/components/page-transition"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkyBook - Flight Reservations",
  description: "Book your flights with SkyBook",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <GlobalErrorHandler />
        <ErrorBoundary>
          <AuthProvider>
            <PageTransition>{children}</PageTransition>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
