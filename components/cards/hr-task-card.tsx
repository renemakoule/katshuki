import { Card } from "@/components/ui/card"

export function HRTaskCard() {
  return (
    <Card className="p-6 rounded-3xl border-gray-200 dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center transition-colors">
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-2 transition-colors">
            Accompagnement Personnalisé
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-light transition-colors">
            Votre Co-Pilote AI vous accompagne à chaque étape de votre processus créatif, vous offrant des suggestions
            intelligentes et adaptées à votre style unique.
          </p>
        </div>
      </div>
    </Card>
  )
}
