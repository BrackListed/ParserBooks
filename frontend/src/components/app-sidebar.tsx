import {
  BookOpen,
  UserRound,
  Home as HomeIcon,
  ClipboardList,
  CalendarDays,
  CheckCircle2,
  Wrench,
  FileText,
  FileSearch,
  Mail,
  FilePlus2,
  Receipt,
  Wallet,
  CreditCard,
  FileSpreadsheet,
  Banknote,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

function SidebarMinimizeButton() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="rounded-md border border-sidebar-border px-2 py-1 text-xs font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {state === "expanded" ? "MIN" : "EXP"}
    </button>
  )
}

export function AppSidebar() {
  const isHomeActive = typeof window !== "undefined" && window.location.pathname === "/"
  const isCalendarActive = typeof window !== "undefined" && window.location.pathname === "/work-calendar"
  const isMaintenanceScheduleActive = typeof window !== "undefined" && window.location.pathname === "/maintenance-schedule"
  return (
    <Sidebar>
      <SidebarHeader className="gap-3 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-sidebar-foreground" />
            <span className="text-base font-semibold text-sidebar-foreground">
              ParserBooks
            </span>
          </div>
          <SidebarMinimizeButton />
        </div>
        <div className="flex items-center gap-2 px-0.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
            <UserRound className="size-4 text-sidebar-accent-foreground" />
          </div>
          <span className="truncate text-xs text-sidebar-foreground/70">
            Bracklisted &nbsp;|&nbsp; Role: User
          </span>
        </div>
      </SidebarHeader>
      <Separator className="bg-sidebar-border" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={isHomeActive}>
                <HomeIcon />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider">
            Projects
          </SidebarGroupLabel>
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <ClipboardList />
                Project Summary
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/work-calendar" isActive={isCalendarActive}>
                <CalendarDays />
                Work Calendar
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CheckCircle2 />
                Completed Jobs
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href = "/maintenance-schedule" isActive={isMaintenanceScheduleActive}>
                <Wrench />
                Maintenance Schedule
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider">
            Sales
          </SidebarGroupLabel>
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                Quotations
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileSearch />
                Request for Quotation (RFQ)
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Mail />
                Gmail Inbox
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FilePlus2 />
                Invoice Builder
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Receipt />
                Customer Invoices
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider">
            Purchases
          </SidebarGroupLabel>
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Wallet />
                Accounts Payable
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CreditCard />
                Expenses
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileSpreadsheet />
                Import Costs from Excel
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="uppercase tracking-wider">
            Finance
          </SidebarGroupLabel>
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Banknote />
                Payroll
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
