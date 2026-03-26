"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"

interface Member {
  user: {
    id: string
    username: string
    name: string
  }
}

interface AddExpenseModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  onSuccess: () => void
}

export function AddExpenseModal({ isOpen, onOpenChange, roomId, onSuccess }: AddExpenseModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [splitType, setSplitType] = useState("EQUAL")
  const [members, setMembers] = useState<Member[]>([])
  const [splits, setSplits] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && roomId) {
      fetchMembers()
    }
  }, [isOpen, roomId])

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, { withCredentials: true })
      setMembers(res.data.members)
    } catch (err) {
      console.error("Failed to fetch members", err)
    }
  }

  const handleSplitChange = (userId: string, value: string) => {
    setSplits((prev) => ({ ...prev, [userId]: value }))
  }

  const handleSubmit = async () => {
    if (!description || !amount) return

    const totalAmount = parseFloat(amount)
    const payload: any = {
      amount: totalAmount,
      description,
    }

    if (splitType === "PERCENTAGE") {
      payload.splits = members.map((m) => {
        const percentage = parseFloat(splits[m.user.id] || "0")
        return {
          userId: m.user.id,
          amount: (totalAmount * percentage) / 100,
        }
      })
    } else if (splitType === "EXACT") {
      payload.splits = members.map((m) => ({
        userId: m.user.id,
        amount: parseFloat(splits[m.user.id] || "0"),
      }))
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses`, payload, {
        withCredentials: true,
      })
      onSuccess()
      onOpenChange(false)
      setDescription("")
      setAmount("")
      setSplits({})
      setSplitType("EQUAL")
    } catch (err) {
      console.error("Failed to create expense", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Dinner" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="grid gap-2">
            <Label>Split Type</Label>
            <Select value={splitType} onValueChange={setSplitType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EQUAL">Equally</SelectItem>
                <SelectItem value="PERCENTAGE">By Percentage</SelectItem>
                <SelectItem value="EXACT">By Exact Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {splitType !== "EQUAL" && (
            <div className="space-y-2">
              <Label>Splits</Label>
              {members.map((member) => (
                <div key={member.user.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{member.user.username}</span>
                  <Input
                    type="number"
                    className="w-28"
                    placeholder={splitType === "PERCENTAGE" ? "%" : "₹"}
                    value={splits[member.user.id] || ""}
                    onChange={(e) => handleSplitChange(member.user.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
