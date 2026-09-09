import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

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

const statusItems = [
  { label: "Pending for Quote", value: "Pending for Quote" },
  { label: "Sent", value: "Sent" },
  { label: "Awaiting Work Order", value: "Awaiting Work Order" },
  { label: "Accepted", value: "Accepted" },
  { label: "Declined", value: "Declined" },
]

const sentViaItems = [
  { label: "Email", value: "Email" },
  { label: "Phone", value: "Phone" },
  { label: "In Person", value: "In Person" },
  { label: "Mail", value: "Mail" },
]

interface quotationEntryType {
  id: string
  user_id: string
  date: string
  client: string
  projectAddress: string
  status: string
  amount: number
  reference: string
  email: string
  phone: string
  notes: string
}

export function Quotations() {
  const [client, setClient] = useState("")
  const [projectAddress, setProjectAddress] = useState("")
  const [status, setStatus] = useState("Pending for Quote")
  const [amount, setAmount] = useState(0)
  const [reference, setReference] = useState("")
  const [sentVia, setSentVia] = useState("Email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [quotationEntries, setQuotationEntries] = useState<quotationEntryType[]>([])

  useEffect(() => {
    const fetchQuotationsData = async () => {
      const result = await axios.get("http://localhost:8080/get/quotations")
      setQuotationEntries(result.data)
    }
    fetchQuotationsData()
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
                    Quotations
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    All quotes are tracked here.
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Client</label>
                    <Input
                      placeholder="Client"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Project / Address</label>
                    <Input
                      placeholder="Project / Address"
                      value={projectAddress}
                      onChange={(e) => setProjectAddress(e.target.value)}
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Quoted Amount</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Reference</label>
                    <Input
                      placeholder="Reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Sent via</label>
                    <Select
                      placeholder="Sent via"
                      value={sentVia}
                      onChange={(sentVia) => setSentVia(sentVia!.toString())}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {sentViaItems.map((item) => (
                            <SelectItem key={item.value} id={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Email</label>
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Phone</label>
                    <Input
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Notes</label>
                  <Input
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button
                  onClick={() =>
                    addQuotation(client, projectAddress, status, amount, reference, sentVia, email, phone, notes)
                  }
                  className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  <Plus className="size-4" />
                  Add Quotation
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Register
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Quotations Register
                  </h2>
                </div>
                <div className="h-px w-full bg-sidebar-border" />
                <Table>
                  <TableHeader>
                    <TableHead isRowHeader className="w-35">
                      Date
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Project / Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeader>
                  <TableBody>
                    {quotationEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell>{entry.client}</TableCell>
                        <TableCell>{entry.projectAddress}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                        <TableCell>{entry.amount}</TableCell>
                        <TableCell>{entry.reference}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{entry.phone}</TableCell>
                        <TableCell>{entry.notes}</TableCell>
                        <TableCell>
                          <Button onClick={() => deleteEntry(entry.id)} variant={"destructive"}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TableCaption>A list of your recent quotations.</TableCaption>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function addQuotation(
    client: string,
    projectAddress: string,
    status: string,
    amount: number,
    reference: string,
    sentVia: string,
    email: string,
    phone: string,
    notes: string
  ) {
    try {
      await axios.post("http://localhost:8080/add/quotation", {
        client: client,
        projectAddress: projectAddress,
        status: status,
        amount: Number(amount),
        reference: reference,
        sentVia: sentVia,
        email: email,
        phone: phone,
        notes: notes,
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteEntry(id: string) {
    try {
      await axios.delete(`http://localhost:8080/delete/quotation/${id}`)
    } catch (err) {
      console.error(err)
    }
  }
}
