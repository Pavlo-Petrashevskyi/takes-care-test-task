import * as React from "react"
import {
  SidebarProvider,
  Sidebar,
} from "@/components/ui/sidebar"



export default function RightSidebarWrap({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider className="fixed top-[137px]">
      <Sidebar className="static h-max">
       {children}
      </Sidebar>
    </SidebarProvider>
  )
}
