"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Loader2 } from "lucide-react"

export default function AddExpensePage() {
  const { loading } = useAuthGuard()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm()

  const [tab, setTab] = useState("individual")

  const onSubmit = (data: any) => {
    console.log("Expense Submitted:", data)
    reset()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="line-panel flex items-center justify-between p-6">
          <div>
            <p className="muted-label">/// Expense</p>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">Create Expense</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </section>

        <Card className="line-panel p-6">
          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border border-border bg-card p-1">
              <TabsTrigger value="individual" className="rounded-none">Individual</TabsTrigger>
              <TabsTrigger value="group" className="rounded-none">Group</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="m-0">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <Input placeholder="Dinner" {...register("description", { required: true })} />
                  {errors.description && <p className="mt-1 text-xs text-red-400">Description is required</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Amount</label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("amount", { required: true })} />
                  {errors.amount && <p className="mt-1 text-xs text-red-400">Amount is required</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Category</label>
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && <p className="mt-1 text-xs text-red-400">Category is required</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Date</label>
                  <Input type="date" {...register("date", { required: true })} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">With Person</label>
                  <Input placeholder="Search contact..." {...register("contact")} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Paid By</label>
                  <Controller
                    name="paidBy"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select person" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="you">You</SelectItem>
                          <SelectItem value="other">Other Person</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">Create Expense</Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="group" className="m-0">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Select Group</label>
                  <Controller
                    name="group"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trip">Weekend Trip</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <Input placeholder="Groceries" {...register("groupDescription")} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Amount</label>
                  <Input type="number" step="0.01" {...register("groupAmount")} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Date</label>
                  <Input type="date" {...register("groupDate")} />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">Create Expense</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
