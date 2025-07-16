import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative z-10 text-center px-8 py-16">
      <h1 className="text-6xl md:text-7xl font-bold text-black dark:text-white leading-tight mb-6 tracking-tight hero-text text-center">
        <span className="hero-word">Augmentez Votre Créativité</span>
        <br />
        <span className="hero-word" style={{ animationDelay: "0.3s" }}>
          Sans Limites
        </span>
        {/*<br />
        <span className="hero-word" style={{ animationDelay: "0.6s" }}>
          
        </span>*/}
      </h1>

      <p className="text-xl bg-clip-text text-transparent bg-gray-900 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light transition-colors">
        Le premier Co-Pilote AI qui vous guide pas à pas dans votre processus créatif
      </p>

      <Link href="/dashboard">
        <Button className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
          Commencer l'Aventure
        </Button>
      </Link>
    </section>
  )
}
