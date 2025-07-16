"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, Palette, Check, Search, Star, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Palettes de couleurs inspirées d'animes/mangas
const colorPalettes = [
  {
    id: "naruto",
    name: "Naruto Uzumaki",
    description: "L'énergie du Hokage",
    colors: ["#FF6B35", "#3B82F6", "#F59E0B"],
    category: "Shonen",
    popularity: 95,
  },
  {
    id: "dragon-ball",
    name: "Dragon Ball Z",
    description: "La puissance des Saiyans",
    colors: ["#FF8C00", "#0080FF", "#FFD700"],
    category: "Shonen",
    popularity: 98,
  },
  {
    id: "one-piece",
    name: "One Piece",
    description: "L'aventure des pirates",
    colors: ["#DC2626", "#1E293B", "#F59E0B"],
    category: "Shonen",
    popularity: 97,
  },
  {
    id: "attack-titan",
    name: "Attack on Titan",
    description: "La liberté au-delà des murs",
    colors: ["#059669", "#78716C", "#65A30D"],
    category: "Seinen",
    popularity: 92,
  },
  {
    id: "demon-slayer",
    name: "Demon Slayer",
    description: "La lame qui tranche les démons",
    colors: ["#EF4444", "#1F2937", "#F97316"],
    category: "Shonen",
    popularity: 94,
  },
  {
    id: "my-hero",
    name: "My Hero Academia",
    description: "Plus Ultra!",
    colors: ["#16A34A", "#FF6B35", "#65A30D"],
    category: "Shonen",
    popularity: 89,
  },
  {
    id: "death-note",
    name: "Death Note",
    description: "Le carnet de la mort",
    colors: ["#1F2937", "#DC2626", "#374151"],
    category: "Thriller",
    popularity: 91,
  },
  {
    id: "sailor-moon",
    name: "Sailor Moon",
    description: "Au nom de la Lune",
    colors: ["#EC4899", "#60A5FA", "#F472B6"],
    category: "Magical Girl",
    popularity: 88,
  },
  {
    id: "evangelion",
    name: "Evangelion",
    description: "L'impact final",
    colors: ["#7C3AED", "#16A34A", "#A855F7"],
    category: "Mecha",
    popularity: 90,
  },
  {
    id: "bleach",
    name: "Bleach",
    description: "Shinigami et Hollows",
    colors: ["#F8FAFC", "#0F172A", "#3B82F6"],
    category: "Shonen",
    popularity: 87,
  },
  {
    id: "fullmetal",
    name: "Fullmetal Alchemist",
    description: "L'alchimie de l'équivalence",
    colors: ["#F59E0B", "#DC2626", "#D97706"],
    category: "Shonen",
    popularity: 96,
  },
  {
    id: "tokyo-ghoul",
    name: "Tokyo Ghoul",
    description: "Entre humain et goule",
    colors: ["#B91C1C", "#1F2937", "#DC2626"],
    category: "Seinen",
    popularity: 85,
  },
  {
    id: "jujutsu-kaisen",
    name: "Jujutsu Kaisen",
    description: "Exorcisme moderne",
    colors: ["#2563EB", "#1F2937", "#6366F1"],
    category: "Shonen",
    popularity: 93,
  },
  {
    id: "hunter-hunter",
    name: "Hunter x Hunter",
    description: "La chasse aux trésors",
    colors: ["#16A34A", "#EAB308", "#84CC16"],
    category: "Shonen",
    popularity: 95,
  },
  {
    id: "akira",
    name: "Akira",
    description: "Neo-Tokyo cyberpunk",
    colors: ["#EF4444", "#1F2937", "#F87171"],
    category: "Cyberpunk",
    popularity: 89,
  },
  {
    id: "ghost-shell",
    name: "Ghost in the Shell",
    description: "Cyborg et conscience",
    colors: ["#06B6D4", "#7C3AED", "#0EA5E9"],
    category: "Cyberpunk",
    popularity: 86,
  },
  {
    id: "spirited-away",
    name: "Spirited Away",
    description: "Le voyage de Chihiro",
    colors: ["#059669", "#F59E0B", "#84CC16"],
    category: "Ghibli",
    popularity: 99,
  },
  {
    id: "mononoke",
    name: "Princess Mononoke",
    description: "L'esprit de la forêt",
    colors: ["#166534", "#92400E", "#65A30D"],
    category: "Ghibli",
    popularity: 94,
  },
  {
    id: "cowboy-bebop",
    name: "Cowboy Bebop",
    description: "Space cowboys",
    colors: ["#F59E0B", "#1F2937", "#D97706"],
    category: "Space Western",
    popularity: 92,
  },
  {
    id: "violet-evergarden",
    name: "Violet Evergarden",
    description: "Lettres d'émotion",
    colors: ["#8B5CF6", "#F59E0B", "#C084FC"],
    category: "Drama",
    popularity: 88,
  },
  {
    id: "your-name",
    name: "Your Name",
    description: "Connexion temporelle",
    colors: ["#60A5FA", "#EC4899", "#93C5FD"],
    category: "Romance",
    popularity: 96,
  },
  {
    id: "weathering",
    name: "Weathering With You",
    description: "Fille de la pluie",
    colors: ["#1E40AF", "#EAB308", "#3B82F6"],
    category: "Romance",
    popularity: 90,
  },
  {
    id: "ghibli",
    name: "Studio Ghibli",
    description: "Magie douce",
    colors: ["#16A34A", "#FEF3C7", "#84CC16"],
    category: "Ghibli",
    popularity: 97,
  },
  {
    id: "mob-psycho",
    name: "Mob Psycho 100",
    description: "Pouvoirs psychiques",
    colors: ["#2563EB", "#F8FAFC", "#60A5FA"],
    category: "Supernatural",
    popularity: 91,
  },
  {
    id: "one-punch",
    name: "One Punch Man",
    description: "Héros pour le fun",
    colors: ["#EAB308", "#EF4444", "#F59E0B"],
    category: "Superhero",
    popularity: 93,
  },
  {
    id: "fire-force",
    name: "Fire Force",
    description: "Flammes purificatrices",
    colors: ["#F97316", "#1F2937", "#FB923C"],
    category: "Shonen",
    popularity: 84,
  },
  {
    id: "dr-stone",
    name: "Dr. Stone",
    description: "Science et civilisation",
    colors: ["#16A34A", "#F8FAFC", "#84CC16"],
    category: "Sci-Fi",
    popularity: 87,
  },
  {
    id: "promised-neverland",
    name: "The Promised Neverland",
    description: "Évasion de l'orphelinat",
    colors: ["#FF6B35", "#059669", "#F97316"],
    category: "Thriller",
    popularity: 89,
  },
  {
    id: "chainsaw-man",
    name: "Chainsaw Man",
    description: "Démon tronçonneuse",
    colors: ["#DC2626", "#EAB308", "#F97316"],
    category: "Seinen",
    popularity: 92,
  },
  {
    id: "spy-family",
    name: "Spy x Family",
    description: "Famille d'espions",
    colors: ["#EC4899", "#059669", "#F472B6"],
    category: "Comedy",
    popularity: 95,
  },
  {
    id: "haikyuu",
    name: "Haikyuu!!",
    description: "Volleyball passionné",
    colors: ["#FF6B35", "#1F2937", "#F97316"],
    category: "Sports",
    popularity: 94,
  },
  {
    id: "kuroko",
    name: "Kuroko's Basketball",
    description: "Basket miraculeux",
    colors: ["#2563EB", "#F8FAFC", "#60A5FA"],
    category: "Sports",
    popularity: 88,
  },
  {
    id: "food-wars",
    name: "Food Wars",
    description: "Bataille culinaire",
    colors: ["#EF4444", "#F59E0B", "#F97316"],
    category: "Cooking",
    popularity: 86,
  },
  {
    id: "black-clover",
    name: "Black Clover",
    description: "Magie et détermination",
    colors: ["#1F2937", "#16A34A", "#65A30D"],
    category: "Shonen",
    popularity: 83,
  },
  {
    id: "fairy-tail",
    name: "Fairy Tail",
    description: "Guilde magique",
    colors: ["#EC4899", "#2563EB", "#F472B6"],
    category: "Shonen",
    popularity: 85,
  },
  {
    id: "seven-sins",
    name: "Seven Deadly Sins",
    description: "Péchés capitaux",
    colors: ["#059669", "#F59E0B", "#84CC16"],
    category: "Shonen",
    popularity: 82,
  },
  {
    id: "overlord",
    name: "Overlord",
    description: "Seigneur squelette",
    colors: ["#1F2937", "#F59E0B", "#92400E"],
    category: "Isekai",
    popularity: 87,
  },
  {
    id: "re-zero",
    name: "Re:Zero",
    description: "Retour à zéro",
    colors: ["#2563EB", "#F8FAFC", "#60A5FA"],
    category: "Isekai",
    popularity: 91,
  },
  {
    id: "konosuba",
    name: "KonoSuba",
    description: "Comédie isekai",
    colors: ["#2563EB", "#EAB308", "#60A5FA"],
    category: "Isekai",
    popularity: 89,
  },
  {
    id: "slime",
    name: "That Time I Got Reincarnated as a Slime",
    description: "Slime tout-puissant",
    colors: ["#2563EB", "#9CA3AF", "#60A5FA"],
    category: "Isekai",
    popularity: 88,
  },
  {
    id: "goblin-slayer",
    name: "Goblin Slayer",
    description: "Chasseur de gobelins",
    colors: ["#166534", "#6B7280", "#65A30D"],
    category: "Dark Fantasy",
    popularity: 81,
  },
  {
    id: "shield-hero",
    name: "The Rising of the Shield Hero",
    description: "Héros du bouclier",
    colors: ["#059669", "#FF6B35", "#84CC16"],
    category: "Isekai",
    popularity: 86,
  },
  {
    id: "sao",
    name: "Sword Art Online",
    description: "Réalité virtuelle",
    colors: ["#2563EB", "#1F2937", "#1E40AF"],
    category: "Sci-Fi",
    popularity: 84,
  },
  {
    id: "no-game",
    name: "No Game No Life",
    description: "Monde de jeux",
    colors: ["#7C3AED", "#EC4899", "#C084FC"],
    category: "Isekai",
    popularity: 90,
  },
  {
    id: "steins-gate",
    name: "Steins;Gate",
    description: "Machine temporelle",
    colors: ["#059669", "#F8FAFC", "#16A34A"],
    category: "Sci-Fi",
    popularity: 96,
  },
  {
    id: "code-geass",
    name: "Code Geass",
    description: "Pouvoir du roi",
    colors: ["#7C3AED", "#F59E0B", "#A855F7"],
    category: "Mecha",
    popularity: 93,
  },
  {
    id: "fate",
    name: "Fate Series",
    description: "Guerre du Saint Graal",
    colors: ["#2563EB", "#EF4444", "#6366F1"],
    category: "Action",
    popularity: 91,
  },
  {
    id: "monogatari",
    name: "Monogatari Series",
    description: "Histoires étranges",
    colors: ["#EF4444", "#1F2937", "#DC2626"],
    category: "Supernatural",
    popularity: 88,
  },
  {
    id: "jojo",
    name: "JoJo's Bizarre Adventure",
    description: "Aventures bizarres",
    colors: ["#F59E0B", "#7C3AED", "#FBBF24"],
    category: "Adventure",
    popularity: 94,
  },
  {
    id: "berserk",
    name: "Berserk",
    description: "Épée noire",
    colors: ["#0F172A", "#7F1D1D", "#374151"],
    category: "Dark Fantasy",
    popularity: 97,
  },
]

export function PreferencesSection() {
  const [selectedPalette, setSelectedPalette] = useState("naruto")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "Shonen", "Seinen", "Ghibli", "Isekai", "Sci-Fi", "Romance", "Sports", "Cyberpunk"]

  const filteredPalettes = colorPalettes.filter((palette) => {
    const matchesSearch =
      palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      palette.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || palette.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handlePaletteSelect = (paletteId: string) => {
    setSelectedPalette(paletteId)
    // Appliquer la palette à l'interface
    document.documentElement.className = `palette-${paletteId}`
  }

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full">
                <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Préférences</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Personnalisez votre{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Expérience
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Choisissez une palette de couleurs inspirée de vos animes préférés
              </p>
            </div>

            {/* Recherche et filtres */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une palette... (ex: Naruto, Dragon Ball)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="bg-transparent"
                      >
                        {category === "all" ? "Toutes" : category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Palette actuellement sélectionnée */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  Palette Actuelle
                </CardTitle>
                <CardDescription>Votre thème de couleurs sélectionné</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const currentPalette = colorPalettes.find((p) => p.id === selectedPalette)
                  return currentPalette ? (
                    <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex gap-3">
                        {currentPalette.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {currentPalette.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{currentPalette.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="px-3 py-1">
                            {currentPalette.category}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {currentPalette.popularity}% de popularité
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">Sélectionnée</span>
                      </div>
                    </div>
                  ) : null
                })()}
              </CardContent>
            </Card>

            {/* Grille des palettes */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Palettes Disponibles</span>
                  <Badge variant="outline" className="px-3 py-1">
                    {filteredPalettes.length} palettes
                  </Badge>
                </CardTitle>
                <CardDescription>Cliquez sur une palette pour l'appliquer à votre interface</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPalettes.map((palette) => (
                    <Card
                      key={palette.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                        selectedPalette === palette.id
                          ? "border-purple-500 ring-4 ring-purple-200 dark:ring-purple-800 shadow-xl"
                          : "border-gray-200/50 dark:border-gray-800/50 hover:border-purple-300 dark:hover:border-purple-600"
                      }`}
                      onClick={() => handlePaletteSelect(palette.id)}
                    >
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          {/* Aperçu des couleurs */}
                          <div className="relative">
                            <div className="flex gap-2 mb-3">
                              {palette.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-12 rounded-lg shadow-md border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            {selectedPalette === palette.id && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Informations */}
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                                {palette.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {palette.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                                {palette.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  {palette.popularity}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Aperçu des changements */}
            <Card className="border border-gray-200/50 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Aperçu des Changements
                </CardTitle>
                <CardDescription>Voyez comment votre palette affecte l'interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Boutons Principaux</h4>
                    <Button className="w-full bg-palette-primary hover:bg-palette-primary/90 text-white shadow-lg">
                      Exemple de Bouton
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Boutons Secondaires</h4>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-palette-secondary text-palette-secondary hover:bg-palette-secondary hover:text-white bg-transparent shadow-lg"
                    >
                      Bouton Secondaire
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Accents</h4>
                    <div className="p-4 bg-palette-accent/10 border-2 border-palette-accent rounded-lg shadow-lg">
                      <span className="text-palette-accent font-semibold">Texte d'accent</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    💡 <strong>Astuce :</strong> Les changements de couleurs s'appliquent immédiatement à votre
                    interface. Vous pouvez changer de palette à tout moment dans les préférences.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
