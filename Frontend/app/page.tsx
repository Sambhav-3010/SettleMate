"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32 border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-4xl md:text-5xl font-bold text-balance">
            The Smartest Way to Split Expenses with Friends
          </div>
          <p className="text-lg text-muted-foreground">
            Easily track shared expenses, settle debts, and manage group spending with zero friction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/sign-in">
              <Button className="w-full sm:w-auto" size="lg">
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Smart Settlements",
                description: "Automatically calculate who owes whom and settle multiple debts efficiently.",
              },
              {
                title: "Expense Analytics",
                description: "Track spending patterns and see detailed breakdowns of shared expenses.",
              },
              {
                title: "Payment Reminders",
                description: "Get notified about pending payments and settle up quickly.",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 border border-border bg-card">
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-24 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Create or Join a Group",
                description: "Set up a new expense group or join an existing one with friends.",
              },
              {
                step: "2",
                title: "Add Expenses",
                description: "Log shared expenses with custom split methods (equal, percentage, or exact amounts).",
              },
              {
                step: "3",
                title: "Settle Debts",
                description: "Settle up with friends directly through the app with just a few clicks.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-secondary text-card-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              <Card key={i} className="p-6 border border-border bg-card">
                <p className="mb-4 italic text-muted-foreground">{testimonial.quote}</p>
                <p className="font-bold">— {testimonial.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Simplify Expenses?</h2>
          <p className="text-lg text-muted-foreground mb-8">Start splitting expenses with your friends today.</p>
          <Link href="/sign-in">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
