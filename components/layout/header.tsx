"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import Link from "next/link"

interface HeaderProps {
  mounted: boolean
}

export function Header({ mounted }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div
        className={`fixed transition-all duration-300 ease-in-out ${
          isScrolled
            ? "mx-auto mt-4 w-fit bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-md border border-transparent dark:border-gray-700/50 shadow-lg px-6 py-2"
            : "w-full px-8 py-3"
        }`}
        style={isScrolled ? { left: "50%", transform: "translateX(-50%)" } : {}}
      >
        <div
          className={`flex items-center transition-all duration-300 ease-in-out ${
            isScrolled ? "justify-center space-x-6" : "justify-between"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-600 rounded transform rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded transform -rotate-45"></div>
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5F6D] via-[#FFC371] to-[#6A82FB]">
              Katshuki
            </span>
          </div>

          {/* Réseaux sociaux - toujours visibles */}
          <nav className="flex items-center space-x-2">
            <a
              href="#"
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="X (Twitter)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.48.204 4.955.388a7.459 7.459 0 0 0-2.7 1.757 7.459 7.459 0 0 0-1.756 2.7C.204 5.48.082 6.094.048 7.042.013 7.989 0 8.396 0 12.017c0 3.624.013 4.09.048 5.014.034.947.156 1.562.34 2.087a7.459 7.459 0 0 0 1.757 2.7 7.459 7.459 0 0 0 2.7 1.756c.525.184 1.14.306 2.087.34.924.035 1.39.048 5.014.048 3.624 0 4.09-.013 5.014-.048.947-.034 1.562-.156 2.087-.34a7.459 7.459 0 0 0 2.7-1.757 7.459 7.459 0 0 0 1.756-2.7c.184-.525.306-1.14.34-2.087.035-.924.048-1.39.048-5.014 0-3.624-.013-4.09-.048-5.014-.034-.947-.156-1.562-.34-2.087a7.459 7.459 0 0 0-1.757-2.7 7.459 7.459 0 0 0-2.7-1.756c-.525-.184-1.14-.306-2.087-.34C16.107.013 15.741 0 12.017 0zM12.017 2.163c3.204 0 3.584.012 4.85.07.3.007.8.096 1.29.25.389.123.67.27.96.004a5.297 5.297 0 0 1 1.537 1.537c.27.267.402.595.538.96.155.503.244.993.25 1.29.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.007.297-.096.787-.25 1.29-.123.389-.27.67-.538.96a5.297 5.297 0 0 1-1.537 1.537c-.267.27-.595.402-.96.538-.503.155-.993.244-1.29.25-1.265.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-.297-.007-.787-.096-1.29-.25-.389-.123-.67-.27-.96-.538a5.297 5.297 0 0 1-1.537-1.537c-.27-.267-.595-.402-.96-.538-.503-.155-.993-.244-1.29-.25-1.265-.058-1.645-.07-4.85-.07z" />
                <path d="M12.017 15.33a3.312 3.312 0 1 1 0-6.624 3.312 3.312 0 0 1 0 6.624zM12.017 7.052a4.963 4.963 0 1 0 0 9.926 4.963 4.963 0 0 0 0-9.926zM18.806 6.85a1.16 1.16 0 1 1-2.32 0 1.16 1.16 0 0 1 2.32 0z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Reddit"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
              </svg>
            </a>
          </nav>

          {/* Bouton et toggle - cachés lors du scroll */}
          <div
            className={`flex items-center space-x-4 transition-all duration-300 ease-in-out ${
              isScrolled ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            {mounted && <ThemeToggle />}
            <Link href="#">
              <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium">
                Essayer le Co-Pilote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
