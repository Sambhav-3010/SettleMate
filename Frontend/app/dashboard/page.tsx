"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const mockChartData = [
  { month: "Jan", amount: 450 },
  { month: "Feb", amount: 320 },
  { month: "Mar", amount: 680 },
  { month: "Apr", amount: 520 },
  { month: "May", amount: 750 },
  { month: "Jun", amount: 600 },
]

const mockGroupData = [
  { id: "1", name: "Weekend Trip", members: 4, balance: -250 },
  { id: "2", name: "Apartment", members: 3, balance: 150 },
  { id: "3", name: "Game Night", members: 5, balance: -75 },
]

const mockBalanceData = [
  { id: "1", name: "Jack", amount: 100 },
  { id: "2", name: "Sarah", amount: -50 },
  { id: "3", name: "Mike", amount: 75 },
]

const pieData = [
  { name: "Owed to you", value: 275 },
  { name: "You owe", value: 400 },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with CTA */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your shared expenses efficiently</p>
          </div>
          <Link href="/expenses/new">
            <Button size="lg" className="font-semibold">
              Add Expense
            </Button>
          </Link>
        </div>

        {/* Bento Grid - Row 1: Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Balance Card - Large */}
          <Card className="md:col-span-2 p-8 border border-border bg-card hover:border-foreground/20 transition-all duration-300">
            <p className="text-muted-foreground text-sm font-medium mb-4">Overall Balance</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-5xl font-bold mb-2">-$125.00</p>
                <p className="text-sm text-muted-foreground">You owe money to friends</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-secondary rounded-lg p-4">
                  <ResponsiveContainer width={150} height={120}>
                    <PieChart>
                      <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                        <Cell fill="var(--foreground)" />
                        <Cell fill="var(--muted)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-8 border border-border bg-card hover:border-foreground/20 transition-all duration-300">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">You Are Owed</p>
                <p className="text-3xl font-bold text-foreground">$275.00</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">You Owe</p>
                <p className="text-3xl font-bold text-foreground">$400.00</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bento Grid - Row 2: Charts and Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Spending Chart - Large */}
          <Card className="lg:col-span-2 p-8 border border-border bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Monthly Spending</h2>
                <p className="text-sm text-muted-foreground">Last 6 months overview</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockChartData}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Balance Details - Sidebar */}
          <Card className="p-8 border border-border bg-card">
            <h2 className="text-lg font-bold mb-6">Friend Balances</h2>
            <div className="space-y-4">
              {mockBalanceData.map((balance) => (
                <Link key={balance.id} href={`/person/${balance.id}`}>
                  <div className="p-4 rounded-lg hover:bg-secondary transition-colors cursor-pointer border border-transparent hover:border-border group">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm group-hover:text-foreground">{balance.name}</span>
                      <span
                        className={`font-bold text-sm ${balance.amount > 0 ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {balance.amount > 0 ? "+" : ""}
                        {balance.amount}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Bento Grid - Row 3: Groups */}
        <Card className="p-8 border border-border bg-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">My Groups</h2>
              <p className="text-sm text-muted-foreground mt-1">Chat with friends and split expenses</p>
            </div>
            <Link href="/contacts">
              <Button variant="outline" className="font-medium bg-transparent">
                Create Group
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockGroupData.map((group) => (
              <div key={group.id} className="group">
                <div className="p-6 rounded-lg border border-border bg-secondary hover:bg-muted transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg">{group.name}</h3>
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${group.balance > 0 ? "bg-background text-foreground" : "bg-foreground/10 text-foreground"}`}
                    >
                      {group.balance > 0 ? "+" : ""}
                      {group.balance}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{group.members} members</p>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                    <Link href={`/groups/${group.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View
                      </Button>
                    </Link>
                    <Link href={`/chat/room/${group.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions Footer */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/chat/history">
            <Button variant="outline" className="font-medium bg-transparent">
              View Chat History
            </Button>
          </Link>
          <Link href="/settle-up">
            <Button className="font-medium">Settle Up</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
