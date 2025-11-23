"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatModal } from "@/components/chat-modal"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { ExpenseList } from "@/components/expense-list"
import { Balances } from "@/components/balances"
import { useState, useEffect } from "react"
import axios from "axios"

interface Member {
  user: {
    id: string
    username: string
    name: string
  }
  role: string
}

export default function GroupPage() {
  const params = useParams<{ id: string }>()
  const [groupName, setGroupName] = useState("Loading...")
  const [members, setMembers] = useState<Member[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.id}`, { withCredentials: true })
      .then(res => {
        setGroupName(res.data.name)
        setMembers(res.data.members)
      })
      .catch(err => console.error("Failed to fetch room", err))
  }, [params.id])

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{groupName}</h1>
            <p className="text-muted-foreground">{members.length} members</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <Button className="font-medium" onClick={() => setIsAddExpenseOpen(true)}>
            Add Expense
          </Button>
          <Button variant="outline" className="font-medium" onClick={() => setIsChatOpen(true)}>
            Open Chat Room
          </Button>
          <Link href={`/settlements/group/${params.id}`}>
            <Button variant="outline">Settle Up</Button>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Group Members */}
          <Card className="p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Members</h2>
            <div className="space-y-3">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.user.id} className="p-3 rounded-md bg-secondary">
                    <p className="font-medium">{member.user.name || member.user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-6">
            <ExpenseList roomId={params.id} refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="balances" className="mt-6">
            <Balances roomId={params.id} refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Group Settings</h3>
              <p className="text-muted-foreground">Group settings content will go here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ChatModal
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        roomId={params.id}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        roomId={params.id}
        onSuccess={handleExpenseAdded}
      />
    </main>
  )
}
