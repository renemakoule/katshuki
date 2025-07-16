interface DotGridProps {
  className?: string
  width: number
  height: number
  dotCount: number
  columns: number
}

export function DotGrid({ className, width, height, dotCount, columns }: DotGridProps) {
  return (
    <div className={className} style={{ width: `${width}px`, height: `${height}px` }}>
      {Array.from({ length: dotCount }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full"
          style={{
            left: `${(i % columns) * (width / columns)}px`,
            top: `${Math.floor(i / columns) * (height / Math.ceil(dotCount / columns))}px`,
          }}
        />
      ))}
    </div>
  )
}
