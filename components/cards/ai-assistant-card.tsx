import { Card } from "@/components/ui/card"

export function AIAssistantCard() {
  return (
    <Card className="relative p-6 rounded-3xl border-2 border-transparent bg-gradient-to-r from-pink-200 via-orange-200 to-pink-200 p-[2px] dark:from-pink-900/30 dark:via-orange-900/30 dark:to-pink-900/30">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 h-full transition-colors">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2 transition-colors">
              Co-Pilote Créatif
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-light transition-colors">
              Votre assistant AI personnel qui vous guide pas à pas dans votre processus créatif, stimulant votre
              originalité et transformant vos idées en designs exceptionnels.
            </p>
          </div>
        </div>
        {/* Kelly tag */}
        <div className="absolute -top-2 -right-2 bg-pink-400 dark:bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors">
          Inspiration
        </div>
      </div>
    </Card>
  )
}
