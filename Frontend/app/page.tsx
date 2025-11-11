"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/users/me`, {
          credentials: "include",
        })
        if (response.ok) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }
    checkAuth()
  }, [router])

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/google`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col items-center justify-center px-4 sm:px-6">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-200 bg-clip-text text-transparent mb-3 sm:mb-4">
            Splitwise Clone
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300">
            Split expenses with friends seamlessly. Real-time chat, expense tracking, and smart settlements.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[
            { title: "Real-time Chat", desc: "Instant messaging" },
            { title: "Smart Splits", desc: "Easy expense sharing" },
            { title: "Settle Up", desc: "Quick settlements" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-4 sm:p-6 rounded-2xl bg-slate-900/40 border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-500/50 transition-all"
            >
              <h3 className="font-semibold text-emerald-300 mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-base sm:text-lg w-full sm:w-auto"
        >
          <Chrome className="mr-2" size={20} />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
