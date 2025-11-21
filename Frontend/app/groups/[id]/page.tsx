"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockGroupBalances = [
  { person: "You", amount: -50, type: "owe" },
  { person: "Jack", amount: 100, type: "owed" },
  { person: "Sarah", amount: 75, type: "owed" },
]

const mockGroupMembers = [
  { name: "You", role: "Admin" },
  { name: "Jack Smith", role: "Member" },
  { name: "Sarah Jones", role: "Member" },
]

const mockExpenses = [
  { id: "1", description: "Dinner", amount: 120, paidBy: "You", date: "2024-01-15" },
  { id: "2", description: "Hotel", amount: 300, paidBy: "Jack", date: "2024-01-14" },
]

export default function GroupPage() {
  const params = useParams<{ id: string }>()
  const groupName = "Weekend Trip"
  const groupDescription = "Trip to the mountains"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Link href="/contacts">
            <Button variant="outline">← Back</Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{groupName}</h1>
            <p className="text-muted-foreground">{groupDescription}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Link href={`/chat/room/${params.id}`}>
            <Button className="font-medium">Open Chat Room</Button>
          </Link>
          <Link href={`/settlements/group/${params.id}`}>
            <Button variant="outline">Settle Up</Button>
          </Link>
          <Link href={`/expenses/new?group=${params.id}`}>
            <Button variant="outline">Add Expense</Button>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Group Balances */}
          <Card className="lg:col-span-2 p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Balances</h2>
            <div className="space-y-3">
              {mockGroupBalances.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary">
                  <span className="font-medium">{item.person}</span>
                  <span className={item.type === "owe" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                    {item.type === "owe" ? "-" : "+"}
                    {Math.abs(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Group Members */}
          <Card className="p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Members</h2>
            <div className="space-y-3">
              {mockGroupMembers.map((member, i) => (
                <div key={i} className="p-3 rounded-md bg-secondary">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </Card>
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

          <TabsContent value="settlements">
            <p className="text-muted-foreground">No settlements yet</p>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
