"use client"

import Link from "next/link"
import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Wallet } from "lucide-react"
import { io } from "socket.io-client"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { QRPaymentModal } from "@/components/qr-payment-modal"

interface Member {
  user: {
    id: string
    username: string
    name: string
  }
}

interface Expense {
  id: string
  payerId: string
  amount: number
  splits: { userId: string; amount: number }[]
}

export default function SettlePage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { user: authUser, loading } = useAuthGuard()
  const { type, id } = use(params)
  const { register, handleSubmit, setValue, watch } = useForm()
  const [payer, setPayer] = useState<"paying" | "receiving">("paying")
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0)
  const router = useRouter()
  const [socket, setSocket] = useState<any>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [receiverInfo, setReceiverInfo] = useState<{ name: string; upiId: string } | null>(null)

  const isGroup = type === "group"

  useEffect(() => {
    if (!loading) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        withCredentials: true,
      })
      setSocket(newSocket)

      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
        .then(res => setCurrentUser(res.data))
        .catch(err => console.error("Failed to fetch current user", err))

      const endpoint = isGroup
        ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`

      axios.get(endpoint, { withCredentials: true })
        .then(res => {
          if (isGroup) {
            setMembers(res.data.members)
          } else {
            setMembers([{ user: res.data }])
          }
        })
        .catch(err => console.error("Failed to fetch data", err))

      if (isGroup) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/expenses`, { withCredentials: true })
          .then(res => setExpenses(res.data.expenses))
          .catch(err => console.error("Failed to fetch expenses", err))
      }

      return () => {
        newSocket.disconnect()
      }
    }
  }, [loading, id, isGroup])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const calculatePairwiseDebt = (otherUserId: string) => {
    if (!currentUser) return 0

    let balance = 0 // Positive means they owe me, Negative means I owe them

    expenses.forEach(exp => {
      const isPayerMe = exp.payerId === currentUser.id
      const isPayerThem = exp.payerId === otherUserId

      if (isPayerMe) {
        // I paid. Did they split?
        const split = exp.splits.find(s => s.userId === otherUserId)
        if (split) {
          balance += split.amount
        }
      } else if (isPayerThem) {
        // They paid. Did I split?
        const split = exp.splits.find(s => s.userId === currentUser.id)
        if (split) {
          balance -= split.amount
        }
      }
    })

    return balance
  }

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId)
    if (!currentUser) return

    const balance = calculatePairwiseDebt(memberId)

    // If balance is positive, they owe me (I am receiving)
    // If balance is negative, I owe them (I am paying)

    if (balance > 0) {
      setPayer("receiving")
      setCalculatedAmount(balance)
      setValue("amount", balance.toFixed(2))
    } else if (balance < 0) {
      setPayer("paying")
      setCalculatedAmount(Math.abs(balance))
      setValue("amount", Math.abs(balance).toFixed(2))
    } else {
      // Settled
      setPayer("paying")
      setCalculatedAmount(0)
      setValue("amount", "0.00")
    }
  }

  const onSubmit = async (data: any) => {
    if (!selectedMemberId || !data.amount || parseFloat(data.amount) === 0) return

    const amount = parseFloat(data.amount)

    // We only allow recording if "I'm Paying" because backend restricts payer to logged-in user.
    if (payer === "receiving") {
      alert("You can only record payments you make. Please ask the other person to record this payment.")
      return
    }

    // Get receiver info and show QR modal
    const selectedMember = members.find(m => m.user.id === selectedMemberId)
    if (!selectedMember) return

    // Fetch receiver's UPI ID
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedMemberId}`,
        { withCredentials: true }
      )

      if (!userRes.data.upiId) {
        alert("The receiver hasn't set up their UPI ID yet. Please ask them to update their profile.")
        return
      }

      setReceiverInfo({
        name: selectedMember.user.name || selectedMember.user.username,
        upiId: userRes.data.upiId
      })
      setIsQRModalOpen(true)
    } catch (error) {
      console.error("Failed to fetch receiver info:", error)
      alert("Failed to load payment details. Please try again.")
    }
  }

  const handlePaymentConfirmed = async () => {
    if (!selectedMemberId || !calculatedAmount) return

    try {
      const payload = {
        amount: calculatedAmount,
        description: "Settlement (Payment Claimed)",
        splits: [
          { userId: selectedMemberId, amount: calculatedAmount }
        ]
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/expenses`, payload, {
        withCredentials: true,
      })

      // Send notification via chat
      if (socket) {
        const selectedMember = members.find(m => m.user.id === selectedMemberId)
        const message = `${currentUser?.name || "Someone"} claims to have paid you ₹${calculatedAmount}. Please confirm if you received the payment.`

        socket.emit("sendMessage", {
          roomId: id,
          message: {
            roomId: id,
            content: message,
            senderId: currentUser.id,
          }
        })

        // Also persist to database
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/messages`,
          { content: message },
          { withCredentials: true }
        )
      }
      setIsQRModalOpen(false)
      router.push(`/groups/${id}`)
    } catch (error) {
      console.error("Failed to record settlement:", error)
      alert("Failed to record settlement. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-4">
          <Link href={isGroup ? `/groups/${id}` : `/person/${id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Settle Up</h1>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Record a Payment</CardTitle>
            <CardDescription>Select a friend to settle your debts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {isGroup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Settling with</label>
                  <Select onValueChange={handleMemberSelect}>
                    <SelectTrigger className="h-12 bg-secondary/50 border-border focus:ring-primary">
                      <SelectValue placeholder="Select a friend" />
                    </SelectTrigger>
                    <SelectContent>
                      {members
                        .filter(m => m.user.id !== currentUser?.id)
                        .map(m => (
                          <SelectItem key={m.user.id} value={m.user.id}>
                            {m.user.name || m.user.username}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedMemberId && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border text-center space-y-1 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-muted-foreground">
                    {payer === "paying" ? "You owe" : "You are owed"}
                  </p>
                  <p className={`text-3xl font-bold ${payer === "paying" ? "text-red-500" : "text-green-500"}`}>
                    ${calculatedAmount.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    readOnly
                    className="pl-8 h-12 text-lg font-bold bg-secondary/50 border-border"
                    {...register("amount")}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Amount is auto-calculated based on your expenses.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                disabled={!selectedMemberId || calculatedAmount === 0 || payer === "receiving"}
              >
                {payer === "receiving" ? "Ask for Payment" : "Pay & Settle"}
              </Button>

              {payer === "receiving" && (
                <p className="text-xs text-yellow-500 text-center">
                  Note: You cannot record a payment from someone else. They must record it.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {receiverInfo && (
        <QRPaymentModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          amount={calculatedAmount}
          receiverName={receiverInfo.name}
          receiverUpiId={receiverInfo.upiId}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </main>
  )
}
