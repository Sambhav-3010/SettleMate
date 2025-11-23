"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import axios from "axios"

interface Balance {
    userId: string
    username: string
    net: number
}

interface BalancesProps {
    roomId: string
    refreshTrigger: number
}

export function Balances({ roomId, refreshTrigger }: BalancesProps) {
    const [balances, setBalances] = useState<Balance[]>([])

    useEffect(() => {
        if (roomId) {
            fetchBalances()
        }
    }, [roomId, refreshTrigger])

    const fetchBalances = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/expenses/balances`, {
                withCredentials: true,
            })
            setBalances(res.data.balances)
        } catch (err) {
            console.error("Failed to fetch balances", err)
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {balances.map((balance) => (
                <Card key={balance.userId} className="p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">{balance.username}</span>
                        <span
                            className={`font-bold ${balance.net > 0
                                    ? "text-green-600"
                                    : balance.net < 0
                                        ? "text-red-600"
                                        : "text-muted-foreground"
                                }`}
                        >
                            {balance.net > 0
                                ? `gets back $${balance.net.toFixed(2)}`
                                : balance.net < 0
                                    ? `owes $${Math.abs(balance.net).toFixed(2)}`
                                    : "settled up"}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    )
}
