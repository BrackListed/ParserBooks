import { useEffect, useState } from "react"
import { Save, Upload, Download, DollarSign } from "lucide-react"

import DotGrid from "@/assets/DotGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import axios from "axios"

interface employeeEntryType {
  id: string
  user_id: string
  employee: string
  normal_rate: number
  ot_rate: number
  payg: number
  super: number
}

export function Payroll() {
  const [name, setName] = useState("")
  const [normalRate, setNormalRate] = useState(25.99)
  const [otRate, setOtRate] = useState(38.98)
  const [payg, setPayg] = useState(19)
  const [superPercent, setSuperPercent] = useState(11)
  const [employeeEntries, setEmployeeEntries] = useState<employeeEntryType[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const selectedEntry = employeeEntries.find((entry) => entry.id === selectedEmployeeId) ?? employeeEntries[0]
  const selectedName = selectedEntry?.employee
  useEffect(() => {
    const fetchEmployeesData = async () => {
      const result = await axios.get("http://localhost:8080/get/employees")
      setEmployeeEntries(result.data)
      if (result.data.length > 0) {
        loadEmployee(result.data[0])
      }
    }
    fetchEmployeesData()
  }, [])

  function loadEmployee(entry: employeeEntryType) {
    setSelectedEmployeeId(entry.id)
    setName(entry.employee)
    setNormalRate(entry.normal_rate)
    setOtRate(entry.ot_rate)
    setPayg(entry.payg)
    setSuperPercent(entry.super)
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
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15">
                    <DollarSign className="size-4 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-100">
                      Employee Settings
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Employee</label>
                  <Select
                    placeholder="Select employee"
                    value={selectedEntry?.id}
                    onChange={(value) => {
                      const entry = employeeEntries.find((entry) => entry.id === value!.toString())
                      if (entry) loadEmployee(entry)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {employeeEntries.map((entry) => (
                          <SelectItem key={entry.id} id={entry.id}>
                            {entry.employee}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Name</label>
                  <Input placeholder="Employee name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Normal Rate $/hr</label>
                  <Input type="number" value={normalRate} onChange={(e) => setNormalRate(Number(e.target.value))} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">OT Rate $/hr</label>
                  <Input type="number" value={otRate} onChange={(e) => setOtRate(Number(e.target.value))} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">PAYG %</label>
                  <Input type="number" value={payg} onChange={(e) => setPayg(Number(e.target.value))} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Super %</label>
                  <Input type="number" value={superPercent} onChange={(e) => setSuperPercent(Number(e.target.value))} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      addEmployee(selectedEmployeeId, name, normalRate, otRate, payg, superPercent, selectedName)
                    }}
                    className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <Save className="size-4" />
                    Save
                  </Button>
                  {selectedEntry && (
                    <Button onClick={() => deleteEntry(selectedEntry.id)} variant={"destructive"}>
                      Delete
                    </Button>
                  )}
                </div>
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
                  <Input disabled value="September 14, 2026" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Week End</label>
                  <Input disabled value="September 20, 2026" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
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
                  Placeholder only. Nothing here saves yet.
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
                    <p className="text-lg font-semibold text-neutral-100">0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Total OT Hours</p>
                    <p className="text-lg font-semibold text-neutral-100">0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Gross Wages</p>
                    <p className="text-lg font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">PAYG Withheld</p>
                    <p className="text-lg font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Super</p>
                    <p className="text-lg font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs text-neutral-400">Net Estimate</p>
                    <p className="text-lg font-semibold text-emerald-400">$0.00</p>
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
                      <TableCell className="font-medium">2026-09-14</TableCell>
                      <TableCell>Monday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-15</TableCell>
                      <TableCell>Tuesday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-16</TableCell>
                      <TableCell>Wednesday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-17</TableCell>
                      <TableCell>Thursday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-18</TableCell>
                      <TableCell>Friday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-19</TableCell>
                      <TableCell>Saturday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2026-09-20</TableCell>
                      <TableCell>Sunday</TableCell>
                      <TableCell><Input placeholder="Work" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell><Input type="time" /></TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <TableCaption>Placeholder timesheet. Nothing here saves yet.</TableCaption>
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
                    <TableRow>
                      <TableCell className="font-medium">2025-08-04</TableCell>
                      <TableCell>2025-08-16</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>0.00</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>$0.00</TableCell>
                    </TableRow>
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

  async function addEmployee(id: string, name: string, normalRate: number, otRate: number, payg: number, superPercent: number, selectedName: string) {
    if(selectedName != name){
      await axios.post("http://localhost:8080/add/employees", {
        id: id,
        employee: name,
        normalRate: Number(normalRate),
        otRate: Number(otRate),
        payg: Number(payg),
        super: Number(superPercent),
      })
    } else{
      await axios.patch(`http://localhost:8080/edit/employees/${id}`, {
        normalRate: Number(normalRate),
        otRate: Number(otRate),
        payg: Number(payg),
        super: Number(superPercent),
      })
    }
  }

  async function deleteEntry(id: string) {
    try {
      await axios.delete(`http://localhost:8080/delete/employees/${id}`)
    } catch (err) {
      console.error(err)
    }
  }
}
