"use client"
import { useEffect, useState } from "react"
import { BackgroundLayers } from "@/components/background/background-layers"
import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/sections/hero-section"
import { FeatureSection } from "@/components/sections/feature-section"
// Importez le composant (même s'il est renommé, le chemin reste le même)
import CreativeBackground from "@/components/component"
import { CreativeStudio } from "@/components/sections/creative-studio"
import ImageMask from "@/components/image-mask"
import { SplashCursor } from "@/components/splash-cursor"


export default function LandingPage() {
  // État pour gérer le montage côté client
  const [mounted, setMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100/10 dark:bg-gray-950 relative overflow-hidden transition-colors duration-300">
      {/* Arrière-plan sophistiqué multicouche avec lumières animées */}
      <BackgroundLayers />

      {/* NOUVEAU: Arrière-plan créatif avec formes colorées et découpées */}
      <CreativeBackground
        // Ces classes le transforment en arrière-plan
        className="absolute inset-0 z-0 opacity-20 dark:opacity-30"
      />

      {/* Header fixe */}
      <Header mounted={mounted} />

      <SplashCursor />

      {/* Contenu principal avec padding-top et z-index pour être au premier plan */}
      <div className="pt-20 relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Feature Section */}
        <FeatureSection />

        {/* Creative Studio Section */}
        {/* <CreativeStudio /> */}
        
      </div>
    </div>
  )
}