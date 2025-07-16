"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sparkles,
  Plus,
  Palette,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Megaphone,
  UtensilsCrossed,
  Search,
  UserCircle,
  Contact,
  Gift,
  Briefcase,
  Video,
  Music,
  FileText,
  Lightbulb,
  Paintbrush,
  Users,
  Play,
  Settings2,
  Filter,
} from "lucide-react"

import { ImageGeneratorSection } from "./sections/image-generator"
import { WritingAssistantSection } from "./sections/writing-assistant"
import { VideoCreatorSection } from "./sections/video-creator"
import { MusicComposerSection } from "./sections/music-composer"
import { GraphicDesignerSection } from "./sections/graphic-designer"
import { ArchitectSection } from "./sections/3d-architect"
import { AIInspirationSection } from "./sections/ai-inspiration"
import { CreativeBoostSection } from "./sections/creative-boost"
import { InnovationLabSection } from "./sections/innovation-lab"
// Ajoutez cet import en haut du fichier
import { PreferencesSection } from "./sections/preferences"

interface DashboardContentProps {
  activeSection: string
}

// Catégories de filtrage
const filterCategories = [
  {
    id: "all",
    name: "Tout",
    icon: Filter,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "design",
    name: "Design",
    icon: Paintbrush,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "professional",
    name: "Pro",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "social",
    name: "Social",
    icon: Users,
    color: "from-green-500 to-teal-500",
  },
  {
    id: "media",
    name: "Média",
    icon: Play,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "services",
    name: "Services",
    icon: Settings2,
    color: "from-cyan-500 to-blue-500",
  },
]

// NOUVEAU TABLEAU COMPLET DES ACTIONS DE CRÉATION
const creationActions = [
  {
    title: "Flyer d'Événement",
    description: "Annoncez vos concerts, fêtes et promotions.",
    icon: Megaphone,
    color: "from-yellow-500 to-orange-500",
    badge: "Populaire",
    category: "design",
  },
  {
    title: "Visuel Publicitaire",
    description: "Générez des pubs percutantes pour les réseaux sociaux.",
    icon: TrendingUp,
    color: "from-green-500 to-teal-500",
    category: "design",
  },
  {
    title: "Menu de Restaurant",
    description: "Créez des cartes élégantes pour vos plats et boissons.",
    icon: UtensilsCrossed,
    color: "from-orange-500 to-red-500",
    category: "services",
  },
  {
    title: "Photo de Profil & Avatar",
    description: "Créez une image pro ou artistique pour vos profils.",
    icon: UserCircle,
    color: "from-cyan-500 to-blue-500",
    badge: "Populaire",
    category: "social",
  },
  {
    title: "Carte de Visite",
    description: "Concevez une carte professionnelle pour votre réseau.",
    icon: Contact,
    color: "from-indigo-500 to-violet-500",
    category: "professional",
  },
  {
    title: "Rédiger du Contenu",
    description: "Créez des textes captivants et originaux",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    badge: "Nouveau",
    category: "media",
  },
  {
    title: "Composer de la Musique",
    description: "Créez des mélodies inspirantes",
    icon: Music,
    color: "from-purple-500 to-pink-500",
    badge: "Beta",
    category: "media",
  },
  {
    title: "Monter une Vidéo",
    description: "Assemblez des vidéos créatives",
    icon: Video,
    color: "from-orange-500 to-red-500",
    category: "media",
  },
  {
    title: "CV Professionnel",
    description: "Créez un CV moderne et percutant pour votre carrière.",
    icon: Briefcase,
    color: "from-blue-600 to-indigo-600",
    badge: "Nouveau",
    category: "professional",
  },
  {
    title: "Fiche Produit",
    description: "Mettez en valeur vos articles pour la vente.",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    category: "professional",
  },
  {
    title: "Carte d'Anniversaire",
    description: "Célébrez vos proches avec une carte personnalisée.",
    icon: Gift,
    color: "from-pink-500 to-rose-500",
    category: "social",
  },
  {
    title: "Avis de Recherche",
    description: "Diffusez une alerte pour un animal, objet, etc.",
    icon: Search,
    color: "from-gray-500 to-slate-600",
    category: "services",
  },
]

export function DashboardContent({ activeSection }: DashboardContentProps) {
  const getSectionTitle = (section: string) => {
    switch (section) {
      case "recent-projects":
        return "Projets Récents"
      case "inspirations":
        return "Inspirations"
      case "copilot":
        return "Co-Pilote Créatif"
      case "ai-inspiration":
        return "Inspiration AI"
      case "creative-boost":
        return "Boost Créatif"
      case "innovation-lab":
        return "Innovation Lab"
      case "image-generator":
        return "Générateur d'Images"
      case "writing-assistant":
        return "Assistant Rédaction"
      case "video-creator":
        return "Créateur de Vidéos"
      case "music-composer":
        return "Compositeur Musical"
      case "graphic-designer":
        return "Designer Graphique"
      case "3d-architect":
        return "Architecte 3D"
      // Dans la fonction getSectionTitle, ajoutez :
      case "preferences":
        return "Préférences"
      default:
        return "Co-Pilote Créatif"
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "recent-projects":
        return <RecentProjectsContent />
      case "inspirations":
        return <InspirationsContent />
      case "image-generator":
        return <ImageGeneratorSection />
      case "writing-assistant":
        return <WritingAssistantSection />
      case "video-creator":
        return <VideoCreatorSection />
      case "music-composer":
        return <MusicComposerSection />
      case "graphic-designer":
        return <GraphicDesignerSection />
      case "3d-architect":
        return <ArchitectSection />
      case "ai-inspiration":
        return <AIInspirationSection />
      case "creative-boost":
        return <CreativeBoostSection />
      case "innovation-lab":
        return <InnovationLabSection />
      // Dans la fonction renderContent, ajoutez :
      case "preferences":
        return <PreferencesSection />
      case "copilot":
      default:
        return <DefaultDashboardContent />
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-transparent">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200/50 dark:border-gray-800/50 px-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#" className="text-gray-600 dark:text-gray-400">
                Studio Créatif
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 dark:text-gray-100 font-medium">
                {getSectionTitle(activeSection)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  )
}

function DefaultDashboardContent() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredActions =
    activeFilter === "all" ? creationActions : creationActions.filter((action) => action.category === activeFilter)

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Votre Co-Pilote Créatif est prêt
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Libérez votre{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Créativité
                </span>
              </h1>
            </div>

            <div className="space-y-6">
              {/* Boutons de filtrage par catégorie */}
              <div className="flex flex-wrap justify-center gap-3 pb-4">
                {filterCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeFilter === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(category.id)}
                    className={`gap-2 transition-all duration-300 ${
                      activeFilter === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                        : "bg-transparent hover:scale-105"
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Plus className="w-4 h-4" />
                  Commencer un projet
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredActions.length} outil{filteredActions.length > 1 ? "s" : ""} disponible
                  {filteredActions.length > 1 ? "s" : ""}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {filteredActions.map((action, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-800/50 hover:scale-105 hover:border-purple-200 dark:hover:border-purple-800"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        {action.badge && (
                          <Badge
                            variant={
                              action.badge === "Nouveau"
                                ? "default"
                                : action.badge === "Populaire"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 dark:bg-gray-700 dark:hover:bg-gradient-to-r transition-all duration-300">
                        Commencer
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function RecentProjectsContent() {
  const recentProjects = [
    {
      title: "Campagne Publicitaire",
      type: "Design Graphique",
      progress: 85,
      lastModified: "Il y a 2h",
      status: "En cours",
    },
    {
      title: "CV pour poste de Développeur",
      type: "Document Professionnel",
      progress: 95,
      lastModified: "Il y a 3h",
      status: "Finalisé",
    },
    {
      title: "Avatar pour LinkedIn",
      type: "Portrait IA",
      progress: 100,
      lastModified: "Hier",
      status: "Terminé",
    },
  ]

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Projets Récents</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Continuez là où vous{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  vous êtes arrêté
                </span>
              </h1>
            </div>

            <div className="space-y-6">
              {recentProjects.map((project, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-800/50 hover:scale-105 hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
                          <Badge
                            variant={
                              project.status === "En cours"
                                ? "default"
                                : project.status === "Finalisé"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{project.type}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{project.lastModified}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-3 ml-6">
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-gray-700 dark:text-gray-300 min-w-[3rem]">
                            {project.progress}%
                          </span>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Continuer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

function InspirationsContent() {
  const inspirations = [
    {
      title: "Tendances Design 2024",
      category: "Design",
      views: "2.3k",
      rating: 4.8,
    },
    {
      title: "Palettes Couleurs Modernes",
      category: "Couleurs",
      views: "1.8k",
      rating: 4.9,
    },
    {
      title: "Typographies Créatives",
      category: "Typographie",
      views: "1.2k",
      rating: 4.7,
    },
  ]

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-full">
                <Lightbulb className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Inspirations</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Découvrez les{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-orange-600">
                  dernières tendances
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirations.map((inspiration, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-800/50 hover:scale-105 hover:border-pink-200 dark:hover:border-pink-800"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="w-full h-32 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                        <Palette className="w-12 h-12 text-pink-600 dark:text-pink-400" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{inspiration.title}</h3>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {inspiration.category}
                          </Badge>
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <TrendingUp className="w-3 h-3" />
                              <span>{inspiration.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{inspiration.rating}</span>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full bg-pink-600 hover:bg-pink-700">Explorer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
