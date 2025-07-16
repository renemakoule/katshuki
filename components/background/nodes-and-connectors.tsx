export function NodesAndConnectors() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
      {/* Nœuds circulaires vides avec pulsation */}
      <circle cx="300" cy="200" r="4" fill="none" stroke="#E5E7EB" strokeWidth="1.5" className="dark:stroke-gray-700" />
      <circle
        cx="300"
        cy="200"
        r="4"
        fill="none"
        stroke="#4F46E5"
        strokeWidth="1.5"
        className="animate-pulse-slow dark:animate-pulse-glow"
      />

      <circle cx="600" cy="150" r="4" fill="none" stroke="#E5E7EB" strokeWidth="1.5" className="dark:stroke-gray-700" />
      <circle
        cx="600"
        cy="150"
        r="4"
        fill="none"
        stroke="#EC4899"
        strokeWidth="1.5"
        className="animate-pulse-slow dark:animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      <circle cx="900" cy="250" r="4" fill="none" stroke="#E5E7EB" strokeWidth="1.5" className="dark:stroke-gray-700" />
      <circle
        cx="900"
        cy="250"
        r="4"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="1.5"
        className="animate-pulse-slow dark:animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <circle
        cx="1200"
        cy="180"
        r="4"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="1.5"
        className="dark:stroke-gray-700"
      />
      <circle
        cx="1200"
        cy="180"
        r="4"
        fill="none"
        stroke="#10B981"
        strokeWidth="1.5"
        className="animate-pulse-slow dark:animate-pulse-glow"
        style={{ animationDelay: "3s" }}
      />

      {/* Capsules/pilules pleines avec lueur */}
      <rect
        x="296"
        y="148"
        width="8"
        height="4"
        rx="2"
        fill="#2D3A54"
        className="glow-effect dark:glow-effect-bright"
      />
      <rect
        x="596"
        y="248"
        width="8"
        height="4"
        rx="2"
        fill="#2D3A54"
        className="glow-effect dark:glow-effect-bright"
        style={{ animationDelay: "1s" }}
      />
      <rect
        x="896"
        y="178"
        width="8"
        height="4"
        rx="2"
        fill="#2D3A54"
        className="glow-effect dark:glow-effect-bright"
        style={{ animationDelay: "2s" }}
      />
      <rect
        x="1196"
        y="298"
        width="8"
        height="4"
        rx="2"
        fill="#2D3A54"
        className="glow-effect dark:glow-effect-bright"
        style={{ animationDelay: "3s" }}
      />
    </svg>
  )
}
