"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Sparkles, Copy, Download, Wand2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function WritingAssistantSection() {
  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Assistant Rédaction IA</span>
                  <Badge variant="secondary" className="text-xs">
                    Populaire
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Rédigez du{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    Contenu Captivant
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Créez des textes professionnels, créatifs et engageants en quelques clics
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Panneau de création */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-green-500" />
                      Créer du Contenu
                    </CardTitle>
                    <CardDescription>Décrivez ce que vous voulez écrire</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type de contenu</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article de blog</SelectItem>
                          <SelectItem value="email">Email marketing</SelectItem>
                          <SelectItem value="social">Post réseaux sociaux</SelectItem>
                          <SelectItem value="product">Description produit</SelectItem>
                          <SelectItem value="story">Histoire créative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sujet ou idée principale</label>
                      <Textarea
                        placeholder="Ex: Les bienfaits de la méditation pour les entrepreneurs..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ton</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professionnel</SelectItem>
                            <SelectItem value="casual">Décontracté</SelectItem>
                            <SelectItem value="creative">Créatif</SelectItem>
                            <SelectItem value="persuasive">Persuasif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Longueur</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Taille" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Court (100-200 mots)</SelectItem>
                            <SelectItem value="medium">Moyen (300-500 mots)</SelectItem>
                            <SelectItem value="long">Long (600+ mots)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer le Contenu
                    </Button>
                  </CardContent>
                </Card>

                {/* Résultat */}
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardHeader>
                    <CardTitle>Contenu Généré</CardTitle>
                    <CardDescription>Votre texte apparaîtra ici</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        Votre contenu généré apparaîtra ici. Utilisez les paramètres à gauche pour créer votre texte
                        personnalisé.
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Templates populaires */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle>Templates Populaires</CardTitle>
                  <CardDescription>Commencez avec nos modèles prêts à l'emploi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        title: "Email de Bienvenue",
                        desc: "Accueillez vos nouveaux clients",
                        color: "from-blue-500 to-purple-500",
                      },
                      {
                        title: "Post LinkedIn",
                        desc: "Engagez votre réseau professionnel",
                        color: "from-green-500 to-teal-500",
                      },
                      {
                        title: "Description Produit",
                        desc: "Vendez avec des mots qui convertissent",
                        color: "from-orange-500 to-red-500",
                      },
                    ].map((template, i) => (
                      <Card
                        key={i}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        <CardContent className="p-4">
                          <div
                            className={`w-full h-20 bg-gradient-to-r ${template.color} rounded-lg mb-3 flex items-center justify-center`}
                          >
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{template.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{template.desc}</p>
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
