export function CircuitLines() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Circuit principal horizontal avec animation lumineuse */}
      <path
        d="M0 200 L300 200 L300 150 L600 150 L600 250 L900 250 L900 180 L1200 180 L1200 300 L1500 300 L1500 220 L1920 220"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M0 200 L300 200 L300 150 L600 150 L600 250 L900 250 L900 180 L1200 180 L1200 300 L1500 300 L1500 220 L1920 220"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,200"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "15s" }}
      />

      {/* Circuit vertical gauche avec animation lumineuse */}
      <path
        d="M150 0 L150 200 L200 200 L200 400 L250 400 L250 600 L300 600 L300 800 L350 800 L350 1080"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M150 0 L150 200 L200 200 L200 400 L250 400 L250 600 L300 600 L300 800 L350 800 L350 1080"
        stroke="url(#gradient2)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,200"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "20s", animationDelay: "2s" }}
      />

      {/* Circuit diagonal complexe avec animation lumineuse */}
      <path
        d="M400 100 L500 100 L500 200 L700 200 L700 120 L800 120 L800 280 L1000 280 L1000 160 L1100 160"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M400 100 L500 100 L500 200 L700 200 L700 120 L800 120 L800 280 L1000 280 L1000 160 L1100 160"
        stroke="url(#gradient3)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,150"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "12s", animationDelay: "1s" }}
      />

      {/* Circuit vertical droit avec animation lumineuse */}
      <path
        d="M1600 0 L1600 180 L1550 180 L1550 350 L1700 350 L1700 500 L1650 500 L1650 700 L1750 700 L1750 1080"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M1600 0 L1600 180 L1550 180 L1550 350 L1700 350 L1700 500 L1650 500 L1650 700 L1750 700 L1750 1080"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,200"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "18s", animationDelay: "3s" }}
      />

      {/* Circuits secondaires avec animation lumineuse */}
      <path
        d="M800 400 L900 400 L900 500 L1200 500 L1200 450 L1400 450"
        stroke="#E5E7EB"
        strokeWidth="1"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M800 400 L900 400 L900 500 L1200 500 L1200 450 L1400 450"
        stroke="url(#gradient2)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,100"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "10s", animationDelay: "4s" }}
      />

      <path
        d="M500 600 L600 600 L600 700 L800 700 L800 650 L1000 650"
        stroke="#E5E7EB"
        strokeWidth="1"
        fill="none"
        className="dark:stroke-gray-800"
      />
      <path
        d="M500 600 L600 600 L600 700 L800 700 L800 650 L1000 650"
        stroke="url(#gradient3)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5,100"
        className="animate-circuit-flow dark:animate-circuit-flow-glow"
        style={{ animationDuration: "8s", animationDelay: "2s" }}
      />

      {/* Définition des gradients pour les animations lumineuses */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
          <stop offset="50%" stopColor="#4F46E5" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
          <stop offset="50%" stopColor="#EC4899" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
