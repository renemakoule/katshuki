"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Sparkles, Download, Share2, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ImageGallery } from "../galleryImage/image-gallery"

export function ImageGeneratorSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                  <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Générateur d'Images IA
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Créez des{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Images Uniques
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Transformez vos idées en images époustouflantes grâce à notre IA avancée
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Panneau de création */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-500" />
                      Créer une Image
                    </CardTitle>
                    <CardDescription>Décrivez votre vision et laissez l'IA créer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description de l'image</label>
                      <Textarea
                        placeholder="Ex: Un paysage futuriste avec des montagnes violettes et un coucher de soleil doré..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Style</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realistic">Réaliste</SelectItem>
                            <SelectItem value="artistic">Artistique</SelectItem>
                            <SelectItem value="cartoon">Cartoon</SelectItem>
                            <SelectItem value="abstract">Abstrait</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Format</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">Carré (1:1)</SelectItem>
                            <SelectItem value="portrait">Portrait (3:4)</SelectItem>
                            <SelectItem value="landscape">Paysage (4:3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer l'Image
                    </Button>
                  </CardContent>
                </Card>

                {/* Aperçu et résultats */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle>Aperçu</CardTitle>
                    <CardDescription>Votre création apparaîtra ici</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
                        <p className="text-gray-500 dark:text-gray-400">Votre image générée apparaîtra ici</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Galerie d'exemples */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardContent>
                  <ImageGallery />
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
