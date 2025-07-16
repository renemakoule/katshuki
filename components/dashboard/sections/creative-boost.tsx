"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Target, Trophy, Flame, Sparkles, TrendingUp, Award, Star, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CreativeBoostSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Boost Créatif</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Boostez votre{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Créativité
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Débloquez votre potentiel créatif avec nos défis et exercices personnalisés
                </p>
              </div>

              {/* Statistiques créatives */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Streak Créatif", value: "12 jours", icon: Flame, color: "from-orange-500 to-red-500" },
                  { label: "Projets Terminés", value: "28", icon: Trophy, color: "from-yellow-500 to-orange-500" },
                  { label: "Niveau Créatif", value: "Expert", icon: Award, color: "from-purple-500 to-pink-500" },
                  { label: "Points XP", value: "2,847", icon: Star, color: "from-blue-500 to-indigo-500" },
                ].map((stat, i) => (
                  <Card key={i} className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Défis créatifs */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Défis Créatifs du Jour
                  </CardTitle>
                  <CardDescription>Relevez ces défis pour booster votre créativité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Défi Couleur",
                      description: "Créez un design en utilisant seulement 2 couleurs",
                      progress: 0,
                      xp: "150 XP",
                      difficulty: "Facile",
                      color: "from-green-500 to-teal-500",
                    },
                    {
                      title: "Défi Typographie",
                      description: "Concevez un poster en utilisant 3 polices différentes",
                      progress: 60,
                      xp: "300 XP",
                      difficulty: "Moyen",
                      color: "from-blue-500 to-purple-500",
                    },
                    {
                      title: "Défi Minimalisme",
                      description: "Créez un logo avec maximum 3 éléments",
                      progress: 100,
                      xp: "500 XP",
                      difficulty: "Expert",
                      color: "from-purple-500 to-pink-500",
                    },
                  ].map((challenge, i) => (
                    <Card key={i} className="border border-gray-200/50 dark:border-gray-800/50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{challenge.title}</h3>
                              <Badge
                                variant={
                                  challenge.difficulty === "Facile"
                                    ? "secondary"
                                    : challenge.difficulty === "Moyen"
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {challenge.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {challenge.xp}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Progression</span>
                                <span className="font-medium">{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-2" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              size="sm"
                              className={`bg-gradient-to-r ${challenge.color} hover:opacity-90`}
                              disabled={challenge.progress === 100}
                            >
                              {challenge.progress === 100
                                ? "Terminé"
                                : challenge.progress > 0
                                  ? "Continuer"
                                  : "Commencer"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Exercices créatifs */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-purple-500" />
                      Exercices Rapides
                    </CardTitle>
                    <CardDescription>5 minutes pour stimuler votre créativité</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Dessinez votre humeur actuelle",
                      "Créez un logo pour un café imaginaire",
                      "Concevez une icône pour 'bonheur'",
                      "Imaginez une affiche pour Mars",
                    ].map((exercise, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{exercise}</span>
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Go
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Progression Hebdomadaire
                    </CardTitle>
                    <CardDescription>Votre évolution créative</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Créativité</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">85%</span>
                      </div>
                      <Progress value={85} className="h-3" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Productivité</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">72%</span>
                      </div>
                      <Progress value={72} className="h-3" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Innovation</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">91%</span>
                      </div>
                      <Progress value={91} className="h-3" />
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Objectif Atteint!
                        </span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Vous avez terminé 5 projets cette semaine. Continuez comme ça!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
