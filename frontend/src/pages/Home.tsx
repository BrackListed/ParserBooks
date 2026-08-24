import DotGrid from "@/assets/DotGrid";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BentoGrid, BentoGridItem } from "@/ui/bento-grid"
import {
  DollarSign,
  Percent,
  Receipt,
  FileText,
  Landmark,
  FileSignature,
} from "lucide-react"

export function Home(){
  return(
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
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-sky-500/15">
                  <DollarSign className="size-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Profit Snapshot</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $128,400
                  </p>
                </div>
              </BentoGridItem>
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/15">
                  <Percent className="size-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Tax Set Aside (30%)</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $38,520
                  </p>
                </div>
              </BentoGridItem>
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/15">
                  <Receipt className="size-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Monthly Expenses</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $24,800
                  </p>
                </div>
              </BentoGridItem>
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/15">
                  <FileText className="size-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Accounts Receivable</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $54,120
                  </p>
                </div>
              </BentoGridItem>
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-rose-500/15">
                  <Landmark className="size-4 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Accounts Payable</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $18,760
                  </p>
                </div>
              </BentoGridItem>
              <BentoGridItem className="justify-start space-y-3 p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-violet-500/15">
                  <FileSignature className="size-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Contract Pipeline</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-600">
                    $312,000
                  </p>
                </div>
              </BentoGridItem>
            </BentoGrid>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}