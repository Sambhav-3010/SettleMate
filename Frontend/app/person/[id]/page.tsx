"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Loader2 } from "lucide-react"

const mockExpenses = [
  { id: "1", description: "Dinner", amount: 45.5, paidBy: "You", date: "2024-01-15" },
  { id: "2", description: "Movie tickets", amount: 30, paidBy: "Jack", date: "2024-01-10" },
  { id: "3", description: "Gas", amount: 25, paidBy: "You", date: "2024-01-05" },
]

const mockSettlements = [{ id: "1", amount: 50, type: "payment", date: "2024-01-12" }]

export default function PersonPage({ params }: { params: { id: string } }) {
  const { loading } = useAuthGuard()
  const personName = "Jack Smith"
  const personEmail = "jack@example.com"
  const balance = 100

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)] space-y-4">
      <section className="line-panel p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="muted-label">/// Person Ledger</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">{personName}</h1>
            <p className="mt-2 text-muted-foreground">{personEmail}</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </section>

      <Card className="line-panel p-6">
        <p className="muted-label">Balance</p>
        <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-green-400">{personName} owes you ₹{balance}</p>
      </Card>

      <div className="flex gap-3">
        <Link href={`/settlements/user/${params.id}`}>
          <Button>Settle Up</Button>
        </Link>
        <Link href={`/expenses/new?person=${params.id}`}>
          <Button variant="outline">Add Expense</Button>
        </Link>
      </div>

      <Tabs defaultValue="expenses" className="space-y-3">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border border-border bg-card p-1">
          <TabsTrigger value="expenses" className="rounded-none">Expenses</TabsTrigger>
          <TabsTrigger value="settlements" className="rounded-none">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="m-0 space-y-3">
          {mockExpenses.map((expense) => (
            <Card key={expense.id} className="line-panel p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{expense.description}</p>
                <p className="font-semibold">₹{expense.amount}</p>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <p>{expense.paidBy} paid</p>
                <p>{expense.date}</p>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settlements" className="m-0 space-y-3">
          {mockSettlements.length > 0 ? (
            mockSettlements.map((settlement) => (
              <Card key={settlement.id} className="line-panel p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Payment received</p>
                  <p className="font-semibold">₹{settlement.amount}</p>
                </div>
                <p className="text-sm text-muted-foreground">{settlement.date}</p>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No settlements yet</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
