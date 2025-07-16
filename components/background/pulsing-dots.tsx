export function PulsingDots() {
  const dots = [
    { className: "top-48 left-72 w-2 h-2 bg-blue-400", delay: "0s" },
    { className: "top-80 right-96 w-1.5 h-1.5 bg-purple-400", delay: "1s" },
    { className: "bottom-96 left-1/3 w-1.5 h-1.5 bg-pink-400", delay: "2s" },
    { className: "top-1/4 right-1/3 w-2 h-2 bg-green-400", delay: "3s" },
    { className: "bottom-1/3 right-1/4 w-2 h-2 bg-yellow-400", delay: "4s" },
  ]

  return (
    <>
      {dots.map((dot, index) => (
        <div
          key={index}
          className={`absolute ${dot.className} rounded-full opacity-60 animate-pulse dark:opacity-80 dark:animate-pulse-bright`}
          style={{ animationDelay: dot.delay }}
        />
      ))}
    </>
  )
}
