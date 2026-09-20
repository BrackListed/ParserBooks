import { Sparkles, Search, Upload, Download, FolderOpen, Trash2, Pencil, ChevronDown } from "lucide-react"

import DotGrid from "@/assets/DotGrid"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import { Button, LinkButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProjectSummary() {
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
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Projects Summary
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      Projects Summary
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <LinkButton
                      href="/projectsummary/entry"
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Sparkles className="size-4" />
                      Manual Entry
                    </LinkButton>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-sidebar-border px-4 py-3">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Contract / Invoice Total
                    </p>
                    <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-4 py-3">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Materials Ex GST
                    </p>
                    <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-4 py-3">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Labour Ex GST
                    </p>
                    <p className="mt-1 text-xl font-semibold text-neutral-100">$0.00</p>
                  </div>
                  <div className="rounded-lg border border-sidebar-border px-4 py-3">
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Profit / Margin
                    </p>
                    <p className="mt-1 text-xl font-semibold text-emerald-400">0.0%</p>
                  </div>
                </div>
              </BentoGridItem>

              <BentoGridItem colSpan={3} className="justify-start space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
                      Projects History / Summary
                    </p>
                    <h2 className="text-2xl font-semibold text-neutral-100">
                      Projects History / Summary
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-neutral-500" />
                      <Input placeholder="Search projects..." className="w-48 pl-8" />
                    </div>
                    <Select placeholder="All types">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem id="all-types">All types</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select placeholder="All clients">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem id="all-clients">All clients</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Upload className="size-4" />
                      Import Excel
                    </Button>
                    <Button variant="outline">
                      <Download className="size-4" />
                      Export Excel
                    </Button>
                  </div>
                </div>
                <div className="h-px w-full bg-sidebar-border" />

                <div className="overflow-x-auto rounded-lg border border-sidebar-border">
                  <table className="w-full min-w-max border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-sidebar-border bg-sidebar-accent/40">
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Complete
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Project
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Client
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Contract Value
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Variation Value
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Total Contract + Variation
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Materials
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Labour
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Profit
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Margin
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium tracking-widest text-neutral-400 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sidebar-border last:border-0 hover:bg-sidebar-accent/30">
                        <td className="px-3 py-3">
                          <input type="checkbox" className="size-4 rounded border-sidebar-border" />
                        </td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-400">
                            Ongoing
                            <ChevronDown className="size-3" />
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium text-neutral-100 whitespace-nowrap">
                          8 Chicago St, Illinois
                        </td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">Unnamed Client</td>
                        <td className="px-3 py-3">
                          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 whitespace-nowrap">
                            Unknown Billing Type
                          </span>
                        </td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$59,867.59</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$10,463.84</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$70,331.43</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$893.79</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$1,360.00</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">$36,706.52</td>
                        <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">0.61%</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <Button variant="outline" size="sm">
                              <FolderOpen className="size-3.5" />
                              Open
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="size-3.5" />
                              Del
                            </Button>
                            <Button
                              size="sm"
                              className="border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            >
                              <Pencil className="size-3.5" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
