import { useState } from "react"
import { getLocalTimeZone, type CalendarDate } from "@internationalized/date"
import { CalendarIcon, Plus } from "lucide-react"

import DotGrid from "@/assets/DotGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

const frequencyItems = [
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
  { label: "Semiannually", value: "Semiannually"},
  { label: "Yearly", value: "Yearly" },
]

const statusItems = [
  { label: "Upcoming", value: "Upcoming" },
  { label: "Due this week", value: "Due this week"},
  { label: "Due this month", value: "Due this month"},
  { label: "Overdue", value: "Overdue" },
  { label: "Completed", value: "Completed" },
]

interface maintenanceEntryType {
  id: string
  property: string
  client: string
  type: string
  lastService: string
  frequency: string
  nextDue: string
  assigned: string
  status: string
  notes: string
}

const placeholderEntries: maintenanceEntryType[] = [
  {
    id: "1",
    property: "Riverside Apartments",
    client: "Acme Property Group",
    type: "HVAC Servicing",
    lastService: "2026-05-12",
    nextDue: "2026-08-12",
    frequency: "Quarterly",
    assigned: "Cillian",
    status: "Upcoming",
    notes: "Check filters and coolant levels",
  },
]

export function MaintenanceSchedule() {
  const [property, setProperty] = useState("")
  const [client, setClient] = useState("")
  const [maintenanceType, setMaintenanceType] = useState("")
  const [frequency, setFrequency] = useState("Monthly")
  const [nextDue, setNextDue] = useState<CalendarDate | null>(null)
  const [assigned, setAssigned] = useState("")
  const [status, setStatus] = useState("Upcoming")
  const [notes, setNotes] = useState("")
  const [maintenanceEntries] = useState<maintenanceEntryType[]>(placeholderEntries)

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full inset-0 absolute -z-50">
        <DotGrid
          baseColor="#1b3038"
          activeColor="#00f0ff"
          dotSize={5}
          gap={15}
          resistance={2000}
          returnDuration={1}
          shockStrength={1}
          proximity={50}
        />
      </div>
      <SidebarProvider>
        <AppSidebar></AppSidebar>
        <SidebarTrigger></SidebarTrigger>
        <SidebarInset className="bg-transparent">
          <div className="w-full h-full py-6 pr-6">
            <BentoGrid className="mx-0 max-w-none md:auto-rows-min">
              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Maintenance
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Add Maintenance Job
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Property/Site</label>
                    <Input
                      placeholder="Property/Site"
                      value={property}
                      onChange={(e) => setProperty(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Client</label>
                    <Input
                      placeholder="Client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Maintenance Type</label>
                    <Input
                      placeholder="Maintenance Type"
                      value={maintenanceType}
                      onChange={(e) => setMaintenanceType(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Frequency</label>
                    <Select
                      placeholder="Frequency"
                      value={frequency}
                      onChange={(frequency) => setFrequency(frequency!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {frequencyItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Next Due Date</label>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        data-empty={!nextDue}
                        className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {nextDue ? (
                          nextDue
                            .toDate(getLocalTimeZone())
                            .toLocaleDateString(undefined, { dateStyle: "long" })
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      <Popover className="w-auto p-0">
                        <Calendar value={nextDue} onChange={setNextDue} />
                      </Popover>
                    </PopoverTrigger>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Assigned To</label>
                    <Input
                      placeholder="Assigned To"
                      value={assigned}
                      onChange={(e) => setAssigned(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Status</label>
                    <Select
                      placeholder="Status"
                      value={status}
                      onChange={(status) => setStatus(status!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statusItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Notes</label>
                  <Textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                  <Plus className="size-4" />
                  Add Maintenance
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Schedule
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Maintenance Register
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-35">
                      Property
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead>Freq</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeader>
                  <TableBody>
                    {maintenanceEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.property}</TableCell>
                        <TableCell>{entry.client}</TableCell>
                        <TableCell>{entry.type}</TableCell>
                        <TableCell>{entry.lastService}</TableCell>
                        <TableCell>{entry.frequency}</TableCell>
                        <TableCell>{entry.nextDue}</TableCell>
                        <TableCell>{entry.assigned}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                        <TableCell>{entry.notes}</TableCell>
                        <TableCell>
                          <Button variant={"destructive"}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableCaption>A list of your recent maintenance jobs.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
