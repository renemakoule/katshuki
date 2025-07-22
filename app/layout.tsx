// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
// Importez toutes vos polices depuis next/font/google
import { Space_Grotesk, Josefin_Slab, Playfair_Display, My_Soul } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SecurityProvider } from "@/components/security/security-provider"
import "./globals.css"

// Police principale (appliquée directement au body)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

// Polices secondaires (utilisées via des variables CSS)
const josefinSlab = Josefin_Slab({
  subsets: ["latin"],
  variable: '--font-josefin-slab', // Crée une variable CSS
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair-display', // Crée une autre variable CSS
})

// NOUVELLE POLICE AJOUTÉE
const mySoul = My_Soul({
  subsets: ["latin"],
  weight: "400", // La police "My Soul" n'a qu'une seule graisse (400)
  variable: '--font-my-soul', // Crée la variable CSS pour la nouvelle police
})

export const metadata: Metadata = {
  title: "KATSHUKI",
  description: "The world's first AI operating system for healthcare RCM teams",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Les variables de police sont ajoutées ici
    <html lang="en" suppressHydrationWarning className={`${josefinSlab.variable} ${playfairDisplay.variable} ${mySoul.variable}`}>
      {/* Plus besoin de <head> ou de <link> pour les polices ! */}

      <body className={josefinSlab.className}>
        <SecurityProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
            {children}
          </ThemeProvider>
        </SecurityProvider>
      </body>
    </html>
  )
}