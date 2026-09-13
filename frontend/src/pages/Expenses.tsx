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

const projectItems = [
  { label: "General / Overhead", value: "General / Overhead" },
]

const categoryItems = [
  { label: "Fuel", value: "Fuel" },
  { label: "Admin", value: "Admin" },
  { label: "Tools", value: "Tools" },
  { label: "Insurance", value: "Insurance" },
  { label: "Other", value: "Other" },
]

const gstTypeItems = [
  { label: "Inc GST", value: "Inc GST" },
  { label: "Ex GST", value: "Ex GST" },
]

interface expenseEntryType {
  id: string
  user_id: string
  date: string
  project: string
  category: string
  supplier: string
  description: string
  exGst: number
  gst: number
  incGst: number
}

export function Expenses() {
  const [date, setDate] = useState<CalendarDate | null>(null)
  const [project, setProject] = useState("General / Overhead")
  const [category, setCategory] = useState("Fuel")
  const [supplier, setSupplier] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [gstType, setGstType] = useState("Inc GST")
  const [expenseEntries, setExpenseEntries] = useState<expenseEntryType[]>([])

  useEffect(() => {
    const fetchExpensesData = async () => {
      const result = await axios.get("http://localhost:8080/get/expenses")
      setExpenseEntries(result.data)
    }
    fetchExpensesData()
  }, [])

  const totalExGst = expenseEntries.reduce((sum, entry) => sum + entry.exGst, 0)
  const totalGst = expenseEntries.reduce((sum, entry) => sum + entry.gst, 0)
  const totalIncGst = expenseEntries.reduce((sum, entry) => sum + entry.incGst, 0)

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
                    Expenses
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Add Operating Expense
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
                    <label className="text-sm text-neutral-300">Project</label>
                    <Select
                      placeholder="Project"
                      value={project}
                      onChange={(project) => setProject(project!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projectItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Category</label>
                    <Select
                      placeholder="Category"
                      value={category}
                      onChange={(category) => setCategory(category!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categoryItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Supplier / Payee</label>
                    <Input
                      placeholder="e.g. BP, Officeworks"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Description</label>
                    <Input
                      placeholder="What was it for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">GST Type</label>
                    <Select
                      placeholder="GST"
                      value={gstType}
                      onChange={(gst) => setGstType(gst!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {gstTypeItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    addExpense(date, project, category, supplier, description, amount, gstType)
                  }
                  className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <Plus className="size-4" />
                  Add Expense
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Register
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Expenses Register
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-35">
                      Date
                    </TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Ex GST</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead>Inc GST</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeader>
                  <TableBody>
                    {expenseEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell>{entry.project}</TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.supplier}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>${entry.exGst.toFixed(2)}</TableCell>
                        <TableCell>${entry.gst.toFixed(2)}</TableCell>
                        <TableCell>${entry.incGst.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteEntry(entry.id)} variant={"destructive"}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-semibold">Totals</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-semibold">${totalExGst.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${totalGst.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${totalIncGst.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <TableCaption>A list of your recent operating expenses.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function addExpense(
    date: CalendarDate | null,
    project: string,
    category: string,
    supplier: string,
    description: string,
    amount: number,
    gstType: string
  ) {
    try {
      await axios.post("http://localhost:8080/add/expenses", {
        date: date?.toString(),
        project: project,
        category: category,
        supplier: supplier,
        description: description,
        amount: Number(amount),
        gstType: gstType,
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteEntry(id: string) {
    try {
      await axios.delete(`http://localhost:8080/delete/expenses/${id}`)
    } catch (err) {
      console.error(err)
    }
  }
}
