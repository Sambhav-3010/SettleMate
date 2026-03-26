"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[1.25fr_1fr]">
        <section className="line-panel flex min-h-[540px] flex-col justify-between p-8 md:p-10">
          <div>
            <p className="muted-label">/// Access</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Sign in to continue.</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Use your Google account to access groups, expenses, settlements, and live chat.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">Secure OAuth flow with persistent sessions.</div>
        </section>

        <Card className="line-panel min-h-[540px] justify-center p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">Welcome to SettleMate</h2>
          <p className="text-muted-foreground">Authenticate once and continue from any device.</p>

          <Button
            variant="outline"
            className="mt-6 h-12 w-full justify-center gap-3 text-xs"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              "Connecting..."
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue With Google
              </>
            )}
          </Button>
        </Card>
      </div>
    </main>
  )
}
