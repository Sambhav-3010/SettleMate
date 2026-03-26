"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { useAuthGuard } from "@/hooks/useAuthGuard"

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  upiId: z.string().min(3, "UPI ID must be at least 3 characters").includes("@", { message: "Invalid UPI ID format" }),
})

export default function OnboardingPage() {
  const { loading: authLoading } = useAuthGuard()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      upiId: "",
    },
  })

  useEffect(() => {
    if (!authLoading) {
      const checkProfile = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
          if (res.data.upiId) {
            router.push("/dashboard")
          } else if (res.data.username) {
            form.setValue("username", res.data.username)
          }
        } catch (err) {
          console.error("Failed to fetch profile", err)
          router.push("/")
        } finally {
          setInitialLoading(false)
        }
      }
      checkProfile()
    }
  }, [authLoading, router, form])

  if (authLoading || initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, values, { withCredentials: true })
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Onboarding failed", err)
      form.setError("root", { message: err.response?.data?.message || "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[1.2fr_1fr]">
        <section className="line-panel p-8 md:p-10">
          <p className="muted-label">/// Profile Setup</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Let&apos;s activate your wallet layer.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Add your username and UPI ID once so settlements can run smoothly across every room.
          </p>
        </section>

        <Card className="line-panel border p-0">
          <CardHeader>
            <CardTitle>Complete onboarding</CardTitle>
            <CardDescription>These details are used for transfers and room identity.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="reveal-up">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem className="reveal-up">
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="john@upi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue To Dashboard
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
