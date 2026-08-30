import { useEffect, useState } from "react"
import { getLocalTimeZone, type CalendarDate } from "@internationalized/date"
import { CalendarIcon, Plus } from "lucide-react"

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
import axios from "axios"

const personItems = [
  { label: "John", value: "John" },
  { label: "Jacob", value: "Jacob" },
  { label: "Cillian", value: "Cillian" },
]

const typeItems = [
  { label: "Normal", value: "Normal" },
  { label: "Overtime", value: "Overtime" },
]

interface workEntriesType{
  id: string
  user_id: string
  date: string
  worker: string //change this to evnetually have the type of thee workers in the user's db in the future
  project_name: string 
  type: string 
  hours: number
  updated_at: string
}

export function WorkCalendar() {
  const [date, setDate] = useState<CalendarDate | null>(null)
  const [worker, setWorker] = useState("Jacob")
  const [project, setProject] = useState("")
  const [type, setType] = useState("Normal")
  const [hours, setHours] = useState(8)
  const [workEntries, setWorkEntries] = useState<workEntriesType[]>([])

  useEffect(() => {
    const fetchEntriesData = async() => {
      const result = await axios.get(`http://localhost:8080/get/work-entry`)
      console.log(result.data)
      setWorkEntries(result.data)
    }
    fetchEntriesData()
  }, [])
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
                    Work Entry
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Add Work Entry
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Date</label>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {date ? (
                          date
                            .toDate(getLocalTimeZone())
                            .toLocaleDateString(undefined, { dateStyle: "long" })
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      <Popover className="w-auto p-0">
                        <Calendar value={date} onChange={setDate} />
                      </Popover>
                    </PopoverTrigger>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Worker</label>
                    <Select
                      placeholder="Select worker"
                      value={worker}
                      onChange={(worker) => {setWorker(worker!.toString())}}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {personItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Project name</label>
                    <Input
                      placeholder="Search project name"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Type</label>
                    <Select
                      placeholder="Type"
                      value={type}
                      onChange={(type) => setType(type!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {typeItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-40">
                  <label className="text-sm text-neutral-300">Hours</label>
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                  />
                </div>

                <Button onClick={() => addEntry(date, worker, project,  type, hours)} className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                  <Plus className="size-4" />
                  Add Work Entry
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Schedule
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Schedule Register
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-35">
                      Date
                    </TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Project name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableHeader>
                  <TableBody>
                    {workEntries.map((entry) => (<TableRow>
                      <TableCell className="font-medium">{entry.date}</TableCell>
                      <TableCell>{entry.worker}</TableCell>
                      <TableCell>{entry.project_name}</TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell className="text-right">{entry.hours}</TableCell>
                    </TableRow>))}
                  </TableBody>
                </Table>
                <TableCaption>A list of your recent work entries.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function addEntry(date: CalendarDate | null, worker: string, project: string, type: string, hours: number){
    try{
      const result = await axios.post("http://localhost:8080/add/work-entry", {date: date?.toString(), worker: worker, project: project, type: type, hours: Number(hours)})
      if(result.status === 201){
        console.log("Work entry successfully saved")
      }
    } catch (err){
      console.error('Server Error: ', err)
    }
  }
}
