"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils/helpers"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  CheckCircle,
  Settings,
  Bot,
  Workflow,
  Server,
  Database,
  Monitor,
  Package,
  Building2,
  ChevronDown,
  BarChart3,
  ClipboardCheck,
  History,
  ListChecks,
  Activity,
  Shield,
  Users,
  FileCheck,
  AlertTriangle,
  Gavel,
  Target,
  Mail,
  ShieldCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string || 'en'

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Overview
          </h2>
          <div className="space-y-1">
            <Link href={`/${locale}/dashboard`}>
              <Button variant={pathname?.endsWith("/dashboard") ? "secondary" : "ghost"} className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href={`/${locale}/dashboard/policies`}>
              <Button variant={pathname?.includes("/dashboard/policies") ? "secondary" : "ghost"} className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Policies
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={pathname?.includes("/dashboard/risks") ? "secondary" : "ghost"} className="w-full justify-between">
                  <div className="flex items-center">
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Risks
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link href={`/${locale}/dashboard/risks`}>
                  <DropdownMenuItem className={pathname?.endsWith("/risks") && !pathname?.includes("/risks/") ? "bg-accent" : ""}>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Risk Register
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/risks/overview`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/overview") ? "bg-accent" : ""}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/risks/treatments`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/treatments") ? "bg-accent" : ""}>
                    <Target className="mr-2 h-4 w-4" />
                    Treatments
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/risks/kris`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/kris") ? "bg-accent" : ""}>
                    <Activity className="mr-2 h-4 w-4" />
                    KRIs
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/risks/assessment-requests`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/assessment-requests") ? "bg-accent" : ""}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Assessment Requests
                  </DropdownMenuItem>
                </Link>
                <div className="my-1 border-t" />
                <Link href={`/${locale}/dashboard/risks/categories`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/categories") ? "bg-accent" : ""}>
                    <Shield className="mr-2 h-4 w-4" />
                    Categories
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/risks/settings`}>
                  <DropdownMenuItem className={pathname?.includes("/risks/settings") ? "bg-accent" : ""}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={pathname?.includes("/dashboard/compliance") ? "secondary" : "ghost"} className="w-full justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Compliance
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link href={`/${locale}/dashboard/compliance`}>
                  <DropdownMenuItem className={pathname?.endsWith("/compliance") ? "bg-accent" : ""}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Overview
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/compliance/rules`}>
                  <DropdownMenuItem className={pathname?.includes("/compliance/rules") ? "bg-accent" : ""}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Validation Rules
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
             <Link href={`/${locale}/dashboard/ai-insights`}>
              <Button variant={pathname?.includes("/dashboard/ai-insights") ? "secondary" : "ghost"} className="w-full justify-start">
                <Bot className="mr-2 h-4 w-4" />
                AI Insights
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={pathname?.includes("/dashboard/workflows") ? "secondary" : "ghost"} className="w-full justify-between">
                  <div className="flex items-center">
                    <Workflow className="mr-2 h-4 w-4" />
                    Workflows
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link href={`/${locale}/dashboard/workflows`}>
                  <DropdownMenuItem className={pathname?.endsWith("/workflows") ? "bg-accent" : ""}>
                    <ListChecks className="mr-2 h-4 w-4" />
                    My Workflows
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/workflows/approvals`}>
                  <DropdownMenuItem className={pathname?.includes("/workflows/approvals") ? "bg-accent" : ""}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Pending Approvals
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/workflows/history`}>
                  <DropdownMenuItem className={pathname?.includes("/workflows/history") ? "bg-accent" : ""}>
                    <History className="mr-2 h-4 w-4" />
                    Execution History
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={pathname?.includes("/dashboard/assets") ? "secondary" : "ghost"} className="w-full justify-between">
                  <div className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    Assets
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link href={`/${locale}/dashboard/assets/all`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/all") ? "bg-accent" : ""}>
                    <Server className="mr-2 h-4 w-4" />
                    All Assets
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/physical`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/physical") ? "bg-accent" : ""}>
                    <Server className="mr-2 h-4 w-4" />
                    Physical Assets
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/information`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/information") ? "bg-accent" : ""}>
                    <Database className="mr-2 h-4 w-4" />
                    Information Assets
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/applications`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/applications") ? "bg-accent" : ""}>
                    <Monitor className="mr-2 h-4 w-4" />
                    Business Applications
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/software`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/software") ? "bg-accent" : ""}>
                    <Package className="mr-2 h-4 w-4" />
                    Software Assets
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/suppliers`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/suppliers") ? "bg-accent" : ""}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Suppliers
                  </DropdownMenuItem>
                </Link>
                <div className="my-1 border-t" />
                <Link href={`/${locale}/dashboard/assets/compliance`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/compliance") ? "bg-accent" : ""}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Compliance
                  </DropdownMenuItem>
                </Link>
            <Link href={`/${locale}/dashboard/assets/field-config`}>
              <DropdownMenuItem className={pathname?.includes("/assets/field-config") ? "bg-accent" : ""}>
                <ListChecks className="mr-2 h-4 w-4" />
                Field Configuration
              </DropdownMenuItem>
            </Link>
                <Link href={`/${locale}/dashboard/assets/reports`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/reports") ? "bg-accent" : ""}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Reports
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/email-distribution-lists`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/email-distribution-lists") ? "bg-accent" : ""}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Distribution Lists
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/assets/validation-rules`}>
                  <DropdownMenuItem className={pathname?.includes("/assets/validation-rules") ? "bg-accent" : ""}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Validation Rules
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={pathname?.includes("/dashboard/governance") ? "secondary" : "ghost"} className="w-full justify-between">
                  <div className="flex items-center">
                    <Gavel className="mr-2 h-4 w-4" />
                    Governance
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link href={`/${locale}/dashboard/governance`}>
                  <DropdownMenuItem className={pathname?.endsWith("/governance") ? "bg-accent" : ""}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <div className="my-1 border-t" />
                <Link href={`/${locale}/dashboard/governance/influencers`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/influencers") ? "bg-accent" : ""}>
                    <Users className="mr-2 h-4 w-4" />
                    Influencers
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/governance/policies`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/policies") ? "bg-accent" : ""}>
                    <FileText className="mr-2 h-4 w-4" />
                    Policies
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/governance/controls`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/controls") ? "bg-accent" : ""}>
                    <Shield className="mr-2 h-4 w-4" />
                    Controls
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/governance/assessments`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/assessments") ? "bg-accent" : ""}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Assessments
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/governance/evidence`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/evidence") ? "bg-accent" : ""}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Evidence
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${locale}/dashboard/governance/findings`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/findings") ? "bg-accent" : ""}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Findings
                  </DropdownMenuItem>
                </Link>
                <div className="my-1 border-t" />
                <Link href={`/${locale}/dashboard/governance/reports`}>
                  <DropdownMenuItem className={pathname?.includes("/governance/reports") ? "bg-accent" : ""}>
                    <FileText className="mr-2 h-4 w-4" />
                    Reports
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Link href={`/${locale}/settings`}>
              <Button variant={pathname?.includes("/settings") ? "secondary" : "ghost"} className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}