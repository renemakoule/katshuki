import { AIAssistantCard } from "@/components/cards/ai-assistant-card"
import { HRTaskCard } from "@/components/cards/hr-task-card"
import { AIOperationsCard } from "@/components/cards/ai-operations-card"

export function FeatureSection() {
  return (
    <section className="relative z-10 px-8 py-16 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Two stacked cards */}
        <div className="space-y-6">
          <AIAssistantCard />
          <HRTaskCard />
        </div>

        {/* Right Column - Large Visual Card with Border Beam */}
        <AIOperationsCard />
      </div>
    </section>
  )
}
