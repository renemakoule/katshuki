"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Layers, Box, Rotate3D, Move3D, Download, Share2, Sparkles, Wand2, Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ArchitectSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Architecte 3D IA</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Construisez en{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
                  Trois Dimensions
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Créez des modèles 3D architecturaux avec notre IA spécialisée
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Panneau de création 3D */}
              <Card className="bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-cyan-500" />
                    Studio 3D
                  </CardTitle>
                  <CardDescription>Configurez votre modèle 3D</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de Structure</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">Maison</SelectItem>
                        <SelectItem value="building">Immeuble</SelectItem>
                        <SelectItem value="interior">Intérieur</SelectItem>
                        <SelectItem value="landscape">Paysage</SelectItem>
                        <SelectItem value="furniture">Mobilier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Style</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Moderne</SelectItem>
                          <SelectItem value="classic">Classique</SelectItem>
                          <SelectItem value="minimalist">Minimaliste</SelectItem>
                          <SelectItem value="industrial">Industriel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Matériaux</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Matériaux" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wood">Bois</SelectItem>
                          <SelectItem value="concrete">Béton</SelectItem>
                          <SelectItem value="glass">Verre</SelectItem>
                          <SelectItem value="metal">Métal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Échelle</label>
                    <Slider defaultValue={[50]} max={100} min={10} step={5} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Petit</span>
                      <span>Moyen</span>
                      <span>Grand</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Détail</label>
                    <Slider defaultValue={[75]} max={100} min={25} step={25} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Simple</span>
                      <span>Détaillé</span>
                      <span>Ultra</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer le Modèle 3D
                  </Button>
                </CardContent>
              </Card>

              {/* Viewport 3D */}
              <Card className="bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle>Viewport 3D</CardTitle>
                  <CardDescription>Visualisez votre création</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border-2 border-dashed border-cyan-200 dark:border-cyan-800 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Box className="w-16 h-16 text-cyan-500 mx-auto" />
                      <p className="text-gray-600 dark:text-gray-400">Votre modèle 3D apparaîtra ici</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                      <Rotate3D className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                      <Move3D className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="aspect-square bg-transparent">
                      <Box className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
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
            </div>

            {/* Bibliothèque d'objets 3D */}
            <Card className="bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Bibliothèque d'Objets 3D</CardTitle>
                <CardDescription>Ajoutez des éléments à votre scène</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-6 gap-4">
                  {[
                    { name: "Chaise", color: "from-blue-500 to-cyan-500" },
                    { name: "Table", color: "from-green-500 to-teal-500" },
                    { name: "Lampe", color: "from-yellow-500 to-orange-500" },
                    { name: "Plante", color: "from-green-500 to-emerald-500" },
                    { name: "Fenêtre", color: "from-blue-500 to-indigo-500" },
                    { name: "Porte", color: "from-gray-500 to-slate-500" },
                  ].map((object, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardContent className="p-3">
                        <div
                          className={`aspect-square bg-gradient-to-r ${object.color} rounded-lg mb-2 flex items-center justify-center`}
                        >
                          <Box className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs text-center">
                          {object.name}
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
