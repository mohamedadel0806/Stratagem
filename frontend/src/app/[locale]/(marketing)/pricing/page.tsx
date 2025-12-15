import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing | GRC Platform",
  description: "Simple and transparent pricing for teams of all sizes.",
}

export default function PricingPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Pricing
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Choose the plan that's right for your organization.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3 mt-10">
        <div className="flex flex-col overflow-hidden rounded-lg border bg-background">
          <div className="p-6">
            <h3 className="text-xl font-bold">Starter</h3>
            <p className="text-sm text-muted-foreground">
              For small teams just getting started.
            </p>
            <div className="my-4 flex items-baseline text-3xl font-bold">
              $49
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> 5 Users
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Basic Policy Management
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Standard Reports
              </li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col justify-end p-6">
            <Link href="/auth/register">
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border bg-background shadow-lg">
          <div className="p-6">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-sm text-muted-foreground">
              For growing organizations with compliance needs.
            </p>
            <div className="my-4 flex items-baseline text-3xl font-bold">
              $199
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> 20 Users
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Advanced Risk Management
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Custom Compliance Frameworks
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> AI Insights (Basic)
              </li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col justify-end p-6">
            <Link href="/auth/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden rounded-lg border bg-background">
          <div className="p-6">
            <h3 className="text-xl font-bold">Enterprise</h3>
            <p className="text-sm text-muted-foreground">
              For large enterprises with complex requirements.
            </p>
            <div className="my-4 flex items-baseline text-3xl font-bold">
              Custom
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Unlimited Users
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Full GRC Suite
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Advanced AI Features
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4" /> Dedicated Support
              </li>
            </ul>
          </div>
          <div className="flex flex-1 flex-col justify-end p-6">
            <Link href="/contact">
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}