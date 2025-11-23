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
import { EditGroupModal } from "@/components/edit-group-modal"
import { AddMemberModal } from "@/components/add-member-modal"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { Settings, UserPlus, Edit } from "lucide-react"

interface Member {
  user: {
    id: string
    username: string
    name: string
  }
  role: string
}

export default function GroupPage() {
  const { user, loading } = useAuthGuard()
  const params = useParams<{ id: string }>()
  const [groupName, setGroupName] = useState("Loading...")
  const [groupDescription, setGroupDescription] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!loading) {
      fetchGroupData()
    }
  }, [loading, params.id, refreshTrigger])

  const fetchGroupData = () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.id}`, { withCredentials: true })
      .then(res => {
        setGroupName(res.data.name)
        setGroupDescription(res.data.description || "")
        setMembers(res.data.members)
      })
      .catch(err => console.error("Failed to fetch room", err))
  }

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
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
              <h3 className="text-lg font-semibold mb-6">Group Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Group Name</h4>
                    <p className="text-sm text-muted-foreground">{groupName}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditGroupOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {groupDescription || "No description set"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditGroupOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Members</h4>
                    <p className="text-sm text-muted-foreground">{members.length} members in this group</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Members
                  </Button>
                </div>
              </div>
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

      <EditGroupModal
        isOpen={isEditGroupOpen}
        onClose={() => setIsEditGroupOpen(false)}
        roomId={params.id}
        currentName={groupName}
        currentDescription={groupDescription}
        onSuccess={fetchGroupData}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        roomId={params.id}
        onSuccess={fetchGroupData}
      />
    </main>
  )
}
