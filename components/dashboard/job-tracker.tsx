"use client"

import { useState } from "react"
import { useJobs } from "@/hooks/useJobs"
import { Job, JobStatus, JobType } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Play,
  X,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Trash2,
  Loader2
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface JobTrackerProps {
  className?: string
}

export function JobTracker({ className }: JobTrackerProps) {
  const {
    jobs,
    loading,
    error,
    hasMore,
    total,
    createJob,
    refreshJobs,
    loadMore,
    cancelJob,
    filterByStatus,
    filterByType,
    currentStatus,
    currentType
  } = useJobs({
    autoRefresh: true,
    refreshInterval: 10000,
    realtimeUpdates: true
  })

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  /**
   * Obtenir l'icône et la couleur pour un statut
   */
  const getStatusDisplay = (status: JobStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'En attente'
        }
      case 'processing':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          label: 'En cours'
        }
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Terminé'
        }
      case 'failed':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          label: 'Échoué'
        }
      case 'cancelled':
        return {
          icon: <X className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Annulé'
        }
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: status
        }
    }
  }

  /**
   * Obtenir le label pour un type de job
   */
  const getJobTypeLabel = (type: JobType) => {
    const labels: Record<JobType, string> = {
      'image_generation': 'Génération d\'image',
      'text_generation': 'Génération de texte',
      'video_creation': 'Création vidéo',
      'music_composition': 'Composition musicale',
      '3d_modeling': 'Modélisation 3D',
      'graphic_design': 'Design graphique'
    }
    return labels[type] || type
  }

  /**
   * Gérer l'annulation d'un job
   */
  const handleCancelJob = async (jobId: string) => {
    const success = await cancelJob(jobId)
    if (!success) {
      // Afficher une notification d'erreur
      console.error('Impossible d\'annuler le job')
    }
  }

  /**
   * Composant pour afficher un job individuel
   */
  const JobCard = ({ job }: { job: Job }) => {
    const statusDisplay = getStatusDisplay(job.status)
    const canCancel = job.status === 'pending' || job.status === 'processing'

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={statusDisplay.color}>
                {statusDisplay.icon}
                <span className="ml-1">{statusDisplay.label}</span>
              </Badge>
              <CardTitle className="text-sm font-medium">
                {getJobTypeLabel(job.type)}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelJob(job.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJob(job)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Barre de progression */}
            {job.status === 'processing' && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{job.progress}%</span>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>
            )}

            {/* Informations temporelles */}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Créé {formatDistanceToNow(new Date(job.created_at), { 
                  addSuffix: true, 
                  locale: fr 
                })}
              </span>
              {job.estimated_duration && (
                <span>
                  Durée estimée: {Math.round(job.estimated_duration / 60)}min
                </span>
              )}
            </div>

            {/* Résultat ou erreur */}
            {job.status === 'completed' && job.result && (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            )}

            {job.status === 'failed' && job.error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {job.error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Suivi des Tâches
              </CardTitle>
              <CardDescription>
                {total} tâche{total !== 1 ? 's' : ''} au total
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshJobs}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" onClick={() => filterByStatus(null)}>
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="active" onClick={() => filterByStatus('processing')}>
                  Actives
                </TabsTrigger>
                <TabsTrigger value="completed" onClick={() => filterByStatus('completed')}>
                  Terminées
                </TabsTrigger>
                <TabsTrigger value="failed" onClick={() => filterByStatus('failed')}>
                  Échouées
                </TabsTrigger>
              </TabsList>

              <Select onValueChange={(value) => filterByType(value as JobType || null)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="image_generation">Génération d'image</SelectItem>
                  <SelectItem value="text_generation">Génération de texte</SelectItem>
                  <SelectItem value="video_creation">Création vidéo</SelectItem>
                  <SelectItem value="music_composition">Composition musicale</SelectItem>
                  <SelectItem value="3d_modeling">Modélisation 3D</SelectItem>
                  <SelectItem value="graphic_design">Design graphique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="space-y-4">
              {error && (
                <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              <ScrollArea className="h-96">
                {jobs.length === 0 && !loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune tâche trouvée
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                    
                    {hasMore && (
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Charger plus
                      </Button>
                    )}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de détails du job (optionnel) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Détails de la tâche</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Type</h4>
                  <p className="text-sm text-gray-600">{getJobTypeLabel(selectedJob.type)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Statut</h4>
                  <Badge className={getStatusDisplay(selectedJob.status).color}>
                    {getStatusDisplay(selectedJob.status).label}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Paramètres</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedJob.payload, null, 2)}
                  </pre>
                </div>
                {selectedJob.result && (
                  <div>
                    <h4 className="font-medium">Résultat</h4>
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {JSON.stringify(selectedJob.result, null, 2)}
                    </pre>
                  </div>
                )}
                {selectedJob.error && (
                  <div>
                    <h4 className="font-medium text-red-600">Erreur</h4>
                    <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      {selectedJob.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
