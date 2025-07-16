import { CircuitLines } from "./circuit-lines"
import { SecondaryCircuits } from "./secondary-circuits"
import { DotGrid } from "./dot-grid"
import { NodesAndConnectors } from "./nodes-and-connectors"
import { PulsingDots } from "./pulsing-dots"

export function BackgroundLayers() {
  return (
    <div className="absolute inset-0">
      {/* Couche 1: Lignes de Circuit Principales */}
      <CircuitLines />

      {/* Couche 2: Lignes de Circuit Secondaires */}
      <SecondaryCircuits />

      {/* Couche 3: Grilles de Points Texturées */}
      <DotGrid
        className="absolute top-32 left-1/2 transform -translate-x-1/2 opacity-20 dark:opacity-30"
        width={384}
        height={192}
        dotCount={192}
        columns={16}
      />
      <DotGrid
        className="absolute top-1/3 left-16 opacity-15 dark:opacity-25"
        width={128}
        height={128}
        dotCount={64}
        columns={8}
      />
      <DotGrid
        className="absolute bottom-1/3 right-20 opacity-15 dark:opacity-25"
        width={160}
        height={96}
        dotCount={60}
        columns={10}
      />

      {/* Couche 4: Nœuds et Connecteurs */}
      <NodesAndConnectors />

      {/* Points lumineux pulsants */}
      <PulsingDots />
    </div>
  )
}
