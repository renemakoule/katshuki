"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rocket, Beaker, Lightbulb, Zap, Brain, Sparkles, Star, TrendingUp, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function InnovationLabSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full">
                  <Rocket className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Innovation Lab</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Laboratoire d'{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    Innovation
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Explorez les dernières technologies créatives et expérimentez avec des outils révolutionnaires
                </p>
              </div>

              <Tabs defaultValue="experiments" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="experiments">Expériences</TabsTrigger>
                  <TabsTrigger value="beta">Bêta</TabsTrigger>
                  <TabsTrigger value="research">Recherche</TabsTrigger>
                  <TabsTrigger value="community">Communauté</TabsTrigger>
                </TabsList>

                <TabsContent value="experiments" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: "IA Générative Avancée",
                        description: "Nouvelle génération d'IA pour la création artistique",
                        status: "Expérimental",
                        icon: Brain,
                        color: "from-purple-500 to-pink-500",
                        participants: "1.2k",
                      },
                      {
                        title: "Réalité Augmentée Créative",
                        description: "Créez dans l'espace 3D avec la RA",
                        status: "Alpha",
                        icon: Zap,
                        color: "from-blue-500 to-cyan-500",
                        participants: "856",
                      },
                      {
                        title: "Collaboration IA-Humain",
                        description: "Co-création en temps réel avec l'IA",
                        status: "Prototype",
                        icon: Lightbulb,
                        color: "from-green-500 to-teal-500",
                        participants: "2.1k",
                      },
                      {
                        title: "Génération Procédurale",
                        description: "Création automatique de contenus complexes",
                        status: "Bêta Fermée",
                        icon: Beaker,
                        color: "from-orange-500 to-red-500",
                        participants: "634",
                      },
                      {
                        title: "IA Émotionnelle",
                        description: "IA qui comprend et exprime les émotions",
                        status: "Recherche",
                        icon: Star,
                        color: "from-pink-500 to-purple-500",
                        participants: "423",
                      },
                      {
                        title: "Création Quantique",
                        description: "Algorithmes quantiques pour l'art",
                        status: "Concept",
                        icon: Sparkles,
                        color: "from-indigo-500 to-purple-500",
                        participants: "89",
                      },
                    ].map((experiment, i) => (
                      <Card
                        key={i}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-800/50"
                      >
                        <CardContent className="p-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-r ${experiment.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <experiment.icon className="w-8 h-8 text-white" />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{experiment.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {experiment.status}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {experiment.description}
                            </p>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {experiment.participants} participants
                              </span>
                              <Button size="sm" className={`bg-gradient-to-r ${experiment.color} hover:opacity-90`}>
                                Tester
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="beta" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-blue-500" />
                        Programmes Bêta Actifs
                      </CardTitle>
                      <CardDescription>Testez les nouvelles fonctionnalités avant tout le monde</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          name: "Générateur de Vidéos 4K",
                          description: "Création de vidéos haute définition avec IA",
                          progress: "Bêta Ouverte",
                          users: "5.2k testeurs",
                        },
                        {
                          name: "Assistant Vocal Créatif",
                          description: "Contrôlez vos créations par la voix",
                          progress: "Bêta Fermée",
                          users: "500 testeurs",
                        },
                        {
                          name: "Collaboration Multi-Utilisateurs",
                          description: "Créez ensemble en temps réel",
                          progress: "Alpha Privée",
                          users: "50 testeurs",
                        },
                      ].map((beta, i) => (
                        <Card key={i} className="border border-gray-200/50 dark:border-gray-800/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{beta.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {beta.progress}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{beta.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{beta.users}</p>
                              </div>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                Rejoindre
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="research" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border border-gray-200/50 dark:border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-500" />
                          Recherches en Cours
                        </CardTitle>
                        <CardDescription>Nos dernières découvertes scientifiques</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          "IA Créative et Conscience Artificielle",
                          "Algorithmes d'Inspiration Automatique",
                          "Neurosciences de la Créativité",
                          "Art Génératif Quantique",
                        ].map((research, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{research}</span>
                            <Button size="sm" variant="ghost">
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200/50 dark:border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          Publications Récentes
                        </CardTitle>
                        <CardDescription>Nos derniers articles de recherche</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          {
                            title: "L'Avenir de la Créativité Artificielle",
                            date: "15 Dec 2024",
                            reads: "2.3k lectures",
                          },
                          {
                            title: "Éthique et IA Créative",
                            date: "08 Dec 2024",
                            reads: "1.8k lectures",
                          },
                          {
                            title: "Collaboration Homme-Machine",
                            date: "01 Dec 2024",
                            reads: "3.1k lectures",
                          },
                        ].map((paper, i) => (
                          <Card key={i} className="border border-gray-200/50 dark:border-gray-800/50">
                            <CardContent className="p-4">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{paper.title}</h4>
                              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{paper.date}</span>
                                <span>{paper.reads}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="community" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-green-500" />
                        Communauté d'Innovateurs
                      </CardTitle>
                      <CardDescription>Connectez-vous avec d'autres créateurs visionnaires</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Discussions Actives</h4>
                          {[
                            "IA vs Créativité Humaine",
                            "Outils du Futur",
                            "Éthique Créative",
                            "Collaboration Globale",
                          ].map((topic, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{topic}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.floor(Math.random() * 50) + 10} messages
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">Membres Actifs</h4>
                          {[
                            { name: "Alex Chen", role: "Chercheur IA", contributions: "127" },
                            { name: "Maria Santos", role: "Designer UX", contributions: "89" },
                            { name: "David Kim", role: "Développeur", contributions: "156" },
                            { name: "Sophie Martin", role: "Artiste Digital", contributions: "203" },
                          ].map((member, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {member.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{member.role}</div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {member.contributions} contrib.
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Rocket className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Événement à Venir
                          </span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                          Hackathon Créatif IA - 20-22 Janvier 2025
                        </p>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          S'inscrire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
