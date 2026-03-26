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
import { UserPlus, Edit, ArrowLeft } from "lucide-react"

interface Member {
  user: {
    id: string
    username: string
    name: string
  }
  role: string
}

export default function GroupPage() {
  const { loading } = useAuthGuard()
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
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${params.id}`, { withCredentials: true })
      .then((res) => {
        setGroupName(res.data.name)
        setGroupDescription(res.data.description || "")
        setMembers(res.data.members)
      })
      .catch((err) => console.error("Failed to fetch room", err))
  }

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)] space-y-4">
      <section className="line-panel p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <p className="muted-label">/// Group</p>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">{groupName}</h1>
            <p className="mt-2 text-muted-foreground">{members.length} members</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <Button onClick={() => setIsAddExpenseOpen(true)}>Add Expense</Button>
            <Button variant="outline" onClick={() => setIsChatOpen(true)}>Open Chat</Button>
            <Link href={`/settlements/group/${params.id}`}>
              <Button variant="outline" className="w-full">Settle Up</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.1fr_2fr]">
        <Card className="line-panel p-6">
          <p className="muted-label">/// Members</p>
          <div className="mt-4 space-y-2">
            {members.map((member) => (
              <div key={member.user.id} className="border border-border p-3">
                <p className="font-semibold">{member.user.name || member.user.username}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>

        <Tabs defaultValue="expenses" className="space-y-3">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-none border border-border bg-card p-1">
            <TabsTrigger value="expenses" className="rounded-none">Expenses</TabsTrigger>
            <TabsTrigger value="balances" className="rounded-none">Balances</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="m-0">
            <Card className="line-panel p-5">
              <ExpenseList roomId={params.id} refreshTrigger={refreshTrigger} />
            </Card>
          </TabsContent>

          <TabsContent value="balances" className="m-0">
            <Card className="line-panel p-5">
              <Balances roomId={params.id} refreshTrigger={refreshTrigger} />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="m-0">
            <Card className="line-panel p-5">
              <h3 className="text-lg font-semibold">Group Settings</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between border border-border p-4">
                  <div>
                    <h4 className="font-medium">Group Name</h4>
                    <p className="text-sm text-muted-foreground">{groupName}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditGroupOpen(true)}>
                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between border border-border p-4">
                  <div>
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{groupDescription || "No description set"}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditGroupOpen(true)}>
                    <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between border border-border p-4">
                  <div>
                    <h4 className="font-medium">Members</h4>
                    <p className="text-sm text-muted-foreground">{members.length} members in this group</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="mr-2 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <ChatModal isOpen={isChatOpen} onOpenChange={setIsChatOpen} roomId={params.id} />

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
