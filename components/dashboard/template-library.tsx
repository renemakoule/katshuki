// components/dashboard/template-library.tsx

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  Star, 
  Crown, 
  Eye,
  Download,
  Share2,
  Sparkles,
  TrendingUp
} from "lucide-react"
import { useDashboardStore } from "@/lib/stores/dashboard-store"
import { templateCategories, templateSectors, templateStyles } from "@/lib/mock-data/templates"

export function TemplateLibrary() {
  const {
    filteredTemplates,
    selectedTemplate,
    templateFilters,
    viewMode,
    analytics,
    setTemplateFilters,
    selectTemplate,
    toggleTemplateFavorite,
    setViewMode,
    searchTemplates
  } = useDashboardStore()

  const [searchQuery, setSearchQuery] = useState(templateFilters.search)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    searchTemplates(query)
  }

  const isTemplateFavorite = (templateId: string) => {
    return analytics.favoriteTemplates.includes(templateId)
  }

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Bibliothèque de Templates</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Templates{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Professionnels
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Plus de 500 templates prêts à l'emploi pour tous vos besoins créatifs
                </p>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {filteredTemplates.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Templates disponibles</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                      {analytics.favoriteTemplates.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Favoris</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {templateCategories.length - 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Catégories</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {templateSectors.length - 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Secteurs</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un template..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={templateFilters.category} onValueChange={(value) => setTemplateFilters({ category: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={templateFilters.sector} onValueChange={(value) => setTemplateFilters({ sector: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateSectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={templateFilters.style} onValueChange={(value) => setTemplateFilters({ style: value })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={templateFilters.isPremium === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTemplateFilters({ isPremium: null })}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={templateFilters.isPremium === false ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTemplateFilters({ isPremium: false })}
                    >
                      Gratuits
                    </Button>
                    <Button
                      variant={templateFilters.isPremium === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTemplateFilters({ isPremium: true })}
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Premium
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Templates Grid/List */}
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-800/50 ${
                      selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => selectTemplate(template)}
                  >
                    <CardContent className="p-0">
                      {viewMode === 'grid' ? (
                        <>
                          {/* Template Preview */}
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                            <div className="text-4xl text-gray-400">🎨</div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button size="sm" variant="secondary">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="secondary">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="secondary">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {template.isPremium && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              </div>
                            )}
                          </div>
                          
                          {/* Template Info */}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {template.name}
                              </h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleTemplateFavorite(template.id)
                                }}
                              >
                                <Heart className={`w-4 h-4 ${isTemplateFavorite(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {template.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <TrendingUp className="w-3 h-3" />
                                {template.popularity}%
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center p-4 gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                            <div className="text-xl text-gray-400">🎨</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                {template.name}
                              </h3>
                              {template.isPremium && (
                                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleTemplateFavorite(template.id)
                              }}
                            >
                              <Heart className={`w-4 h-4 ${isTemplateFavorite(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </Button>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              {template.popularity}%
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Aucun template trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  <Button onClick={() => setTemplateFilters({ category: 'all', sector: 'all', style: 'all', search: '', isPremium: null })}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
