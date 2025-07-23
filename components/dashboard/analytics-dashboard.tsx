// components/dashboard/analytics-dashboard.tsx

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart, 
  Share2,
  Download,
  Clock,
  Target,
  Zap,
  Award,
  Calendar,
  Activity
} from "lucide-react"
import { useDashboardStore } from "@/lib/stores/dashboard-store"

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalViews: 12847,
    totalLikes: 3421,
    totalShares: 892,
    totalDownloads: 1567,
    conversionRate: 23.4,
    engagementRate: 67.8
  },
  performance: {
    topTemplates: [
      { id: "social-post-1", name: "Post Instagram Moderne", views: 2341, likes: 567, shares: 123 },
      { id: "newsletter-1", name: "Newsletter E-commerce", views: 1876, likes: 432, shares: 89 },
      { id: "ad-facebook-1", name: "Publicité Facebook", views: 1654, likes: 398, shares: 76 },
      { id: "invitation-1", name: "Invitation Mariage", views: 1432, likes: 356, shares: 67 },
      { id: "menu-restaurant-1", name: "Menu Restaurant", views: 1298, likes: 289, shares: 54 }
    ],
    categoryPerformance: [
      { category: "social-media", name: "Réseaux Sociaux", usage: 35, growth: 12.3 },
      { category: "email", name: "Email Marketing", usage: 28, growth: 8.7 },
      { category: "advertising", name: "Publicité", usage: 22, growth: 15.2 },
      { category: "product", name: "Produits", usage: 15, growth: -2.1 }
    ],
    timeData: [
      { period: "Lun", views: 1200, engagement: 65 },
      { period: "Mar", views: 1400, engagement: 72 },
      { period: "Mer", views: 1100, engagement: 58 },
      { period: "Jeu", views: 1600, engagement: 78 },
      { period: "Ven", views: 1800, engagement: 82 },
      { period: "Sam", views: 900, engagement: 45 },
      { period: "Dim", views: 700, engagement: 38 }
    ]
  },
  insights: [
    {
      type: "trend",
      title: "Tendance à la hausse",
      description: "Les templates de réseaux sociaux gagnent 12% d'engagement",
      impact: "positive",
      recommendation: "Créez plus de templates Instagram et TikTok"
    },
    {
      type: "opportunity",
      title: "Opportunité détectée",
      description: "Les templates e-commerce ont un taux de conversion élevé",
      impact: "positive",
      recommendation: "Développez la collection e-commerce"
    },
    {
      type: "warning",
      title: "Attention requise",
      description: "Baisse d'engagement sur les templates produits",
      impact: "negative",
      recommendation: "Rafraîchissez les designs produits"
    }
  ]
}

export function AnalyticsDashboard() {
  const { analytics } = useDashboardStore()

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? TrendingUp : TrendingDown
  }

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="h-full w-full max-w-none mx-auto p-6">
      <div className="h-[550px] bg-transparent backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
        <ScrollArea className="h-[550px]">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full">
                  <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Analytics Dashboard</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  Tableau de{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    Bord Analytics
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Analysez les performances de vos créations et optimisez votre stratégie créative
                </p>
              </div>

              {/* Overview Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Projets Totaux</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {analytics.totalProjects}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={(analytics.completedProjects / analytics.totalProjects) * 100} className="h-2" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {analytics.completedProjects} complétés
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Vues Totales</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(mockAnalytics.overview.totalViews)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+12.3%</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {mockAnalytics.overview.engagementRate}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+5.7%</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200/50 dark:border-gray-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Conversion</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {mockAnalytics.overview.conversionRate}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8.2%</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">vs mois dernier</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Tabs */}
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="activity">Activité</TabsTrigger>
                  <TabsTrigger value="trends">Tendances</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Top Templates */}
                    <Card className="border border-gray-200/50 dark:border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          Top Templates
                        </CardTitle>
                        <CardDescription>
                          Templates les plus performants ce mois
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.performance.topTemplates.map((template, index) => (
                            <div key={template.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                    {template.name}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {formatNumber(template.views)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-3 h-3" />
                                      {template.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Share2 className="w-3 h-3" />
                                      {template.shares}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Category Performance */}
                    <Card className="border border-gray-200/50 dark:border-gray-800/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Performance par Catégorie
                        </CardTitle>
                        <CardDescription>
                          Utilisation et croissance par catégorie
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mockAnalytics.performance.categoryPerformance.map((category) => {
                            const GrowthIcon = getGrowthIcon(category.growth)
                            return (
                              <div key={category.category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {category.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                      {category.usage}%
                                    </span>
                                    <div className={`flex items-center gap-1 ${getGrowthColor(category.growth)}`}>
                                      <GrowthIcon className="w-3 h-3" />
                                      <span className="text-xs">
                                        {Math.abs(category.growth)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Progress value={category.usage} className="h-2" />
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <div className="grid gap-4">
                    {mockAnalytics.insights.map((insight, index) => (
                      <Card key={index} className="border border-gray-200/50 dark:border-gray-800/50">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              insight.impact === 'positive' ? 'bg-green-100 dark:bg-green-900/30' :
                              insight.impact === 'negative' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              {insight.type === 'trend' && <TrendingUp className={`w-6 h-6 ${
                                insight.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                              }`} />}
                              {insight.type === 'opportunity' && <Target className="w-6 h-6 text-blue-600" />}
                              {insight.type === 'warning' && <Activity className="w-6 h-6 text-orange-600" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {insight.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                {insight.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  Recommandation
                                </Badge>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {insight.recommendation}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Activité Récente
                      </CardTitle>
                      <CardDescription>
                        Vos dernières actions créatives
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Activity className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {new Date(activity.timestamp).toLocaleString('fr-FR')}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                  <Card className="border border-gray-200/50 dark:border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Tendances Hebdomadaires
                      </CardTitle>
                      <CardDescription>
                        Évolution de vos performances sur 7 jours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAnalytics.performance.timeData.map((day) => (
                          <div key={day.period} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {day.period}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {formatNumber(day.views)} vues
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {day.engagement}% engagement
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Progress value={day.engagement} className="w-20 h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
