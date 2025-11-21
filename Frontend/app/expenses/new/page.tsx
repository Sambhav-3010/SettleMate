"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().transform(Number).pipe(z.number().positive()),
  category: z.string(),
  date: z.string(),
  splitType: z.enum(["equal", "percentage", "exact"]),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

export default function AddExpensePage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { splitType: "equal", date: new Date().toISOString().split("T")[0] },
  })
  const splitType = watch("splitType")
  const [tab, setTab] = useState("individual")

  const onSubmit = async (data: ExpenseFormData) => {
    // Handle expense creation
    console.log(data)
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
                  <Input placeholder="e.g., Dinner" {...register("description")} />
                  {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                  {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select>
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input type="date" {...register("date")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">With Person</label>
                  <Input placeholder="Search contact..." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Paid By</label>
                  <Select>
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="you">You</SelectItem>
                      <SelectItem value="other">Other Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Split Type</label>
                  <Select>
                    <SelectTrigger className="bg-input text-foreground" {...register("splitType")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="equal">Equal Split</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="exact">Exact Amounts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Create Expense
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="group" className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Group</label>
                  <Select>
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Choose group" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="trip">Weekend Trip</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Input placeholder="e.g., Groceries" {...register("description")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input type="date" {...register("date")} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Paid By</label>
                  <Select>
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border">
                      <SelectItem value="you">You</SelectItem>
                      <SelectItem value="jack">Jack</SelectItem>
                      <SelectItem value="sarah">Sarah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Create Expense
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
