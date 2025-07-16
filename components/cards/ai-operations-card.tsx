import { Card } from "@/components/ui/card"
import { BorderBeam } from "@/components/ui/border-beam"

export function AIOperationsCard() {
  return (
    <Card className="p-8 rounded-3xl border-gray-200 dark:border-gray-800 dark:bg-gray-900 relative overflow-hidden">
      
      <div className="text-center relative z-20">
        {/* Robot Illustration */}
        <div className="relative mb-8">
          {/* Platform */}
          <div className="mx-auto w-32 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full transform -translate-y-1"></div>
          </div>

          {/* Robot */}
          <div className="relative -mt-4 mx-auto w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors">
            <div className="w-12 h-8 bg-slate-800 dark:bg-slate-900 rounded-lg flex items-center justify-center transition-colors">
              <div className="w-2 h-2 bg-pink-400 rounded-full mr-1"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Connection lines and cubes */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded transform rotate-45 transition-colors"></div>
          <div className="absolute top-12 right-12 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded transform rotate-45 transition-colors"></div>
          <div className="absolute bottom-4 left-16 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded transform rotate-45 transition-colors"></div>

          {/* Dashed lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
            <path
              d="M50 100 L150 80"
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              className="dark:stroke-gray-600 transition-colors"
            />
            <path
              d="M250 100 L150 80"
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              className="dark:stroke-gray-600 transition-colors"
            />
            <path
              d="M150 140 L120 180"
              stroke="#d1d5db"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              className="dark:stroke-gray-600 transition-colors"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-black dark:text-white leading-tight font-medium transition-colors">
          Libérez votre créativité
          <br />
          avec votre Co-Pilote AI
        </h3>
      </div>

      <BorderBeam
        duration={6}
        size={700}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={700}
        borderWidth={8}
        className="from-transparent via-blue-500 to-transparent"
      />
    </Card>
  )
}
