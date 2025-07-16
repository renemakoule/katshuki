export function SecondaryCircuits() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-60"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M100 300 L250 300 L250 350 L400 350"
        stroke="#E5E7EB"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="3,2"
        className="dark:stroke-gray-800"
      />
      <path
        d="M100 300 L250 300 L250 350 L400 350"
        stroke="url(#gradient-small1)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="3,50"
        className="animate-circuit-flow-fast dark:animate-circuit-flow-glow-fast"
      />

      <path
        d="M1300 100 L1450 100 L1450 200 L1600 200"
        stroke="#E5E7EB"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="3,2"
        className="dark:stroke-gray-800"
      />
      <path
        d="M1300 100 L1450 100 L1450 200 L1600 200"
        stroke="url(#gradient-small2)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="3,50"
        className="animate-circuit-flow-fast dark:animate-circuit-flow-glow-fast"
        style={{ animationDelay: "1s" }}
      />

      <path
        d="M700 500 L850 500 L850 600 L1100 600"
        stroke="#E5E7EB"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="3,2"
        className="dark:stroke-gray-800"
      />
      <path
        d="M700 500 L850 500 L850 600 L1100 600"
        stroke="url(#gradient-small3)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="3,50"
        className="animate-circuit-flow-fast dark:animate-circuit-flow-glow-fast"
        style={{ animationDelay: "2s" }}
      />

      <defs>
        <linearGradient id="gradient-small1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient-small2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradient-small3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" className="dark:stop-color-bright" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
