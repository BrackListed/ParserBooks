import { FileText, Loader2, Paperclip, Mail, Save } from "lucide-react"

import DotGrid from "@/assets/DotGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Request() {
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
                    <div className="flex size-8 items-center justify-center rounded-full bg-rose-500/15">
                      <FileText className="size-4 text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-neutral-100">
                        Request For Quotation (RFQ)
                      </h2>
                      <p className="text-sm text-neutral-400">
                        Mga papasok na RFQ — markahan ng Won para gumawa ng draft quotation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-400">
                      <Loader2 className="size-4 animate-spin" />
                      Syncing...
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

              <BentoGridItem colSpan={3} className="justify-start p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-sidebar-border p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-sky-500" />
                      <h3 className="font-semibold text-neutral-100">Paste Email Here</h3>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Paste the full email text from client. The app will extract the key details automatically.
                    </p>
                    <div className="h-px w-full bg-sidebar-border" />

                    <Textarea
                      placeholder="Paste entire email here – subject, body, anything..."
                      className="min-h-48"
                    />

                    <div className="flex flex-wrap gap-2">
                      <Button className="w-fit rounded-lg bg-sky-500 text-white hover:bg-sky-400">
                        <Paperclip className="size-4" />
                        Extract Quote Details
                      </Button>
                      <Button variant="outline">
                        Clear
                      </Button>
                    </div>

                    <a href="https://gmail.com" rel="noreferrer noopener" target="_blank">
                        <Button variant="link" className="h-auto p-0 text-sky-400">
                            <Mail className="size-4" />
                                Open Gmail to read RFQ
                        </Button>
                    </a>
                  </div>

                  <div className="rounded-lg border border-sidebar-border p-4 space-y-4">
                    <h3 className="font-semibold text-neutral-100">Extracted Quote Details</h3>
                    <p className="text-sm text-neutral-400">
                      Review and edit the extracted info, then save to Quotations history
                    </p>
                    <div className="h-px w-full bg-sidebar-border" />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Client Name</label>
                      <Input placeholder="Extracted client name" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Address / Site</label>
                      <Input placeholder="Site address" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Email</label>
                      <Input placeholder="Client email" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Phone</label>
                      <Input placeholder="Client phone" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Description</label>
                      <Textarea placeholder="Work description / scope" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Quoted Amount</label>
                      <Input type="number" placeholder="0.00" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Reference</label>
                      <Input placeholder="Reference" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-neutral-300">Status</label>
                      <Select placeholder="Pending for Quote">
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem id="Pending for Quote">Pending for Quote</SelectItem>
                            <SelectItem id="Sent">Sent</SelectItem>
                            <SelectItem id="Awaiting Work Order">Awaiting Work Order</SelectItem>
                            <SelectItem id="Accepted">Accepted</SelectItem>
                            <SelectItem id="Declined">Declined</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
                      <Save className="size-4" />
                      Save to Quotations History
                    </Button>
                  </div>
                </div>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
