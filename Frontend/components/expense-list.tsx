"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"
import axios from "axios"
import { Receipt, Calendar, CheckCircle } from "lucide-react"
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
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses/${expenseId}/confirm`,
                {},
                { withCredentials: true }
            )
            // Refresh the expenses list
            fetchExpenses()
        } catch (err) {
            console.error("Failed to confirm settlement", err)
            alert("Failed to confirm settlement. Please try again.")
        }
    }

    const handleRejectSettlement = async (expenseId: string) => {
        if (!confirm("Are you sure you want to reject this settlement? It will be removed.")) return

        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses/${expenseId}/reject`,
                { withCredentials: true }
            )
            // Refresh the expenses list
            fetchExpenses()
        } catch (err) {
            console.error("Failed to reject settlement", err)
            alert("Failed to reject settlement. Please try again.")
        }
    }

    // Group expenses by month
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
        <div className="space-y-8">
            {Object.keys(groupedExpenses).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                    <div className="bg-secondary p-4 rounded-full">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <p className="text-muted-foreground">No expenses recorded yet.</p>
                </div>
            )}

            {Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
                <div key={month} className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                        {month}
                    </h3>
                    <div className="space-y-3">
                        {monthExpenses.map((expense) => {
                            const date = new Date(expense.createdAt)
                            return (
                                <Card key={expense.id} className="group hover:border-primary/50 transition-all duration-200 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                                    <div className="flex items-center p-4 gap-4">
                                        {/* Date Box */}
                                        <div className="flex flex-col items-center justify-center w-12 h-14 bg-secondary/50 rounded-md border border-border/50 shrink-0">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">
                                                {format(date, "MMM")}
                                            </span>
                                            <span className="text-xl font-bold leading-none">
                                                {format(date, "dd")}
                                            </span>
                                        </div>

                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                            <Receipt className="w-5 h-5" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-base truncate">
                                                    {expense.description || "Untitled Expense"}
                                                </h4>
                                                {expense.isSettlement && expense.confirmed && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium shrink-0">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Confirmed
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground/80">
                                                    {expense.payer.name || expense.payer.username}
                                                </span>
                                                <span>paid</span>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="text-right shrink-0">
                                            <span className="block text-lg font-bold tracking-tight">
                                                ₹{expense.amount.toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Confirmation Button for Settlements */}
                                        {expense.isSettlement && !expense.confirmed && expense.receiverId === user?.id && (
                                            <div className="flex gap-2 shrink-0">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRejectSettlement(expense.id)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleConfirmSettlement(expense.id)}
                                                >
                                                    Confirm Payment
                                                </Button>
                                            </div>
                                        )}
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
