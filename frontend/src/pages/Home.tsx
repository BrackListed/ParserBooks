import DotGrid from "@/assets/DotGrid";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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
            <div className="w-full h-full border-2 border-red-900"></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}