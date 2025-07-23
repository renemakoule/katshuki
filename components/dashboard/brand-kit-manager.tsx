// components/dashboard/brand-kit-manager.tsx

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  Palette, 
  Type, 
  Image, 
  Settings, 
  Save, 
  RefreshCw, 
  Copy,
  Check,
  Sparkles,
  Wand2,
  Download,
  Share2,
  Plus
} from "lucide-react"
import { useDashboardStore } from "@/lib/stores/dashboard-store"
import { colorPalettes, fontCombinations } from "@/lib/mock-data/brand-kit"

export function BrandKitManager() {
  const {
    brandKits,
    activeBrandKit,
    setActiveBrandKit,
    updateBrandKit
  } = useDashboardStore()

  const [selectedColorPalette, setSelectedColorPalette] = useState(colorPalettes[0])
  const [selectedFontCombination, setSelectedFontCombination] = useState(fontCombinations[0])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(text)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    if (!activeBrandKit) return
    
    updateBrandKit({
      colors: {
        primary: palette.colors[0],
        secondary: palette.colors[1],
        accent: palette.colors[2],
        background: palette.colors[3],
        text: palette.colors[4]
      }
    })
  }

  const applyFontCombination = (fonts: typeof fontCombinations[0]) => {
    if (!activeBrandKit) return
    
    updateBrandKit({
      fonts: {
        heading: fonts.heading,
        body: fonts.body,
        accent: fonts.accent
      }
    })
  }

  if (!activeBrandKit) {
    return (
      <div className="h-full w-full max-w-none mx-auto p-6">
        <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Aucun Brand Kit sélectionné
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sélectionnez un Brand Kit pour commencer la personnalisation
            </p>
            <Button onClick={() => setActiveBrandKit(brandKits[0])}>
              Sélectionner un Brand Kit
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                  <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Brand Kit Manager</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Gestionnaire de{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Marque
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Personnalisez votre identité visuelle avec des couleurs, polices et styles cohérents
                </p>
              </div>

              {/* Brand Kit Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Label htmlFor="brand-kit-select">Brand Kit actuel :</Label>
                  <Select value={activeBrandKit.id} onValueChange={(value) => {
                    const selectedKit = brandKits.find(kit => kit.id === value)
                    if (selectedKit) setActiveBrandKit(selectedKit)
                  }}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brandKits.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          {kit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </div>

              {/* Current Brand Kit Preview */}
              <Card className="border border-gray-200/50 dark:border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Aperçu du Brand Kit
                  </CardTitle>
                  <CardDescription>
                    Prévisualisation de votre identité visuelle actuelle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Colors Preview */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Couleurs</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(activeBrandKit.colors).map(([name, color]) => (
                          <div key={name} className="text-center">
                            <div 
                              className="w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => copyToClipboard(color)}
                            />
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">
                              {name}
                            </div>
                            <div className="text-xs font-mono text-gray-500">
                              {color}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fonts Preview */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Typographie</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Titre</div>
                          <div 
                            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                            style={{ fontFamily: activeBrandKit.fonts.heading }}
                          >
                            {activeBrandKit.fonts.heading}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Corps</div>
                          <div 
                            className="text-base text-gray-700 dark:text-gray-300"
                            style={{ fontFamily: activeBrandKit.fonts.body }}
                          >
                            {activeBrandKit.fonts.body}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Accent</div>
                          <div 
                            className="text-sm text-gray-600 dark:text-gray-400"
                            style={{ fontFamily: activeBrandKit.fonts.accent }}
                          >
                            {activeBrandKit.fonts.accent}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customization Tabs */}
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors">Couleurs</TabsTrigger>
                  <TabsTrigger value="fonts">Polices</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="preferences">Préférences</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle>Palettes de couleurs</CardTitle>
                      <CardDescription>
                        Choisissez une palette prédéfinie ou personnalisez vos couleurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {colorPalettes.map((palette) => (
                          <Card 
                            key={palette.id} 
                            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                              selectedColorPalette.id === palette.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedColorPalette(palette)}
                          >
                            <CardContent className="p-4">
                              <div className="flex gap-1 mb-3">
                                {palette.colors.map((color, i) => (
                                  <div 
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                                {palette.name}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {palette.category}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex justify-center mt-6">
                        <Button onClick={() => applyColorPalette(selectedColorPalette)}>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Appliquer la palette
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Custom Colors */}
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle>Couleurs personnalisées</CardTitle>
                      <CardDescription>
                        Ajustez individuellement chaque couleur de votre marque
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(activeBrandKit.colors).map(([name, color]) => (
                          <div key={name} className="space-y-2">
                            <Label className="capitalize">{name}</Label>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                                style={{ backgroundColor: color }}
                              />
                              <Input 
                                type="color" 
                                value={color}
                                onChange={(e) => updateBrandKit({
                                  colors: {
                                    ...activeBrandKit.colors,
                                    [name]: e.target.value
                                  }
                                })}
                                className="w-16 h-10 p-1 border-0"
                              />
                              <Input 
                                value={color}
                                onChange={(e) => updateBrandKit({
                                  colors: {
                                    ...activeBrandKit.colors,
                                    [name]: e.target.value
                                  }
                                })}
                                className="font-mono text-sm"
                              />
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copyToClipboard(color)}
                              >
                                {copiedColor === color ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fonts" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle>Combinaisons de polices</CardTitle>
                      <CardDescription>
                        Sélectionnez des combinaisons harmonieuses pour votre marque
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {fontCombinations.map((combination) => (
                          <Card 
                            key={combination.id}
                            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                              selectedFontCombination.id === combination.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedFontCombination(combination)}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Titre</div>
                                  <div 
                                    className="text-xl font-bold text-gray-900 dark:text-gray-100"
                                    style={{ fontFamily: combination.heading }}
                                  >
                                    {combination.heading}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Corps</div>
                                  <div 
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                    style={{ fontFamily: combination.body }}
                                  >
                                    {combination.body}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    {combination.name}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {combination.category}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="flex justify-center mt-6">
                        <Button onClick={() => applyFontCombination(selectedFontCombination)}>
                          <Type className="w-4 h-4 mr-2" />
                          Appliquer les polices
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="style" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle>Paramètres de style</CardTitle>
                      <CardDescription>
                        Ajustez les propriétés visuelles de votre marque
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Arrondi des bordures</Label>
                          <Slider
                            value={[activeBrandKit.style.borderRadius]}
                            onValueChange={([value]) => updateBrandKit({
                              style: { ...activeBrandKit.style, borderRadius: value }
                            })}
                            max={24}
                            min={0}
                            step={2}
                            className="mt-2"
                          />
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activeBrandKit.style.borderRadius}px
                          </div>
                        </div>

                        <div>
                          <Label>Espacement</Label>
                          <Slider
                            value={[activeBrandKit.style.spacing]}
                            onValueChange={([value]) => updateBrandKit({
                              style: { ...activeBrandKit.style, spacing: value }
                            })}
                            max={32}
                            min={8}
                            step={2}
                            className="mt-2"
                          />
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activeBrandKit.style.spacing}px
                          </div>
                        </div>

                        <div>
                          <Label>Intensité des ombres</Label>
                          <Slider
                            value={[activeBrandKit.style.shadowIntensity * 100]}
                            onValueChange={([value]) => updateBrandKit({
                              style: { ...activeBrandKit.style, shadowIntensity: value / 100 }
                            })}
                            max={50}
                            min={0}
                            step={5}
                            className="mt-2"
                          />
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {Math.round(activeBrandKit.style.shadowIntensity * 100)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle>Préférences de marque</CardTitle>
                      <CardDescription>
                        Définissez le ton et le style de votre marque
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Ton de la marque</Label>
                          <Select 
                            value={activeBrandKit.preferences.tone} 
                            onValueChange={(value: any) => updateBrandKit({
                              preferences: { ...activeBrandKit.preferences, tone: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professionnel</SelectItem>
                              <SelectItem value="casual">Décontracté</SelectItem>
                              <SelectItem value="luxury">Luxe</SelectItem>
                              <SelectItem value="playful">Ludique</SelectItem>
                              <SelectItem value="minimalist">Minimaliste</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Secteur d'activité</Label>
                          <Input 
                            value={activeBrandKit.preferences.industry}
                            onChange={(e) => updateBrandKit({
                              preferences: { ...activeBrandKit.preferences, industry: e.target.value }
                            })}
                            placeholder="Ex: Technologie, Mode, Restauration..."
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Audience cible</Label>
                          <Input 
                            value={activeBrandKit.preferences.targetAudience}
                            onChange={(e) => updateBrandKit({
                              preferences: { ...activeBrandKit.preferences, targetAudience: e.target.value }
                            })}
                            placeholder="Ex: Jeunes professionnels, Familles, Entreprises..."
                          />
                        </div>
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
