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
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    upiId: z.string().min(3, "UPI ID must be at least 3 characters").includes("@", { message: "Invalid UPI ID format" }),
})

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuthGuard()
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
            const fetchProfile = async () => {
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
                    form.reset({
                        username: res.data.username || "",
                        upiId: res.data.upiId || "",
                    })
                } catch (err) {
                    console.error("Failed to fetch profile", err)
                    router.push("/")
                } finally {
                    setInitialLoading(false)
                }
            }
            fetchProfile()
        }
    }, [authLoading, router, form])

    if (authLoading) {
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
            // Show success message or toast
            alert("Profile updated successfully!")
        } catch (err: any) {
            console.error("Update failed", err)
            if (err.response?.data?.message) {
                form.setError("root", { message: err.response.data.message })
            } else {
                form.setError("root", { message: "Something went wrong. Please try again." })
            }
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-2xl mx-auto space-y-8 py-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>

                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
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
                                        <FormItem>
                                            <FormLabel>UPI ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@upi" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.formState.errors.root && (
                                    <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
                                )}

                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
