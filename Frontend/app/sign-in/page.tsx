"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useForm } from "react-hook-form"

export default function SignInPage() {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    // Simulate auth
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 500)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-md p-8 border border-border">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="you@example.com" {...register("email")} className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" {...register("password")} className="w-full" />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="font-medium underline hover:no-underline">
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </main>
  )
}
