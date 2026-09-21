import { useEffect, useRef, useState } from "react"
import {
  ClipboardList,
  Boxes,
  HardHat,
  ScanLine,
  ListChecks,
  UploadCloud,
  FileUp,
  Save,
  X,
} from "lucide-react"

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
import axios from "axios"

export function ProjectSummaryEntry() {
  const [registerView, setRegisterView] = useState<"materials" | "labour">("materials")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [projectName, setProjectName] = useState("")
  const [projectClient, setProjectClient] = useState("")
  const [projectAddress, setProjectAddress] = useState("")
  const [projectBillingType, setProjectBillingType] = useState<"Standard Charge" | "Contract" | "Cost Plus" | "Maintenance">("Standard Charge")
  const [projectInitialVariation, setProjectInitialVariation] = useState(0)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

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
              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15">
                    <ClipboardList className="size-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Top
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      Quick Manual Entry
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Project Name</label>
                      <Input
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Client</label>
                        <Input
                          placeholder="Client"
                          value={projectClient}
                          onChange={(e) => setProjectClient(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Address</label>
                        <Input
                          placeholder="Address"
                          value={projectAddress}
                          onChange={(e) => setProjectAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Billing Type</label>
                        <Select
                          placeholder="Standard charge"
                          value={projectBillingType}
                          onChange={(value) => setProjectBillingType(value!.toString() as typeof projectBillingType)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem id="Standard Charge">Standard charge</SelectItem>
                              <SelectItem id="Contract">Contract</SelectItem>
                              <SelectItem id="Cost Plus">Cost Plus</SelectItem>
                              <SelectItem id="Maintenance">Contract</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Contract Amount ex GST</label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Initial Variation ex GST</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={projectInitialVariation}
                          onChange={(e) => setProjectInitialVariation(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-sidebar-border px-4 py-3">
                      <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                        Total Contract Price + Variation
                      </p>
                      <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                    </div>
                    <div className="rounded-lg border border-sidebar-border px-4 py-3">
                      <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                        Total Cost Incurred
                      </p>
                      <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                    </div>
                    <div className="rounded-lg border border-sidebar-border px-4 py-3">
                      <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                        Profit
                      </p>
                      <p className="mt-1 text-xl font-semibold text-emerald-400">$0.00</p>
                    </div>
                    <div className="rounded-lg border border-sidebar-border px-4 py-3">
                      <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                        Margin
                      </p>
                      <p className="mt-1 text-xl font-semibold text-neutral-100">0.0%</p>
                    </div>
                  </div>
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15">
                    <Boxes className="size-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Body
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      Materials Entry
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Date</label>
                    <Input type="date" defaultValue="2026-09-20" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Supplier</label>
                    <Select placeholder="Suppliers...">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem>Ferguson</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Invoice No.</label>
                    <Input placeholder="Invoice No." />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Product Code</label>
                    <Input placeholder="Product Code" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Qty</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Description/notes</label>
                    <Input placeholder="Description/notes" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Unit Price ex GST</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Net Price ex GST</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">
                      GST Amount <span className="text-neutral-500">(10% of net)</span>
                    </label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:w-64">
                  <label className="text-sm text-neutral-300">Total Inc GST</label>
                  <Input type="number" placeholder="0" />
                </div>

                <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                  Add Material
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-violet-500/15">
                    <HardHat className="size-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Body
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      Labour/Subcon Entry
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Date</label>
                    <Input type="date" defaultValue="2026-09-20" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Person</label>
                    <Select placeholder="Employees...">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem>Steven</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Type</label>
                    <Select placeholder="Normal">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem id="normal">Normal</SelectItem>
                          <SelectItem id="overtime">Overtime</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">From:</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">To:</label>
                    <Input type="time" defaultValue="17:00" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-neutral-300">Hours</label>
                    <Input type="number" placeholder="Hours" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:w-64">
                  <label className="text-sm text-neutral-300">Rate</label>
                  <Input type="number" placeholder="default: 25.99" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-300">Notes</label>
                  <Input placeholder="Notes" />
                </div>

                <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                  Add Labour
                </Button>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-cyan-500/15">
                    <ScanLine className="size-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Separator
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      AI Invoice Scanner
                    </h2>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => loadFile(e.target.files?.[0] ?? null)}
                />

                {!file ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(true)
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(false)
                      loadFile(e.dataTransfer.files?.[0] ?? null)
                    }}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                      isDraggingOver
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-sidebar-border bg-sidebar-accent/20"
                    }`}
                  >
                    <div className="flex size-12 items-center justify-center rounded-full bg-cyan-500/15">
                      <UploadCloud className="size-6 text-cyan-400" />
                    </div>
                    <p className="text-sm font-medium text-neutral-200">Drop Invoice Image/PDF here</p>
                    <p className="text-xs text-neutral-500">
                      Upload an invoice image or PDF and let the scanner pull rows into materials.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="size-4" />
                      Choose PDF
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium text-neutral-200">{file.name}</p>
                      <Button variant="ghost" size="icon-sm" onClick={clearScan}>
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-sidebar-border bg-black/30">
                      {file.type.startsWith("image/") ? (
                        <img src={previewUrl ?? undefined} alt={file.name} className="max-h-96 w-full object-contain" />
                      ) : (
                        <iframe title="Invoice preview" src={previewUrl ?? undefined} className="h-96 w-full" />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => extractMaterials(file?.name)} className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                    <Save className="size-4" />
                    Save Scanned rows to materials
                  </Button>
                  <Button variant="outline" onClick={clearScan}>
                    Clear Scan
                  </Button>
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/15">
                      <ListChecks className="size-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                        Register
                      </p>
                      <h2 className="text-2xl font-semibold text-neutral-100">
                        {registerView === "materials" ? "Materials Register" : "Labour Register"}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className={
                        registerView === "materials"
                          ? "rounded-full bg-sky-500 text-white hover:bg-sky-400"
                          : "rounded-full"
                      }
                      variant={registerView === "materials" ? undefined : "outline"}
                      onClick={() => setRegisterView("materials")}
                    >
                      Materials
                    </Button>
                    <Button
                      size="sm"
                      className={
                        registerView === "labour"
                          ? "rounded-full bg-sky-500 text-white hover:bg-sky-400"
                          : "rounded-full"
                      }
                      variant={registerView === "labour" ? undefined : "outline"}
                      onClick={() => setRegisterView("labour")}
                    >
                      Labour
                    </Button>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Supplier</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-100">FERGUSON</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Total</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-100">0</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Invoice</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-500">—</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Date</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-500">—</p>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-sidebar-border px-3 py-2">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Markup</p>
                    <Input placeholder="Input Markup here..." className="h-6 p-2 border-0 bg-transparent text-sm" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border">
                  <table className="w-full min-w-max border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-sidebar-border bg-sidebar-accent/40">
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Product Code
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Description
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Qty Supplied
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Unit Price ex GST
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Unit
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Net Price ex GST
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          GST Amount
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Total Price Inc GST
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-neutral-500">
                          No {registerView} added to this project yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button className="w-full rounded-lg bg-sky-500 text-white hover:bg-sky-400">
                  Save materials alongside project details and labour
                </Button>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function uploadFile(file: File, filename: string) {
    const formData = new FormData
    formData.append("file", file, filename)
    try{
      await axios.post("http://localhost:8080/add/invoice", formData)
    } catch(err){
      console.log("Error uploading file: ", err)
    }
  }
  function loadFile(next: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (next) uploadFile(next, next.name)
    setFile(next)
    setPreviewUrl(next ? URL.createObjectURL(next) : null)
  }

  function clearScan() {
    loadFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function extractMaterials(name: string | undefined){
    try{
      console.log("Name: ", name)
      await axios.post("http://localhost:8080/extract/materials/invoice", {name: name})
    } catch(err){
      console.log(err)
    }
  }
}
