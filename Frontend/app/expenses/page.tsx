"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Card } from "@/components/ui/card"
import type { Expense, User } from "@/lib/types"
import { apiClient } from "@/lib/api"
import { DollarSign } from "lucide-react"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        const expensesData = await apiClient.get("/users/me/expenses")
        setExpenses(expensesData)
      } catch (error) {
        console.error("Failed to fetch expenses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">My Expenses</h1>
              <p className="text-slate-400">All your shared expenses</p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : expenses.length > 0 ? (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <Card
                    key={expense.id}
                    className="bg-gradient-to-r from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 transition-all p-6"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                          <DollarSign className="text-emerald-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{expense.description}</p>
                          <p className="text-sm text-slate-400">
                            Paid by {expense.paidBy.name} in {expense.roomId}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {expense.participants.length} participant{expense.participants.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">₹{expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-12 text-center">
                <p className="text-slate-400">No expenses yet</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
