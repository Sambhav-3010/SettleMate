"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

export default function SettlePage({ params }: { params: { type: string; id: string } }) {
  const { register, handleSubmit } = useForm()
  const [payer, setPayer] = useState("paying")
  const isGroup = params.type === "group"
  const balance = 100

  const onSubmit = async (data: any) => {
    // Handle settlement
    console.log(data)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={isGroup ? `/groups/${params.id}` : `/person/${params.id}`}>
            <Button variant="outline">← Back</Button>
          </Link>
          <h1 className="text-3xl font-bold">Settle Up</h1>
        </div>

        <Card className="p-8 border border-border mb-8">
          <p className="text-muted-foreground text-sm mb-2">Current Balance</p>
          <p className="text-4xl font-bold text-green-600">You are owed ${balance}</p>
        </Card>

        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isGroup && (
              <div>
                <label className="block text-sm font-medium mb-2">Settling with Member</label>
                <Select>
                  <SelectTrigger className="bg-input text-foreground">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    <SelectItem value="jack">Jack Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Jones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPayer("paying")}
                className={`flex-1 p-4 rounded-md border-2 transition-colors ${
                  payer === "paying" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                <p className="font-bold">I'm Paying</p>
              </button>
              <button
                type="button"
                onClick={() => setPayer("receiving")}
                className={`flex-1 p-4 rounded-md border-2 transition-colors ${
                  payer === "receiving" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                <p className="font-bold">I'm Receiving</p>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Note (optional)</label>
              <Input placeholder="Add a note..." {...register("note")} />
            </div>

            <Button type="submit" className="w-full">
              Record Settlement
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
