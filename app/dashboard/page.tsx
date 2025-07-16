"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import CreativeBackground from "@/components/clipped-image"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("copilot")

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-full">
          <DashboardSidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
          <SidebarInset className="flex-1 min-w-0 overflow-hidden">
            {/* NOUVEAU: Arrière-plan créatif avec formes colorées et découpées */}
      <CreativeBackground
        // Ces classes le transforment en arrière-plan
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
      />
            <DashboardContent activeSection={activeSection} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
