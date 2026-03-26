"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"

const capabilityRows = [
  {
    title: "Interoperable Expense Rooms",
    body: "Create connected groups for trips, roommates, and teams while keeping balances transparent.",
    cta: "Explore Dashboard",
    href: "/dashboard",
    index: "[01]",
  },
  {
    title: "Live Chat + Settlements",
    body: "Discuss context, send updates, and settle instantly without leaving the room.",
    cta: "Open Chat History",
    href: "/chat/history",
    index: "[02]",
  },
  {
    title: "UPI-Ready Payments",
    body: "Generate QR-based pay flows and confirm settlements in one clean interaction.",
    cta: "Start Onboarding",
    href: "/onboarding",
    index: "[03]",
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen border-b border-border">
      <section className="section-wrap relative overflow-hidden border-x border-border py-20 md:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-28 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent grid-glow" />
        <div className="mx-auto max-w-5xl text-center">
          <p className="muted-label reveal-up">/// Expense Infrastructure</p>
          <h1 className="hero-title mt-6 reveal-up">Permissionless expense clarity</h1>
          <h2 className="hero-subtitle mt-1 reveal-up">for every shared life moment.</h2>
          <p className="mx-auto mt-8 max-w-2xl text-sm text-muted-foreground md:text-base reveal-up">
            SettleMate turns chaotic group spending into one deliberate workflow: add expenses, see balances, talk in-context, and settle quickly.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row reveal-up">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg">Go To Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button size="lg">Launch App</Button>
                </Link>
                <Link href="/onboarding">
                  <Button variant="outline" size="lg">
                    Setup Profile
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section-wrap border-x border-b border-border">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-10">
            <p className="muted-label">/// Products</p>
            <h3 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground md:text-6xl">
              Split faster,
              <br />
              settle cleaner,
              <br />
              <span className="text-muted-foreground">stay connected.</span>
            </h3>
          </div>
          <div>
            {capabilityRows.map((row) => (
              <article key={row.title} className="line-panel border-x-0 border-t-0 p-6 last:border-b-0 md:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-2xl font-semibold tracking-[-0.02em]">{row.title}</h4>
                    <p className="mt-3 max-w-lg text-muted-foreground">{row.body}</p>
                    <Link href={row.href} className="mt-6 inline-block">
                      <Button variant="outline">{row.cta}</Button>
                    </Link>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{row.index}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap border-x border-b border-border py-16">
        <h3 className="text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-6xl">
          FinTech, Banking,
          <span className="text-muted-foreground"> DeFi, and beyond.</span>
        </h3>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          <div className="line-panel p-6 md:min-h-[260px]">
            <p className="muted-label">Total Value Settled</p>
            <p className="mt-24 text-6xl font-semibold tracking-[-0.03em]">₹75B+</p>
          </div>
          <div className="line-panel p-6 md:min-h-[260px]">
            <p className="muted-label">Historical Volume</p>
            <p className="mt-24 text-6xl font-semibold tracking-[-0.03em]">₹200B+</p>
          </div>
          <div className="line-panel p-6 md:min-h-[260px]">
            <p className="muted-label">Groups Powered</p>
            <p className="mt-24 text-6xl font-semibold tracking-[-0.03em]">700+</p>
          </div>
        </div>
      </section>

      <section className="section-wrap border-x border-b border-border py-16">
        <h4 className="text-3xl font-semibold tracking-[-0.02em]">Trusted by modern teams</h4>
        <div className="mt-8 grid grid-cols-2 border border-border md:grid-cols-5">
          {[
            "PayPal",
            "Tether",
            "BitGo",
            "Paxos",
            "Google Cloud",
            "Wyoming Stable",
            "Kraken",
            "Ondo",
            "Sky",
            "Bridge",
          ].map((name) => (
            <div key={name} className="flex h-28 items-center justify-center border-b border-r border-border text-xl font-semibold text-muted-foreground">
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap border-x border-b border-border py-12">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="line-panel flex min-h-[270px] flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <h5 className="text-5xl font-semibold tracking-[-0.03em]">Connect to our team</h5>
              <span className="font-mono text-xs text-muted-foreground">[01]</span>
            </div>
            <Link href="/auth">
              <Button>Get Connected</Button>
            </Link>
          </div>
          <div className="line-panel flex min-h-[270px] flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <h5 className="text-5xl font-semibold tracking-[-0.03em]">Start building</h5>
              <span className="font-mono text-xs text-muted-foreground">[02]</span>
            </div>
            <Link href={user ? "/dashboard" : "/auth"}>
              <Button variant="outline">Go To App</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
