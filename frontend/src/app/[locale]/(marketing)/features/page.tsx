import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Features | GRC Platform",
  description: "Explore the powerful features of our AI-Powered GRC Platform.",
}

export default function FeaturesPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Our platform provides comprehensive tools for Governance, Risk, and Compliance.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-10">
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Policy Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, review, and distribute policies across your organization with ease.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Identify, assess, and mitigate risks with our advanced risk management tools.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Stay compliant with regional and international regulations using our automated tracking.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">AI Insights</h3>
              <p className="text-sm text-muted-foreground">
                Leverage AI to get actionable insights and predictive analytics for better decision making.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Audit Management</h3>
              <p className="text-sm text-muted-foreground">
                Streamline your audit processes and ensure you are always audit-ready.
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <div className="space-y-2">
              <h3 className="font-bold">Reporting & Dashboards</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your GRC data with customizable dashboards and comprehensive reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}