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
  const { user, loading } = useAuthGuard()
  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm()

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
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
          <h1 className="text-3xl font-bold">Add Expense</h1>
        </div>

        <Card className="p-8 border border-border">
          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input placeholder="e.g., Dinner" {...register("description", { required: true })} />
                  {errors.description && <p className="text-red-600 text-xs mt-1">Description is required</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("amount", { required: true })} />
                  {errors.amount && <p className="text-red-600 text-xs mt-1">Amount is required</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>

                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="bg-input text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border border-border">
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.category && <p className="text-red-600 text-xs mt-1">Category is required</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input type="date" {...register("date", { required: true })} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">With Person</label>
                  <Input placeholder="Search contact..." {...register("contact")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Paid By</label>

                  <Controller
                    name="paidBy"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="bg-input text-foreground">
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

                <Button type="submit" className="w-full">Create Expense</Button>
              </form>
            </TabsContent>

            <TabsContent value="group" className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium mb-2">Select Group</label>

                  <Controller
                    name="group"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="bg-input text-foreground">
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

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input placeholder="e.g., Groceries" {...register("groupDescription")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input type="number" step="0.01" {...register("groupAmount")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input type="date" {...register("groupDate")} />
                </div>

                <Button type="submit" className="w-full">Create Expense</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}