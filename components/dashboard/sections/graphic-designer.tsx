"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Palette, Layers, Type, Square, Circle, Triangle, Sparkles, Wand2, Download, Share2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function GraphicDesignerSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full">
                <Palette className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Designer Graphique IA</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Créez des{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                  Designs Exceptionnels
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Concevez des visuels professionnels avec notre studio de design intelligent
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Outils de design */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-pink-500" />
                    Outils de Design
                  </CardTitle>
                  <CardDescription>Configurez votre création</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de Design</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="logo">Logo</SelectItem>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="banner">Bannière</SelectItem>
                        <SelectItem value="card">Carte</SelectItem>
                        <SelectItem value="infographic">Infographie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dimensions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Largeur" />
                      <Input placeholder="Hauteur" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Palette de Couleurs</label>
                    <div className="flex gap-2">
                      {["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"].map(
                        (color, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 ${color} rounded-full cursor-pointer border-2 border-gray-300 hover:scale-110 transition-transform`}
                          />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Formes</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                        <Square className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                        <Circle className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                        <Triangle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer le Design
                  </Button>
                </CardContent>
              </Card>

              {/* Canvas de design */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle>Canvas de Design</CardTitle>
                  <CardDescription>Votre création en temps réel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Layers className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Votre design apparaîtra ici</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Calques et propriétés */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" />
                    Calques
                  </CardTitle>
                  <CardDescription>Gérez vos éléments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Arrière-plan", "Texte principal", "Forme 1", "Icône"].map((layer, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{layer}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Type className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Templates de design */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Templates Professionnels</CardTitle>
                <CardDescription>Commencez avec nos modèles prêts à l'emploi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {[
                    { name: "Logo Moderne", color: "from-blue-500 to-purple-500" },
                    { name: "Poster Événement", color: "from-pink-500 to-red-500" },
                    { name: "Carte de Visite", color: "from-green-500 to-teal-500" },
                    { name: "Bannière Web", color: "from-orange-500 to-yellow-500" },
                    { name: "Infographie", color: "from-purple-500 to-indigo-500" },
                  ].map((template, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardContent className="p-3">
                        <div
                          className={`aspect-[4/3] bg-gradient-to-r ${template.color} rounded-lg mb-2 flex items-center justify-center`}
                        >
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs text-center">
                          {template.name}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
