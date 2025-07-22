"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Palette,
  Wand2,
  ImageIcon,
  FileText,
  Video,
  Music,
  Layers,
  Settings,
  HelpCircle,
  Zap,
  Brain,
  Lightbulb,
  Rocket,
  Clock,
  Activity,
} from "lucide-react"

const creativeTools = [
  {
    title: "Images",
    url: "#",
    icon: ImageIcon,
    badge: "Nouveau",
    id: "image-generator",
    gradient: "from-purple-500 via-pink-500 to-red-500",
  },
  {
    title: "Rédaction",
    url: "#",
    icon: FileText,
    badge: "Populaire",
    id: "writing-assistant",
    gradient: "from-green-500 via-teal-500 to-blue-500",
  },
  {
    title: "Vidéos",
    url: "#",
    icon: Video,
    id: "video-creator",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    title: "Musical",
    url: "#",
    icon: Music,
    badge: "Beta",
    id: "music-composer",
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
  },
  {
    title: "Designer Graphique",
    url: "#",
    icon: Palette,
    id: "graphic-designer",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  {
    title: "Architecte 3D",
    url: "#",
    icon: Layers,
    id: "3d-architect",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
]

const aiFeatures = [
  {
    title: "Co-Pilote Créatif",
    url: "#",
    icon: Brain,
    isActive: true,
    id: "copilot",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
  },
  {
    title: "Inspiration AI",
    url: "#",
    icon: Lightbulb,
    id: "ai-inspiration",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
  },
  {
    title: "Boost Créatif",
    url: "#",
    icon: Zap,
    id: "creative-boost",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
  },
  {
    title: "Innovation Lab",
    url: "#",
    icon: Rocket,
    id: "innovation-lab",
    gradient: "from-green-500 via-blue-500 to-purple-500",
  },
  {
    title: "Projets Récents",
    url: "#",
    icon: Clock,
    id: "recent-projects",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    title: "Inspirations",
    url: "#",
    icon: Lightbulb,
    id: "inspirations",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
  },
  {
    title: "Suivi des Tâches",
    url: "#",
    icon: Activity,
    id: "jobs",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "Nouveau",
  },
]

interface DashboardSidebarProps {
  onSectionChange: (sectionId: string) => void
  activeSection: string
}

export function DashboardSidebar({ onSectionChange, activeSection }: DashboardSidebarProps) {
  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
    >
      <SidebarHeader className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80">
        <div className="flex items-center space-x-3 px-4 py-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-600 rounded transform rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded transform -rotate-45"></div>
          </div>
          <div>
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#6A82FB]">
              Katshuki
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Studio Créatif</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white/80 dark:bg-gray-900/80">
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-purple-600 dark:text-purple-400 px-2 py-2">
                <Sparkles className="w-4 h-4" />
                Co-Pilote AI
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiFeatures.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`w-full transition-all duration-300 ${
                          activeSection === item.id
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105 hover:scale-105`
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <button
                          className="flex items-center gap-3 px-3 py-2 w-full text-left"
                          onClick={() => onSectionChange(item.id)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-pink-600 dark:text-pink-400 px-2 py-2">
                <Wand2 className="w-4 h-4" />
                Outils Créatifs
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {creativeTools.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={`w-full transition-all duration-300 ${
                          activeSection === item.id
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105 hover:scale-105`
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <button
                          className="flex items-center gap-3 px-3 py-2 w-full text-left"
                          onClick={() => onSectionChange(item.id)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1 text-sm font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                activeSection === item.id ? "bg-white/20 text-white border-white/30" : ""
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 dark:text-gray-400 px-2 py-2">Paramètres</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="w-full">
                      <button
                        onClick={() => onSectionChange("preferences")}
                        className="flex items-center gap-3 px-3 py-2 w-full text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Préférences</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="w-full">
                      <a href="#" className="flex items-center gap-3 px-3 py-2">
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Aide & Support</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80">
        <div className="flex items-center gap-3 px-4 py-4">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
              AI
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Créateur Inspiré</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Niveau: Artiste</p>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
