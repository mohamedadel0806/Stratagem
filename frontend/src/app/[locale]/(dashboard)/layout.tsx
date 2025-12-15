import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 md:grid-rows-[auto_1fr] lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <Sidebar className="py-6 pr-6 lg:py-8" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden p-4 md:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}