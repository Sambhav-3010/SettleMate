"use client"

import { useState } from "react"
import Link from "next/link"
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

const mockPeople = [
  { id: "1", name: "Jack Smith", email: "jack@example.com", balance: 100 },
  { id: "2", name: "Sarah Jones", email: "sarah@example.com", balance: -50 },
  { id: "3", name: "Mike Davis", email: "mike@example.com", balance: 75 },
]

const mockGroups = [
  { id: "1", name: "Weekend Trip", members: 4 },
  { id: "2", name: "Apartment", members: 3 },
  { id: "3", name: "Game Night", members: 5 },
]

export default function ContactsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data: any) => {
    // Handle group creation
    setIsOpen(false)
    reset()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12">Contacts</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* People Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">People</h2>
            <div className="space-y-3">
              {mockPeople.map((person) => (
                <Link key={person.id} href={`/person/${person.id}`}>
                  <Card className="p-4 border border-border hover:bg-secondary transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.email}</p>
                      </div>
                      <span className={person.balance > 0 ? "font-bold text-green-600" : "font-bold text-red-600"}>
                        {person.balance > 0 ? "+" : ""}
                        {person.balance}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Groups Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Groups</h2>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>Create Group</Button>
                </DialogTrigger>
                <DialogContent className="border border-border bg-card">
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>Start a new expense group with your friends.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Group Name</label>
                      <Input placeholder="e.g., Weekend Trip" {...register("groupName", { required: true })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description (optional)</label>
                      <Input placeholder="What's this group for?" {...register("description")} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Members</label>
                      <Input placeholder="Search and add friends..." {...register("members")} />
                    </div>
                    <Button type="submit" className="w-full">
                      Create Group
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-3">
              {mockGroups.map((group) => (
                <Link key={group.id} href={`/groups/${group.id}`}>
                  <Card className="p-4 border border-border hover:bg-secondary transition-colors cursor-pointer">
                    <p className="font-bold">{group.name}</p>
                    <p className="text-sm text-muted-foreground">{group.members} members</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
