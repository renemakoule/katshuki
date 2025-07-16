"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Lightbulb, Sparkles, Heart, Bookmark, Share2, TrendingUp, Star, Eye, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIInspirationSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full">
                <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Inspiration AI</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Découvrez l'{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
                  Inspiration Infinie
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explorez des milliers d'idées créatives générées par notre IA
              </p>
            </div>

            {/* Barre de recherche d'inspiration */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Recherchez une inspiration... (ex: logo minimaliste, affiche vintage)"
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button className="h-12 px-8 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                    <Wand2 className="w-5 h-5 mr-2" />
                    Inspirer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Catégories d'inspiration */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { name: "Design Graphique", count: "2.3k", color: "from-purple-500 to-pink-500", icon: Sparkles },
                { name: "Photographie", count: "1.8k", color: "from-blue-500 to-cyan-500", icon: Eye },
                { name: "Illustration", count: "1.5k", color: "from-green-500 to-teal-500", icon: Lightbulb },
                { name: "Tendances", count: "892", color: "from-orange-500 to-red-500", icon: TrendingUp },
              ].map((category, i) => (
                <Card
                  key={i}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-800/50"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} inspirations</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Galerie d'inspirations */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Inspirations Populaires</CardTitle>
                <CardDescription>Les créations les plus appréciées de la communauté</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card
                      key={i}
                      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-800/50"
                    >
                      <CardContent className="p-0">
                        <div
                          className={`aspect-square bg-gradient-to-br ${
                            [
                              "from-purple-400 to-pink-400",
                              "from-blue-400 to-cyan-400",
                              "from-green-400 to-teal-400",
                              "from-orange-400 to-red-400",
                            ][i % 4]
                          } rounded-t-lg flex items-center justify-center relative overflow-hidden`}
                        >
                          <Sparkles className="w-12 h-12 text-white/80" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" className="rounded-full">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="secondary" className="rounded-full">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="secondary" className="rounded-full">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {["Logo", "Poster", "Illustration", "Photo"][i % 4]}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>4.{8 + (i % 2)}</span>
                            </div>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                            Design Créatif #{i + 1}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Par IA Creative • {Math.floor(Math.random() * 100) + 50} likes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions personnalisées */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Suggestions Personnalisées
                </CardTitle>
                <CardDescription>Basées sur vos préférences et votre historique</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Tendance Minimaliste",
                      description: "Explorez le design épuré et moderne",
                      color: "from-gray-400 to-slate-500",
                      badge: "Tendance",
                    },
                    {
                      title: "Couleurs Vibrantes",
                      description: "Découvrez des palettes audacieuses",
                      color: "from-rainbow-400 to-pink-500",
                      badge: "Populaire",
                    },
                  ].map((suggestion, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-16 h-16 bg-gradient-to-r ${suggestion.color} rounded-lg flex items-center justify-center`}
                          >
                            <Lightbulb className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{suggestion.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{suggestion.description}</p>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Explorer
                            </Button>
                          </div>
                        </div>
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
