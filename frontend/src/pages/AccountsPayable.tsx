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

const priorityItems = [
  { label: "Low", value: "Low" },
  { label: "Moderate", value: "Moderate" },
  { label: "High", value: "High" },
]

const statusItems = [
  { label: "Unpaid", value: "Unpaid" },
  { label: "Paid", value: "Paid" },
]

interface billEntryType {
  id: string
  user_id: string
  due: string
  supplier: string
  description: string
  amount: number
  priority: string
  status: string
  paid_date: string
}

export function AccountsPayable() {
  const [dueDate, setDueDate] = useState<CalendarDate | null>(null)
  const [supplier, setSupplier] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [priority, setPriority] = useState("Moderate")
  const [status, setStatus] = useState("Unpaid")
  const [paidDate, setPaidDate] = useState<CalendarDate | null>(null)
  const [billEntries, setBillEntries] = useState<billEntryType[]>([])

  useEffect(() => {
    const fetchBillsData = async () => {
      const result = await axios.get("http://localhost:8080/get/accounts-payable")
      setBillEntries(result.data)
    }
    fetchBillsData()
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
                    Purchases
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Due Bills
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Due Date</label>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        data-empty={!dueDate}
                        className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {dueDate ? (
                          dueDate
                            .toDate(getLocalTimeZone())
                            .toLocaleDateString(undefined, { dateStyle: "long" })
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      <Popover className="w-auto p-0">
                        <Calendar value={dueDate} onChange={setDueDate} />
                      </Popover>
                    </PopoverTrigger>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Supplier</label>
                    <Input
                      placeholder="Supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Description</label>
                    <Input
                      placeholder="Description"
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
                    <label className="text-sm text-neutral-300">Priority</label>
                    <Select
                      placeholder="Priority"
                      value={priority}
                      onChange={(priority) => setPriority(priority!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {priorityItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Paid Date</label>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        data-empty={!paidDate}
                        className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {paidDate ? (
                          paidDate
                            .toDate(getLocalTimeZone())
                            .toLocaleDateString(undefined, { dateStyle: "long" })
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                      <Popover className="w-auto p-0">
                        <Calendar value={paidDate} onChange={setPaidDate} />
                      </Popover>
                    </PopoverTrigger>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    addBill(dueDate, supplier, description, amount, priority, status, paidDate)
                  }
                  className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <Plus className="size-4" />
                  Add Bill
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Register
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Accounts Payable Register
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-35">
                      Due Date
                    </TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeader>
                  <TableBody>
                    {billEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.due}</TableCell>
                        <TableCell>{entry.supplier}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{entry.amount}</TableCell>
                        <TableCell>{entry.priority}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                        <TableCell>{entry.paid_date}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteEntry(entry.id)} variant={"destructive"}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableCaption>A list of your due bills.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function addBill(
    dueDate: CalendarDate | null,
    supplier: string,
    description: string,
    amount: number,
    priority: string,
    status: string,
    paidDate: CalendarDate | null
  ) {
    try {
      await axios.post("http://localhost:8080/add/accounts-payable", {
        dueDate: dueDate?.toString(),
        supplier: supplier,
        description: description,
        amount: Number(amount),
        priority: priority,
        status: status,
        paidDate: paidDate?.toString(),
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteEntry(id: string) {
    try {
      await axios.delete(`http://localhost:8080/delete/accounts-payable/${id}`)
    } catch (err) {
      console.error(err)
    }
  }
}
