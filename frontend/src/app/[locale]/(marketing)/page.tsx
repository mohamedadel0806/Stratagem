import { Metadata } from "next"
import { HeroSection } from "@/components/marketing/hero-section"

export const metadata: Metadata = {
  title: "GRC Platform | Modern Governance, Risk & Compliance",
  description: "AI-Powered Governance, Risk, and Compliance platform for the Middle East.",
}

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        {/* Add more sections here */}
      </main>
    </div>
  )
}