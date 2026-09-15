import { useState } from "react"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import { CalendarIcon, Upload, Download, Save } from "lucide-react"

import DotGrid from "@/assets/DotGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type Employee = "Steven" | "Smith" | "Alexander"

interface EmployeeSettings {
  normalRate: number
  otRate: number
  paygPercent: number
  superPercent: number
}

interface DayEntry {
  timeIn: string
  timeOut: string
  description: string
}

interface PayrollHistoryEntry {
  weekStart: string
  weekEnd: string
  regularHours: number
  otHours: number
  gross: number
  payg: number
  super: number
  net: number
}

function getMondayOfWeek(date: CalendarDate): CalendarDate {
  const dow = date.toDate(getLocalTimeZone()).getDay()
  const offset = dow === 0 ? -6 : 1 - dow
  return date.add({ days: offset })
}

function hoursBetween(timeIn: string, timeOut: string): number {
  if (!timeIn || !timeOut) return 0
  const [inH, inM] = timeIn.split(":").map(Number)
  const [outH, outM] = timeOut.split(":").map(Number)
  const diff = outH * 60 + outM - (inH * 60 + inM)
  return diff > 0 ? diff / 60 : 0
}

export function Payroll() {
  const [employee, setEmployee] = useState<Employee>("Steven")
  const [settings, setSettings] = useState<Record<Employee, EmployeeSettings>>({
    Steven: { normalRate: 25.99, otRate: 38.98, paygPercent: 19, superPercent: 11 },
    Smith: { normalRate: 28.5, otRate: 42.75, paygPercent: 21, superPercent: 11 },
    Alexander: { normalRate: 24.0, otRate: 36.0, paygPercent: 17, superPercent: 11 },
  })

  const [weekStart, setWeekStart] = useState<CalendarDate>(getMondayOfWeek(today(getLocalTimeZone())))
  const weekEnd = weekStart.add({ days: 6 })

  const [monday, setMonday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [tuesday, setTuesday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [wednesday, setWednesday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [thursday, setThursday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [friday, setFriday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [saturday, setSaturday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })
  const [sunday, setSunday] = useState<DayEntry>({ timeIn: "", timeOut: "", description: "Work" })

  const [payrollHistory, setPayrollHistory] = useState<PayrollHistoryEntry[]>([])

  const currentSettings = settings[employee]

  const days = [
    { label: "Monday", offset: 0, entry: monday, setEntry: setMonday },
    { label: "Tuesday", offset: 1, entry: tuesday, setEntry: setTuesday },
    { label: "Wednesday", offset: 2, entry: wednesday, setEntry: setWednesday },
    { label: "Thursday", offset: 3, entry: thursday, setEntry: setThursday },
    { label: "Friday", offset: 4, entry: friday, setEntry: setFriday },
    { label: "Saturday", offset: 5, entry: saturday, setEntry: setSaturday },
    { label: "Sunday", offset: 6, entry: sunday, setEntry: setSunday },
  ]

  let totalRegularHours = 0
  let totalOtHours = 0
  for (const day of days) {
    const worked = hoursBetween(day.entry.timeIn, day.entry.timeOut)
    totalRegularHours += Math.min(worked, 8)
    totalOtHours += Math.max(worked - 8, 0)
  }

  const grossWages = totalRegularHours * currentSettings.normalRate + totalOtHours * currentSettings.otRate
  const paygWithheld = grossWages * (currentSettings.paygPercent / 100)
  const superAmount = grossWages * (currentSettings.superPercent / 100)
  const netEstimate = grossWages - paygWithheld

  function updateSetting(field: keyof EmployeeSettings, value: number) {
    setSettings((prev) => ({ ...prev, [employee]: { ...prev[employee], [field]: value } }))
  }

  function saveWholeWeek() {
    setPayrollHistory((prev) => [
      {
        weekStart: weekStart.toString(),
        weekEnd: weekEnd.toString(),
        regularHours: totalRegularHours,
        otHours: totalOtHours,
        gross: grossWages,
        payg: paygWithheld,
        super: superAmount,
        net: netEstimate,
      },
      ...prev,
    ])
  }

  return (
    <div className="relative w-screen min-h-screen">
      <div className="absolute inset-0 -z-50">
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
              <BentoGridItem className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Payroll
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Employee Settings
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Employee</label>
                  <Select
                    placeholder="Select employee"
                    value={employee}
                    onChange={(value) => setEmployee(value!.toString() as Employee)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem id="Steven">Steven</SelectItem>
                        <SelectItem id="Smith">Smith</SelectItem>
                        <SelectItem id="Alexander">Alexander</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Normal Rate $/hr</label>
                    <Input
                      type="number"
                      value={currentSettings.normalRate}
                      onChange={(e) => updateSetting("normalRate", Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">OT Rate $/hr</label>
                    <Input
                      type="number"
                      value={currentSettings.otRate}
                      onChange={(e) => updateSetting("otRate", Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">PAYG %</label>
                    <Input
                      type="number"
                      value={currentSettings.paygPercent}
                      onChange={(e) => updateSetting("paygPercent", Number(e.target.value))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Super %</label>
                    <Input
                      type="number"
                      value={currentSettings.superPercent}
                      onChange={(e) => updateSetting("superPercent", Number(e.target.value))}
                    />
                  </div>
                </div>

                <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                  <Save className="size-4" />
                  Save Settings
                </Button>
                <p className="text-xs text-neutral-500">
                  ATO payroll — PAYG &amp; Super only, no GST.
                </p>
              </BentoGridItem>

              <BentoGridItem className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Schedule
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Week Filter
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Week Start</label>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon />
                      {weekStart.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </Button>
                    <Popover className="w-auto p-0">
                      <Calendar
                        value={weekStart}
                        onChange={(value) => value && setWeekStart(getMondayOfWeek(value))}
                      />
                    </Popover>
                  </PopoverTrigger>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Week End</label>
                  <Input
                    disabled
                    value={weekEnd.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { dateStyle: "long" })}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={saveWholeWeek}
                    className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <Save className="size-4" />
                    Save Whole Week
                  </Button>
                  <Button className="w-fit rounded-full bg-blue-600 text-white hover:bg-blue-500">
                    <Upload className="size-4" />
                    Import Excel
                  </Button>
                  <Button className="w-fit rounded-full bg-orange-600 text-white hover:bg-orange-500">
                    <Download className="size-4" />
                    Export Excel
                  </Button>
                </div>
                <p className="text-xs text-neutral-500">
                  Excel import/export coming soon.
                </p>
              </BentoGridItem>

              <BentoGridItem className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Summary
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Weekly Summary
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="space-y-2">
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Total Normal Hours</p>
                    <p className="text-lg font-semibold text-neutral-100">{totalRegularHours.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Total OT Hours</p>
                    <p className="text-lg font-semibold text-neutral-100">{totalOtHours.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Gross Wages</p>
                    <p className="text-lg font-semibold text-neutral-100">${grossWages.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">PAYG Withheld</p>
                    <p className="text-lg font-semibold text-neutral-100">${paygWithheld.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Super</p>
                    <p className="text-lg font-semibold text-neutral-100">${superAmount.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Net Estimate</p>
                    <p className="text-lg font-semibold text-emerald-400">${netEstimate.toFixed(2)}</p>
                  </div>
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Timesheet
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Daily Timesheet (Monday–Sunday)
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-28">
                      Date
                    </TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Regular Hours</TableHead>
                    <TableHead>Overtime Hours</TableHead>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 0 }).toString()}</TableCell>
                      <TableCell>Monday</TableCell>
                      <TableCell>
                        <Input value={monday.description} onChange={(e) => setMonday({ ...monday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={monday.timeIn} onChange={(e) => setMonday({ ...monday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={monday.timeOut} onChange={(e) => setMonday({ ...monday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(monday.timeIn, monday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(monday.timeIn, monday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(monday.timeIn, monday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 1 }).toString()}</TableCell>
                      <TableCell>Tuesday</TableCell>
                      <TableCell>
                        <Input value={tuesday.description} onChange={(e) => setTuesday({ ...tuesday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={tuesday.timeIn} onChange={(e) => setTuesday({ ...tuesday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={tuesday.timeOut} onChange={(e) => setTuesday({ ...tuesday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(tuesday.timeIn, tuesday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(tuesday.timeIn, tuesday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(tuesday.timeIn, tuesday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 2 }).toString()}</TableCell>
                      <TableCell>Wednesday</TableCell>
                      <TableCell>
                        <Input value={wednesday.description} onChange={(e) => setWednesday({ ...wednesday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={wednesday.timeIn} onChange={(e) => setWednesday({ ...wednesday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={wednesday.timeOut} onChange={(e) => setWednesday({ ...wednesday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(wednesday.timeIn, wednesday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(wednesday.timeIn, wednesday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(wednesday.timeIn, wednesday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 3 }).toString()}</TableCell>
                      <TableCell>Thursday</TableCell>
                      <TableCell>
                        <Input value={thursday.description} onChange={(e) => setThursday({ ...thursday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={thursday.timeIn} onChange={(e) => setThursday({ ...thursday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={thursday.timeOut} onChange={(e) => setThursday({ ...thursday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(thursday.timeIn, thursday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(thursday.timeIn, thursday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(thursday.timeIn, thursday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 4 }).toString()}</TableCell>
                      <TableCell>Friday</TableCell>
                      <TableCell>
                        <Input value={friday.description} onChange={(e) => setFriday({ ...friday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={friday.timeIn} onChange={(e) => setFriday({ ...friday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={friday.timeOut} onChange={(e) => setFriday({ ...friday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(friday.timeIn, friday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(friday.timeIn, friday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(friday.timeIn, friday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 5 }).toString()}</TableCell>
                      <TableCell>Saturday</TableCell>
                      <TableCell>
                        <Input value={saturday.description} onChange={(e) => setSaturday({ ...saturday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={saturday.timeIn} onChange={(e) => setSaturday({ ...saturday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={saturday.timeOut} onChange={(e) => setSaturday({ ...saturday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(saturday.timeIn, saturday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(saturday.timeIn, saturday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(saturday.timeIn, saturday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{weekStart.add({ days: 6 }).toString()}</TableCell>
                      <TableCell>Sunday</TableCell>
                      <TableCell>
                        <Input value={sunday.description} onChange={(e) => setSunday({ ...sunday, description: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={sunday.timeIn} onChange={(e) => setSunday({ ...sunday, timeIn: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={sunday.timeOut} onChange={(e) => setSunday({ ...sunday, timeOut: e.target.value })} />
                      </TableCell>
                      <TableCell>{hoursBetween(sunday.timeIn, sunday.timeOut).toFixed(2)}</TableCell>
                      <TableCell>{Math.min(hoursBetween(sunday.timeIn, sunday.timeOut), 8).toFixed(2)}</TableCell>
                      <TableCell>{Math.max(hoursBetween(sunday.timeIn, sunday.timeOut) - 8, 0).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <TableCaption>Timesheet for {employee}, week of {weekStart.toString()}.</TableCaption>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Archive
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Payroll History
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-28">
                      Week Start
                    </TableHead>
                    <TableHead>Week End</TableHead>
                    <TableHead>Regular Hrs</TableHead>
                    <TableHead>OT Hrs</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>PAYG</TableHead>
                    <TableHead>Super</TableHead>
                    <TableHead>Net</TableHead>
                  </TableHeader>
                  <TableBody>
                    {payrollHistory.map((entry) => (
                      <TableRow key={entry.weekStart}>
                        <TableCell className="font-medium">{entry.weekStart}</TableCell>
                        <TableCell>{entry.weekEnd}</TableCell>
                        <TableCell>{entry.regularHours.toFixed(2)}</TableCell>
                        <TableCell>{entry.otHours.toFixed(2)}</TableCell>
                        <TableCell>${entry.gross.toFixed(2)}</TableCell>
                        <TableCell>${entry.payg.toFixed(2)}</TableCell>
                        <TableCell>${entry.super.toFixed(2)}</TableCell>
                        <TableCell>${entry.net.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableCaption>A list of your saved payroll weeks.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
