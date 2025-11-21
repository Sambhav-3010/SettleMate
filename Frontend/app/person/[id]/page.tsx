"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockExpenses = [
  { id: "1", description: "Dinner", amount: 45.5, paidBy: "You", date: "2024-01-15" },
  { id: "2", description: "Movie tickets", amount: 30, paidBy: "Jack", date: "2024-01-10" },
  { id: "3", description: "Gas", amount: 25, paidBy: "You", date: "2024-01-05" },
]

const mockSettlements = [{ id: "1", amount: 50, type: "payment", date: "2024-01-12" }]

export default function PersonPage({ params }: { params: { id: string } }) {
  const personName = "Jack Smith"
  const personEmail = "jack@example.com"
  const balance = 100

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Link href="/contacts">
            <Button variant="outline">← Back</Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{personName}</h1>
            <p className="text-muted-foreground">{personEmail}</p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="p-6 border border-border bg-secondary mb-8">
          <p className="text-sm text-muted-foreground font-medium mb-2">Balance</p>
          <p className="text-4xl font-bold text-green-600">
            {personName} owes you ${balance}
          </p>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Link href={`/settlements/user/${params.id}`}>
            <Button>Settle Up</Button>
          </Link>
          <Link href={`/expenses/new?person=${params.id}`}>
            <Button variant="outline">Add Expense</Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            {mockExpenses.map((expense) => (
              <Card key={expense.id} className="p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold">{expense.description}</p>
                  <p className="font-bold">${expense.amount}</p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>{expense.paidBy} paid</p>
                  <p>{expense.date}</p>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settlements" className="space-y-4">
            {mockSettlements.length > 0 ? (
              mockSettlements.map((settlement) => (
                <Card key={settlement.id} className="p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Payment received</p>
                    <p className="font-bold">${settlement.amount}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{settlement.date}</p>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No settlements yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
