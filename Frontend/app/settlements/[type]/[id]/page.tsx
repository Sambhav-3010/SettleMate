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
import { ArrowLeft, Wallet } from "lucide-react"
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
  const { loading } = useAuthGuard()
  const { type, id } = use(params)
  const { register, handleSubmit, setValue } = useForm()
  const [payer, setPayer] = useState<"paying" | "receiving">("paying")
  const [members, setMembers] = useState<Member[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0)
  const router = useRouter()
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [receiverInfo, setReceiverInfo] = useState<{ name: string; upiId: string } | null>(null)

  const isGroup = type === "group"

  useEffect(() => {
    if (!loading) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.error("Failed to fetch current user", err))

      const endpoint = isGroup ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}` : `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`

      axios
        .get(endpoint, { withCredentials: true })
        .then((res) => {
          if (isGroup) {
            setMembers(res.data.members)
          } else {
            setMembers([{ user: res.data }])
          }
        })
        .catch((err) => console.error("Failed to fetch data", err))

      if (isGroup) {
        axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/expenses`, { withCredentials: true })
          .then((res) => setExpenses(res.data.expenses))
          .catch((err) => console.error("Failed to fetch expenses", err))
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

    let balance = 0

    expenses.forEach((exp) => {
      const isPayerMe = exp.payerId === currentUser.id
      const isPayerThem = exp.payerId === otherUserId

      if (isPayerMe) {
        const split = exp.splits.find((s) => s.userId === otherUserId)
        if (split) {
          balance += split.amount
        }
      } else if (isPayerThem) {
        const split = exp.splits.find((s) => s.userId === currentUser.id)
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

    if (balance > 0) {
      setPayer("receiving")
      setCalculatedAmount(balance)
      setValue("amount", balance.toFixed(2))
    } else if (balance < 0) {
      setPayer("paying")
      setCalculatedAmount(Math.abs(balance))
      setValue("amount", Math.abs(balance).toFixed(2))
    } else {
      setPayer("paying")
      setCalculatedAmount(0)
      setValue("amount", "0.00")
    }
  }

  const onSubmit = async (data: any) => {
    if (!selectedMemberId || !data.amount || parseFloat(data.amount) === 0) return

    if (payer === "receiving") {
      alert("You can only record payments you make. Please ask the other person to record this payment.")
      return
    }

    const selectedMember = members.find((m) => m.user.id === selectedMemberId)
    if (!selectedMember) return

    try {
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${selectedMemberId}`, { withCredentials: true })

      if (!userRes.data.upiId) {
        alert("The receiver hasn't set up their UPI ID yet. Please ask them to update their profile.")
        return
      }

      setReceiverInfo({
        name: selectedMember.user.name || selectedMember.user.username,
        upiId: userRes.data.upiId,
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
        splits: [{ userId: selectedMemberId, amount: calculatedAmount }],
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/expenses`, payload, {
        withCredentials: true,
      })

      const message = `${currentUser?.name || "Someone"} claims to have paid you ₹${calculatedAmount}. Please confirm if you received the payment.`
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}/messages`,
        { content: message },
        { withCredentials: true },
      )

      setIsQRModalOpen(false)
      router.push(`/groups/${id}`)
    } catch (error) {
      console.error("Failed to record settlement:", error)
      alert("Failed to record settlement. Please try again.")
    }
  }

  return (
    <main className="app-shell min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="line-panel flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <Link href={isGroup ? `/groups/${id}` : `/person/${id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <p className="muted-label">/// Settlement</p>
              <h1 className="text-3xl font-semibold tracking-[-0.02em]">Settle Up</h1>
            </div>
          </div>
        </section>

        <Card className="line-panel p-0">
          <CardHeader>
            <div className="mb-1 inline-flex h-12 w-12 items-center justify-center border border-border">
              <Wallet className="h-5 w-5" />
            </div>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>Select a friend to auto-calculate debt and continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {isGroup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Settling with</label>
                  <Select onValueChange={handleMemberSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a friend" />
                    </SelectTrigger>
                    <SelectContent>
                      {members
                        .filter((m) => m.user.id !== currentUser?.id)
                        .map((m) => (
                          <SelectItem key={m.user.id} value={m.user.id}>
                            {m.user.name || m.user.username}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedMemberId && (
                <div className="border border-border p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {payer === "paying" ? "You owe" : "You are owed"}
                  </p>
                  <p className={`mt-2 text-5xl font-semibold tracking-[-0.03em] ${payer === "paying" ? "text-red-400" : "text-green-400"}`}>
                    ₹{calculatedAmount.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" step="0.01" readOnly className="text-lg font-semibold" {...register("amount")} />
                <p className="text-xs text-muted-foreground">Amount is auto-calculated from expenses.</p>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedMemberId || calculatedAmount === 0 || payer === "receiving"}>
                {payer === "receiving" ? "Ask For Payment" : "Pay & Settle"}
              </Button>

              {payer === "receiving" && (
                <p className="text-xs text-yellow-300">You cannot record incoming payments. Ask the other person to record it.</p>
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
