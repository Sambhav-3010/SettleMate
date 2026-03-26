"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"
import axios from "axios"
import { Receipt, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface Expense {
  id: string
  amount: number
  description: string
  createdAt: string
  isSettlement: boolean
  confirmed: boolean
  receiverId: string | null
  payer: {
    id: string
    username: string
    name: string
  }
}

interface ExpenseListProps {
  roomId: string
  refreshTrigger: number
}

export function ExpenseList({ roomId, refreshTrigger }: ExpenseListProps) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (roomId) {
      fetchExpenses()
    }
  }, [roomId, refreshTrigger])

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses`, {
        withCredentials: true,
      })
      setExpenses(res.data.expenses)
    } catch (err) {
      console.error("Failed to fetch expenses", err)
    }
  }

  const handleConfirmSettlement = async (expenseId: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses/${expenseId}/confirm`, {}, { withCredentials: true })
      fetchExpenses()
    } catch (err) {
      console.error("Failed to confirm settlement", err)
      alert("Failed to confirm settlement. Please try again.")
    }
  }

  const handleRejectSettlement = async (expenseId: string) => {
    if (!confirm("Are you sure you want to reject this settlement? It will be removed.")) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses/${expenseId}/reject`, {
        withCredentials: true,
      })
      fetchExpenses()
    } catch (err) {
      console.error("Failed to reject settlement", err)
      alert("Failed to reject settlement. Please try again.")
    }
  }

  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.createdAt)
    const monthYear = format(date, "MMMM yyyy")
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(expense)
    return groups
  }, {} as Record<string, Expense[]>)

  return (
    <div className="space-y-7">
      {Object.keys(groupedExpenses).length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center opacity-60">
          <div className="border border-border p-3">
            <Receipt className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
        </div>
      )}

      {Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
        <div key={month} className="space-y-3">
          <h3 className="muted-label">{month}</h3>
          <div className="space-y-2">
            {monthExpenses.map((expense) => {
              const date = new Date(expense.createdAt)
              return (
                <Card key={expense.id} className="line-panel p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-content-center border border-border text-center">
                        <span className="text-[10px] uppercase text-muted-foreground">{format(date, "MMM")}</span>
                        <span className="text-lg font-semibold leading-none">{format(date, "dd")}</span>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="text-base font-semibold">{expense.description || "Untitled Expense"}</h4>
                          {expense.isSettlement && expense.confirmed && (
                            <span className="inline-flex items-center gap-1 border border-green-400/40 px-2 py-0.5 text-xs text-green-300">
                              <CheckCircle className="h-3 w-3" /> Confirmed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{expense.payer.name || expense.payer.username} paid</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold">₹{expense.amount.toFixed(2)}</span>

                      {expense.isSettlement && !expense.confirmed && expense.receiverId === user?.id && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleRejectSettlement(expense.id)}>
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleConfirmSettlement(expense.id)}>
                            Confirm
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
