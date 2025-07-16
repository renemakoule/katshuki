"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Music, Play, Pause, Download, Share2, Sparkles, Wand2, Volume2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MusicComposerSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full">
                  <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Compositeur Musical IA
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Beta
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Composez des{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                    Mélodies Magiques
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Créez des compositions musicales uniques avec notre IA créative
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Panneau de composition */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-500" />
                      Studio de Composition
                    </CardTitle>
                    <CardDescription>Configurez votre création musicale</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Genre Musical</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir le genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ambient">Ambient</SelectItem>
                            <SelectItem value="electronic">Électronique</SelectItem>
                            <SelectItem value="classical">Classique</SelectItem>
                            <SelectItem value="jazz">Jazz</SelectItem>
                            <SelectItem value="cinematic">Cinématique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Humeur</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Ambiance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="energetic">Énergique</SelectItem>
                            <SelectItem value="calm">Calme</SelectItem>
                            <SelectItem value="mysterious">Mystérieux</SelectItem>
                            <SelectItem value="uplifting">Inspirant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Tempo (BPM)</label>
                      <Slider defaultValue={[120]} max={200} min={60} step={1} className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Lent (60)</span>
                        <span>Modéré (120)</span>
                        <span>Rapide (200)</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Durée (minutes)</label>
                      <Slider defaultValue={[2]} max={10} min={0.5} step={0.5} className="w-full" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>30s</span>
                        <span>2min</span>
                        <span>10min</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Composer la Musique
                    </Button>
                  </CardContent>
                </Card>

                {/* Lecteur musical */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle>Lecteur Musical</CardTitle>
                    <CardDescription>Écoutez votre création</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                          <Music className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Votre composition apparaîtra ici</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full bg-transparent">
                          <Pause className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-gray-500" />
                        <Slider defaultValue={[70]} max={100} min={0} step={1} className="flex-1" />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          <Share2 className="w-4 h-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bibliothèque de samples */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle>Bibliothèque de Samples</CardTitle>
                  <CardDescription>Explorez nos sons et instruments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { name: "Piano Classique", color: "from-blue-500 to-purple-500" },
                      { name: "Synthé Moderne", color: "from-purple-500 to-pink-500" },
                      { name: "Guitare Acoustique", color: "from-green-500 to-teal-500" },
                      { name: "Batterie Électro", color: "from-orange-500 to-red-500" },
                    ].map((sample, i) => (
                      <Card
                        key={i}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <CardContent className="p-4">
                          <div
                            className={`aspect-square bg-gradient-to-r ${sample.color} rounded-lg mb-3 flex items-center justify-center`}
                          >
                            <Music className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-center text-sm">
                            {sample.name}
                          </h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
