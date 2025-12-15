import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Modern AI-Powered GRC Platform for the Middle East
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Automate your Governance, Risk, and Compliance with advanced AI. 
          Tailored for Saudi Arabia, UAE, and Egypt regulations.
        </p>
        <div className="space-x-4">
          <Link href="/auth/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}