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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await apiClient.get("/users/me")
        setUser(userData)
        const expensesData = await apiClient.get("/users/me/expenses")
        setExpenses(Array.isArray(expensesData) ? expensesData : [])
      } catch (err) {
        console.error("Failed to fetch expenses:", err)
        setError("Failed to load expenses. Please try again.")
        setExpenses([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-slate-950 flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Topbar userName={user?.name} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-4xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">My Expenses</h1>
              <p className="text-sm sm:text-base text-slate-400">All your shared expenses</p>
            </div>

            {error && (
              <Card className="bg-red-950/50 border-red-500/30 p-4 mb-6">
                <p className="text-red-400 text-sm">{error}</p>
              </Card>
            )}

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
                    className="bg-gradient-to-r from-slate-900 to-emerald-950 border-emerald-500/20 hover:border-emerald-500/50 transition-all p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="p-2 sm:p-3 bg-emerald-500/20 rounded-xl flex-shrink-0">
                          <DollarSign className="text-emerald-400" size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-sm sm:text-base truncate">
                            {expense.description}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400 truncate">Paid by {expense.paidBy.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {expense.participants.length} participant{expense.participants.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl sm:text-2xl font-bold text-emerald-400">₹{expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-emerald-500/20 p-8 sm:p-12 text-center">
                <p className="text-slate-400 text-sm">No expenses yet</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
