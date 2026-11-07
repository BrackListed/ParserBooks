import { useRef, useState } from "react"
import { FileSpreadsheet, CheckCircle2, Upload, X, Loader2 } from "lucide-react"

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

function FileUploadCard({
  title,
  description,
  file,
  onChange,
  status,
}: {
  title: string
  description: string
  file: File | null
  onChange: (file: File | null) => void
  status?: React.ReactNode
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="rounded-lg border border-sidebar-border p-4">
      <p className="font-semibold text-neutral-100">{title}</p>
      <p className="mt-1 text-sm text-neutral-400">{description}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div className="mt-4 flex items-center gap-3">
        {status ?? (
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload className="size-4" />
            Upload file
          </Button>
        )}
        <span className="truncate text-sm text-neutral-500">
          {file ? file.name : "No file chosen"}
        </span>
        {file && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}


interface projectType{
  address: string
  billing_type: string
  client: string
  contract_amount_ex_gst: number
  gst: number
  initial_variation: number
  net_profit: number
  profit_margin: number
  project_name: string
  start_date: string
  target_completion_date: string
  total_contract_price: number
}

interface materialType{
  date: string
  description: string
  invoice: string
  markup: number
  product_code: string
  quantity: number
  supplier: string
  total: number
  total_inc_gst: boolean
  unit_price: number
}

export function Excel() {
  const [previewTab, setPreviewTab] = useState<"project" | "materials" | "labour" | "variation">("project")
  const [variationTab, setVariationTab] = useState<"summary" | "materials" | "labour">("summary")
  const [projectDetailsFile, setProjectDetailsFile] = useState<File | null>(null)
  const [materialsFile, setMaterialsFile] = useState<File | null>(null)
  const [labourFile, setLabourFile] = useState<File | null>(null)
  const [variationFile, setVariationFile] = useState<File | null>(null)
  const [project, setProject] = useState<projectType | null>(null)
  const [materials, setMaterials] = useState<materialType[]>([])
  const [countdown, setCountdown] = useState(0)
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(materials.length / 10))
  const cooldown = countdown > 0 ? (
    <div className="flex w-full flex-col gap-1.5">
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div className="h-2 rounded-full bg-sky-500" style={{ width: `${(countdown / 60) * 100}%` }} />
      </div>
      <span className="text-sm text-neutral-300">All 15 requests have been exhausted. Wait {countdown}s</span>
    </div>
  ) : null
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
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15">
                      <FileSpreadsheet className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-neutral-100">
                        Import from Excel
                      </h2>
                      <p className="text-sm text-neutral-400">
                        Load projects &amp; per-project costs from a spreadsheet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
                      <CheckCircle2 className="size-4" />
                      Sync successful
                    </span>
                    <Select placeholder="All Projects">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem id="all">All Projects</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div>
                  <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                    Source
                  </p>
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Upload source files
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Add the four files that will eventually feed the import flow.
                  </p>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FileUploadCard
                    title="Project Details"
                    description="Leftmost tables and summary data."
                    file={projectDetailsFile}
                    onChange={(file) => {
                      setProjectDetailsFile(file)
                      if (file) analyzeProjectFile(file)
                    }}
                    status={cooldown}
                  />
                  <FileUploadCard
                    title="Materials"
                    description="Material lists and related cost lines."
                    file={materialsFile}
                    onChange={(file) => {
                      setMaterialsFile(file)
                      if(file) analyzeMaterialsFile(file)
                    }}
                    status={
                      materialsFile && materials.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <Loader2 className="size-4 animate-spin text-sky-400" />
                          Loading Materials...
                        </div>
                      ) : cooldown
                    }
                  />
                  <FileUploadCard
                    title="Labour"
                    description="Timesheets, hours, and labour details."
                    file={labourFile}
                    onChange={setLabourFile}
                    status={cooldown}
                  />
                  <FileUploadCard
                    title="Variation"
                    description="Variation and change-order records."
                    file={variationFile}
                    onChange={setVariationFile}
                    status={cooldown}
                  />
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-neutral-100">
                    Preview
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={previewTab === "project" ? undefined : "outline"}
                      className={previewTab === "project" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                      onClick={() => setPreviewTab("project")}
                    >
                      Project
                    </Button>
                    <Button
                      size="sm"
                      variant={previewTab === "materials" ? undefined : "outline"}
                      className={previewTab === "materials" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                      onClick={() => setPreviewTab("materials")}
                    >
                      Materials
                    </Button>
                    <Button
                      size="sm"
                      variant={previewTab === "labour" ? undefined : "outline"}
                      className={previewTab === "labour" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                      onClick={() => setPreviewTab("labour")}
                    >
                      Labour
                    </Button>
                    <Button
                      size="sm"
                      variant={previewTab === "variation" ? undefined : "outline"}
                      className={previewTab === "variation" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                      onClick={() => setPreviewTab("variation")}
                    >
                      Variation
                    </Button>
                    <Button className="w-fit rounded-full bg-emerald-600 text-white hover:bg-emerald-500">
                      Save to Project Summary
                    </Button>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                {previewTab === "project" && (
                  <div className="rounded-lg border border-sidebar-border p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Project Name</label>
                        <Input placeholder="Unnamed Project" value={project?.project_name ?? ""} onChange={(e) => setProject({ ...project!, project_name: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Client</label>
                        <Input placeholder="Unnamed Client" value={project?.client ?? ""} onChange={(e) => setProject({ ...project!, client: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-sm text-neutral-300">Address</label>
                        <Input placeholder="No address" value={project?.address ?? ""} onChange={(e) => setProject({ ...project!, address: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Billing Type</label>
                        <Select placeholder="Select billing type" selectedKey={project?.billing_type ?? null} onSelectionChange={(key) => setProject({ ...project!, billing_type: key as string })}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem id="Standard Charge">Standard Charge</SelectItem>
                              <SelectItem id="Contract">Contract</SelectItem>
                              <SelectItem id="Cost Plus">Cost Plus</SelectItem>
                              <SelectItem id="Maintenance">Maintenance</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Contract Amount Ex GST</label>
                        <Input type="number" placeholder="0" value={project?.contract_amount_ex_gst ?? ""} onChange={(e) => setProject({ ...project!, contract_amount_ex_gst: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">GST</label>
                        <Input type="number" placeholder="0" value={project?.gst ?? ""} onChange={(e) => setProject({ ...project!, gst: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Contract Amount Inc GST</label>
                        <Input type="number" placeholder="0" value={project?.total_contract_price ?? ""} onChange={(e) => setProject({ ...project!, total_contract_price: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Initial Variation</label>
                        <Input type="number" placeholder="0" value={project?.initial_variation ?? ""} onChange={(e) => setProject({ ...project!, initial_variation: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Cost Incurred</label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Profit Margin</label>
                        <Input type="number" placeholder="0" value={project?.profit_margin ?? ""} onChange={(e) => setProject({ ...project!, profit_margin: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Profit</label>
                        <Input type="number" placeholder="0" value={project?.net_profit ?? ""} onChange={(e) => setProject({ ...project!, net_profit: Number(e.target.value) })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Start Date</label>
                        <Input type="date" className="[color-scheme:dark]" value={project?.start_date ?? ""} onChange={(e) => setProject({ ...project!, start_date: e.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-neutral-300">Target Completion Date</label>
                        <Input type="date" className="[color-scheme:dark]" value={project?.target_completion_date ?? ""} onChange={(e) => setProject({ ...project!, target_completion_date: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {previewTab === "materials" && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-sidebar-border px-4 py-3">
                        <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Total Ex GST</p>
                        <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                      </div>
                      <div className="rounded-lg border border-sidebar-border px-4 py-3">
                        <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Total Inc GST</p>
                        <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                      </div>
                      <div className="rounded-lg border border-sidebar-border px-4 py-3">
                        <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Total Inc GST With Markup</p>
                        <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableHead isRowHeader className="w-28">Date</TableHead>
                        <TableHead>Product Code</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Ex GST</TableHead>
                        <TableHead>Net Ex GST</TableHead>
                        <TableHead>GST</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Markup</TableHead>
                        <TableHead>Total With Markup</TableHead>
                      </TableHeader>
                      <TableBody>
                        {materials.slice((page - 1) * 10, page * 10).map((material) => {
                          const ex_gst = material.total_inc_gst ? (material.unit_price / 1.10) : material.unit_price //a material with gst is 100% or 1 (base) + 10% or 0.1(gst). Dividing by 1.10 reverts it back to the base value. 1.1/1.1 = 1
                          const net_ex_gst = ex_gst * material.quantity
                          const gst = net_ex_gst * 0.10
                          const total_inc_gst = net_ex_gst + gst
                          return(<TableRow>
                          <TableCell>{material.date}</TableCell>
                          <TableCell>{material.product_code}</TableCell>
                          <TableCell>{material.supplier}</TableCell>
                          <TableCell>{material.invoice}</TableCell>
                          <TableCell>{material.description}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>${ex_gst.toFixed(2)}</TableCell>
                          <TableCell>${net_ex_gst.toFixed(2)}</TableCell>
                          <TableCell>${(gst).toFixed(2)}</TableCell>
                          <TableCell>${(total_inc_gst).toFixed(2)}</TableCell>
                          <TableCell>{material.markup.toFixed(2)}%</TableCell>
                          <TableCell>${(material.markup + total_inc_gst).toFixed(2)}</TableCell>
                        </TableRow>)})}
                      </TableBody>
                    </Table>
                    {materials.length > 10 && (
                      <div className="flex items-center justify-end gap-2 text-sm text-neutral-300">
                        <Button size="sm" variant="outline" isDisabled={page === 1} onClick={() => setPage(page - 1)}>
                          Prev
                        </Button>
                        <Input
                          type="number"
                          className="w-16 text-center"
                          min={1}
                          max={totalPages}
                          value={page}
                          onChange={(e) => setPage(Math.min(totalPages, Math.max(1, Number(e.target.value))))}
                        />
                        <span>of {totalPages}</span>
                        <Button size="sm" variant="outline" isDisabled={page === totalPages} onClick={() => setPage(page + 1)}>
                          Next
                        </Button>
                      </div>
                    )}
                    <TableCaption>No materials loaded from a spreadsheet yet.</TableCaption>
                  </>
                )}

                {previewTab === "labour" && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border border-sidebar-border px-4 py-3">
                        <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">Total</p>
                        <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableHead isRowHeader className="w-28">Date</TableHead>
                        <TableHead>Worker</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>01/01/2026</TableCell>
                          <TableCell>Worker Name</TableCell>
                          <TableCell>$0.00</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>$0.00</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <TableCaption>No labour loaded from a spreadsheet yet.</TableCaption>
                  </>
                )}

                {previewTab === "variation" && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant={variationTab === "summary" ? undefined : "outline"}
                        className={variationTab === "summary" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                        onClick={() => setVariationTab("summary")}
                      >
                        Summary
                      </Button>
                      <Button
                        size="sm"
                        variant={variationTab === "materials" ? undefined : "outline"}
                        className={variationTab === "materials" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                        onClick={() => setVariationTab("materials")}
                      >
                        Materials
                      </Button>
                      <Button
                        size="sm"
                        variant={variationTab === "labour" ? undefined : "outline"}
                        className={variationTab === "labour" ? "rounded-full bg-sky-500 text-white hover:bg-sky-400" : "rounded-full"}
                        onClick={() => setVariationTab("labour")}
                      >
                        Labour
                      </Button>
                    </div>

                    {variationTab === "summary" && (
                      <div className="rounded-lg border border-sidebar-border p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-neutral-300">Name</label>
                            <Input placeholder="Unnamed Variation" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-neutral-300">Subtotal</label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-neutral-300">Markup</label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-sm text-neutral-300">Total</label>
                            <Input type="number" placeholder="0" />
                          </div>
                        </div>
                      </div>
                    )}

                    {variationTab === "materials" && (
                      <>
                        <Table>
                          <TableHeader>
                            <TableHead isRowHeader className="w-28">Date</TableHead>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Ex GST</TableHead>
                            <TableHead>GST</TableHead>
                            <TableHead>Total</TableHead>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>01/01/2026</TableCell>
                              <TableCell>PC-001</TableCell>
                              <TableCell>Supplier Name</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>1</TableCell>
                              <TableCell>$0.00</TableCell>
                              <TableCell>$0.00</TableCell>
                              <TableCell>$0.00</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <TableCaption>No materials loaded for this variation yet.</TableCaption>
                      </>
                    )}

                    {variationTab === "labour" && (
                      <>
                        <Table>
                          <TableHeader>
                            <TableHead isRowHeader className="w-28">Date</TableHead>
                            <TableHead>Worker</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>01/01/2026</TableCell>
                              <TableCell>Worker Name</TableCell>
                              <TableCell>$0.00</TableCell>
                              <TableCell>0</TableCell>
                              <TableCell>$0.00</TableCell>
                              <TableCell>Notes</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <TableCaption>No labour loaded for this variation yet.</TableCaption>
                      </>
                    )}
                  </>
                )}
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )

  async function analyzeProjectFile(project: File) {
    const formData = new FormData
    formData.append("project", project)
    const result = await axios.post("http://localhost:8080/analyze/projects", formData)
    console.log(result.data.project[0])
    const gottenProject = result.data.project[0]
    const convertDate = (date: string) => {
      const [month, day, year] = date.split("/")
      return `${year}-${month}-${day}`
    }
    setProject({
      ...gottenProject,
      start_date: convertDate(gottenProject.start_date),
      target_completion_date: convertDate(gottenProject.target_completion_date),
    })
  }

  async function analyzeMaterialsFile(materials: File){
    const formData = new FormData()
    formData.append("materials", materials)
    setMaterials([])
    setPage(1)
    const result = await axios.post("http://localhost:8080/analyze/materials", formData)
    console.log(result.data)
    setMaterials(result.data)
    setCountdown(60)
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    setTimeout(() => clearInterval(timer), 60000)
  }
}
