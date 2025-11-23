"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import axios from "axios"
import { UserSearch } from "@/components/user-search"
import { useState, useEffect } from "react"
import { ChatModal } from "@/components/chat-modal"

interface FriendBalance {
  id: string
  name: string
  amount: number
}

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null)
  const [totalOwed, setTotalOwed] = useState(0)
  const [totalOwe, setTotalOwe] = useState(0)
  const [friendBalances, setFriendBalances] = useState<FriendBalance[]>([])
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchGroups()
    fetchInvites()
  }, [])

  const openChat = (roomId: string) => {
    setActiveChatRoomId(roomId)
    setIsChatOpen(true)
  }

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/rooms`, { withCredentials: true })
      setGroups(response.data)
      calculateBalances(response.data)
    } catch (error) {
      console.error("Failed to fetch groups:", error)
    }
  }

  const calculateBalances = async (rooms: any[]) => {
    let owed = 0
    let owe = 0
    const friendsMap: Record<string, FriendBalance> = {}

    for (const room of rooms) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}/expenses/balances`, { withCredentials: true })
        const balances = res.data.balances

        // Find current user's balance in this room (not directly provided by endpoint, need to infer or adjust endpoint)
        // Actually the endpoint returns balances for all users. We need to find "my" net balance relative to others?
        // Wait, the endpoint returns { userId, username, net }. 
        // If I am User A, and net is +10, it means I am owed 10.
        // But this is the net balance in the group. 

        // Let's assume we can filter by "my" user ID, but we don't have it easily here without another call.
        // Instead, let's look at all balances. 
        // Actually, to show "Friend Balances", we need to know who owes whom. 
        // The current `getBalances` endpoint returns net balances for everyone. 
        // It doesn't explicitly say "Alice owes Bob". 
        // However, for the "Overall Balance" and "You Owe/Owed", we can sum up the current user's net balance across groups.

        // We need the current user's ID to find their balance.
        const meRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
        const myId = meRes.data.id

        const myBalance = balances.find((b: any) => b.userId === myId)
        if (myBalance) {
          if (myBalance.net > 0) owed += myBalance.net
          else if (myBalance.net < 0) owe += Math.abs(myBalance.net)
        }

        // For friend balances, this is complex without a specific endpoint. 
        // We'll skip detailed friend balances for now and just show the totals.
      } catch (err) {
        console.error(`Failed to fetch balances for room ${room.id}`, err)
      }
    }
    setTotalOwed(owed)
    setTotalOwe(owe)
  }

  const fetchInvites = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/invites`, { withCredentials: true })
      setInvites(response.data)
    } catch (error) {
      console.error("Failed to fetch invites:", error)
    }
  }

  const handleInviteResponse = async (inviteId: string, action: "ACCEPT" | "REJECT") => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/me/invites/${inviteId}/respond`, { action }, { withCredentials: true })
      fetchInvites()
      if (action === "ACCEPT") {
        fetchGroups()
      }
    } catch (error) {
      console.error(`Failed to ${action} invite:`, error)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        members: selectedUsers
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, payload, { withCredentials: true })
      console.log(response.data)
      setIsOpen(false)
      reset()
      setSelectedUsers([])
      fetchGroups()
    } catch (error) {
      console.error("Failed to create group:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with CTA */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your shared expenses efficiently</p>
          </div>
          <Link href="/expenses/new">
            <Button size="lg" className="font-semibold">
              Add Expense
            </Button>
          </Link>
        </div>

        {/* Bento Grid - Row 1: Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Balance Card - Large */}
          <Card className="md:col-span-2 p-8 border border-border bg-card hover:border-foreground/20 transition-all duration-300">
            <p className="text-muted-foreground text-sm font-medium mb-4">Overall Balance</p>
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-5xl font-bold mb-2 ${totalOwed - totalOwe >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${(totalOwed - totalOwe).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalOwed - totalOwe >= 0 ? "You are owed in total" : "You owe in total"}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-secondary rounded-lg p-4">
                  <ResponsiveContainer width={150} height={120}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Owed to you", value: totalOwed },
                          { name: "You owe", value: totalOwe },
                        ]}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#16a34a" /> {/* Green for owed to you */}
                        <Cell fill="#dc2626" /> {/* Red for you owe */}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-8 border border-border bg-card hover:border-foreground/20 transition-all duration-300">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">You Are Owed</p>
                <p className="text-3xl font-bold text-green-600">${totalOwed.toFixed(2)}</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">You Owe</p>
                <p className="text-3xl font-bold text-red-600">${totalOwe.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bento Grid - Row 2: Charts and Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Spending Chart - Large */}
          <Card className="lg:col-span-2 p-8 border border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Monthly Spending</h2>
                <p className="text-sm text-muted-foreground">Last 6 months overview</p>
              </div>
            </div>
            <div className="h-[280px] flex items-center justify-center text-muted-foreground">
              Chart data aggregation not implemented yet
            </div>
          </Card>

          {/* Balance Details - Sidebar */}
          <Card className="p-8 border border-border bg-card">
            <h2 className="text-lg font-bold mb-6">Friend Balances</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">Friend balance aggregation not implemented yet</p>
            </div>
          </Card>
        </div>

        {/* Bento Grid - Row 3: Groups */}
        <Card className="p-8 border border-border bg-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">My Groups</h2>
              <p className="text-sm text-muted-foreground mt-1">Chat with friends and split expenses</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="font-medium bg-transparent">
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="border border-border bg-card">
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>Start a new expense group with your friends.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Name</label>
                    <Input placeholder="e.g., Weekend Trip" {...register("name", { required: true })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Add Members</label>
                    <UserSearch
                      selectedUsers={selectedUsers}
                      onSelect={setSelectedUsers}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Group
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pending Invites */}
            {invites.map((invite) => (
              <div key={invite.id} className="group">
                <div className="p-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg">{invite.room.name}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600">
                      Invite
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Invited by {invite.fromUser.username}</p>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-yellow-500/20">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleInviteResponse(invite.id, "ACCEPT")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleInviteResponse(invite.id, "REJECT")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Active Groups */}
            {groups.map((group) => (
              <div key={group.id} className="group">
                <div className="p-6 rounded-lg border border-border bg-secondary hover:bg-muted transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg">{group.name}</h3>
                    {/* Balance display would require fetching group balances, omitting for now */}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{group.members?.length || 0} members</p>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                    <Link href={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View
                      </Button>
                    </Link>
                    <Button size="sm" className="w-full flex-1" onClick={() => openChat(group.id)}>
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ChatModal
            isOpen={isChatOpen}
            onOpenChange={setIsChatOpen}
            roomId={activeChatRoomId}
          />
        </Card>

        {/* Quick Actions Footer */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/chat/history">
            <Button variant="outline" className="font-medium bg-transparent">
              View Chat History
            </Button>
          </Link>
          <Link href="/settle-up">
            <Button className="font-medium">Settle Up</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
