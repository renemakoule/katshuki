"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Play, Upload, Download, Sparkles, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function VideoCreatorSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full">
                <Video className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Créateur de Vidéos IA</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Créez des{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                  Vidéos Époustouflantes
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Transformez vos idées en vidéos professionnelles avec notre IA créative
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Panneau de création */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-orange-500" />
                    Nouveau Projet Vidéo
                  </CardTitle>
                  <CardDescription>Configurez votre vidéo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de vidéo</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promo">Vidéo promotionnelle</SelectItem>
                        <SelectItem value="tutorial">Tutoriel</SelectItem>
                        <SelectItem value="social">Contenu social</SelectItem>
                        <SelectItem value="presentation">Présentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                          <SelectItem value="9:16">9:16 (Stories)</SelectItem>
                          <SelectItem value="1:1">1:1 (Instagram)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Durée</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Durée" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15s">15 secondes</SelectItem>
                          <SelectItem value="30s">30 secondes</SelectItem>
                          <SelectItem value="60s">1 minute</SelectItem>
                          <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full h-20 border-dashed bg-transparent">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Importer vos médias</p>
                      </div>
                    </Button>

                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer la Vidéo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Aperçu */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                  <CardDescription>Prévisualisez votre création</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">Votre vidéo apparaîtra ici</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Play className="w-4 h-4 mr-2" />
                      Aperçu
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Templates vidéo */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Templates Vidéo</CardTitle>
                <CardDescription>Commencez avec nos modèles professionnels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: "Promo Produit", color: "from-blue-500 to-purple-500" },
                    { title: "Intro YouTube", color: "from-red-500 to-pink-500" },
                    { title: "Story Instagram", color: "from-purple-500 to-indigo-500" },
                    { title: "Pub Facebook", color: "from-green-500 to-teal-500" },
                  ].map((template, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardContent className="p-4">
                        <div
                          className={`aspect-video bg-gradient-to-r ${template.color} rounded-lg mb-3 flex items-center justify-center`}
                        >
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-center">{template.title}</h3>
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
