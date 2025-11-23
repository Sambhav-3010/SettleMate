"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/contexts/authContext"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Users, TrendingUp, Bell, Plus, DollarSign, CheckCircle } from "lucide-react"

const checkDarkMode = () => {
  return document.documentElement.classList.contains("dark");
};

export default function LandingPage() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(checkDarkMode);

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const htmlElement = document.documentElement;
    const observer = new MutationObserver(() => {
      const newIsDark = htmlElement.classList.contains('dark');
      if (newIsDark !== isDark) {
        setIsDark(newIsDark);
      }
    });

    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });

    setIsDark(checkDarkMode());

    return () => observer.disconnect();
  }, [isDark]);

  const dotGridOpacity = isDark ? "0.50" : "1";

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <section className="relative px-4 py-32 md:py-48 border-b border-border min-h-[80vh] flex items-center justify-center">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(var(--primary-rgb,34,197,94),1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: dotGridOpacity,
            }}
          />

          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), rgba(var(--primary-rgb,34,197,94),0.35), transparent 100%)",
              '--mouse-x': `${mousePosition.x}px`,
              '--mouse-y': `${mousePosition.y}px`,
              opacity: "0.75",
              filter: "blur(40px)",
              mixBlendMode: 'screen',
            } as any}
          />

          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at center, rgba(var(--primary-rgb,34,197,94),0.25), transparent 70%)",
              filter: "blur(45px)",
              opacity: "0.45"
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            The Smartest Way to Split Expenses with Friends
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Easily track shared expenses, settle debts, and manage group spending with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            {user ? (
              <Link href="/dashboard">
                <Button className="w-full sm:w-auto" size="lg" variant="default">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button className="w-full sm:w-auto" size="lg" variant="default">
                    Get Started
                  </Button>
                </Link>
                <Button
                  onClick={scrollToHowItWorks}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-transparent"
                >
                  See How It Works
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Smart Settlements",
                description: "Automatically calculate who owes whom and settle multiple debts efficiently.",
              },
              {
                icon: TrendingUp,
                title: "Expense Analytics",
                description: "Track spending patterns and see detailed breakdowns of shared expenses.",
              },
              {
                icon: Bell,
                title: "Payment Reminders",
                description: "Get notified about pending payments and settle up quickly.",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-24 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Card className="md:col-span-2 p-8 border border-border bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-2xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-3">Create or Join a Group</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Set up a new expense group or join an existing one with friends. Perfect for roommates, trips, or any shared expenses.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Quick Setup
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Invite Friends
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300 flex flex-col justify-center">
              <Plus className="w-12 h-12 mb-4 text-primary" />
              <h3 className="font-bold text-xl mb-2">Add Expenses</h3>
              <p className="text-muted-foreground">Log shared expenses with custom split methods.</p>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300 flex flex-col justify-center">
              <DollarSign className="w-12 h-12 mb-4 text-primary" />
              <h3 className="font-bold text-xl mb-2">Track Balances</h3>
              <p className="text-muted-foreground">See who owes what in real-time.</p>
            </Card>

            <Card className="md:col-span-2 p-8 border border-border bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-2xl">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl mb-3">Settle Debts Instantly</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Settle up with friends directly through the app with just a few clicks. No more awkward money conversations.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
                      Fast Payments
                    </span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm">
                      UPI Integration
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Card className="md:col-span-2 p-8 border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <h3 className="font-bold text-xl mb-3">How does Splitter calculate who owes what?</h3>
              <p className="text-muted-foreground">
                Splitter uses smart algorithms to track all expenses and automatically calculate the optimal way to settle debts. It minimizes the number of transactions needed.
              </p>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2">Is it free to use?</h3>
              <p className="text-muted-foreground text-sm">Yes — unlimited access included.</p>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2">Can I use it offline?</h3>
              <p className="text-muted-foreground text-sm">You can still view expenses even without internet.</p>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2">How secure is my data?</h3>
              <p className="text-muted-foreground text-sm">Your financial data is encrypted and safe.</p>
            </Card>

            <Card className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <h3 className="font-bold text-lg mb-2">Can I export my expense history?</h3>
              <p className="text-muted-foreground text-sm">Yes, export options include CSV and PDF.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex",
                quote: "Finally, a simple way to track who owes what!",
              },
              {
                name: "Jordan",
                quote: "No more awkward conversations about splitting bills.",
              },
              {
                name: "Casey",
                quote: "Best app for group trips and shared living.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border border-border bg-card hover:border-primary/50 transition-all duration-300">
                <p className="mb-4 italic text-muted-foreground">{testimonial.quote}</p>
                <p className="font-bold">— {testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Simplify Expenses?</h2>
          <p className="text-lg text-muted-foreground mb-8">Start splitting expenses with your friends today.</p>
          <Link href="/auth">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}