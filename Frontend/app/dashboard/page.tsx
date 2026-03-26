"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { useAuthGuard } from "@/hooks/useAuthGuard"

interface FriendBalance {
  id: string
  name: string
  amount: number
}

export default function DashboardPage() {
  const { loading } = useAuthGuard()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null)
  const [totalOwed, setTotalOwed] = useState(0)
  const [totalOwe, setTotalOwe] = useState(0)
  const { register, handleSubmit, reset } = useForm()

  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      fetchGroups()
      fetchInvites()
      checkProfile()
    }
  }, [loading])

  const checkProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
      if (!res.data.upiId) {
        router.push("/onboarding")
      }
    } catch (err) {
      console.error("Failed to check profile", err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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

    for (const room of rooms) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}/expenses/balances`, { withCredentials: true })
        const balances = res.data.balances
        const meRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
        const myId = meRes.data.id

        const myBalance = balances.find((b: any) => b.userId === myId)
        if (myBalance) {
          if (myBalance.net > 0) owed += myBalance.net
          else if (myBalance.net < 0) owe += Math.abs(myBalance.net)
        }
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
    } catch (error: any) {
      console.error(`Failed to ${action} invite:`, error)
      alert(`Failed to ${action.toLowerCase()} invite: ${error.response?.data?.message || error.message}`)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        members: selectedUsers,
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, payload, { withCredentials: true })
      setIsOpen(false)
      reset()
      setSelectedUsers([])
      fetchGroups()
    } catch (error) {
      console.error("Failed to create group:", error)
    }
  }

  const net = totalOwed - totalOwe

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)] space-y-4">
      <section className="line-panel grid gap-6 p-6 md:grid-cols-[1.2fr_auto] md:items-end md:p-8">
        <div>
          <p className="muted-label">/// Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Your expense command center</h1>
          <p className="mt-3 text-muted-foreground">Manage balances, groups, invites, and chat rooms in one place.</p>
        </div>
        <Link href="/expenses/new">
          <Button size="lg">Add Expense</Button>
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Card className="line-panel p-6 md:col-span-2">
          <p className="muted-label">Overall Balance</p>
          <p className={`mt-6 text-5xl font-semibold tracking-[-0.03em] ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
            ₹{net.toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{net >= 0 ? "You are owed in total" : "You owe in total"}</p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="border border-border p-4">
              <p className="muted-label">You Are Owed</p>
              <p className="mt-3 text-3xl font-semibold text-green-400">₹{totalOwed.toFixed(2)}</p>
            </div>
            <div className="border border-border p-4">
              <p className="muted-label">You Owe</p>
              <p className="mt-3 text-3xl font-semibold text-red-400">₹{totalOwe.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="line-panel p-6">
          <p className="muted-label">Quick Actions</p>
          <div className="mt-5 space-y-2">
            <Link href="/chat/history" className="block">
              <Button variant="outline" className="w-full justify-between">View Chat History</Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="outline" className="w-full justify-between">Open Settings</Button>
            </Link>
            <Link href="/settle-up" className="block">
              <Button className="w-full justify-between">Settle Up</Button>
            </Link>
          </div>
        </Card>
      </section>

      <Card className="line-panel p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="muted-label">/// Groups</p>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">My Rooms</h2>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Create Group</Button>
            </DialogTrigger>
            <DialogContent className="border border-border bg-card sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogDescription>Start a new expense room with your friends.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Group Name</label>
                  <Input placeholder="Weekend Trip" {...register("name", { required: true })} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Add Members</label>
                  <UserSearch selectedUsers={selectedUsers} onSelect={setSelectedUsers} />
                </div>
                <Button type="submit" className="w-full">Create Group</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {invites.map((invite) => (
            <div key={invite.id} className="line-panel p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{invite.room.name}</h3>
                <span className="font-mono text-xs text-yellow-300">INVITE</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Invited by {invite.fromUser.username}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => handleInviteResponse(invite.id, "ACCEPT")}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => handleInviteResponse(invite.id, "REJECT")}>Reject</Button>
              </div>
            </div>
          ))}

          {groups.map((group) => (
            <div key={group.id} className="line-panel p-4">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{group.members?.length || 0} members</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link href={`/groups/${group.id}`}>
                  <Button size="sm" variant="outline" className="w-full">View</Button>
                </Link>
                <Button size="sm" className="w-full" onClick={() => openChat(group.id)}>Chat</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ChatModal isOpen={isChatOpen} onOpenChange={setIsChatOpen} roomId={activeChatRoomId} />
    </main>
  )
}
