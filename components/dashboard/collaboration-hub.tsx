"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Send
} from "lucide-react"
import { useDashboardStore } from "@/lib/stores/dashboard-store"

export function CollaborationHub() {
  const [newComment, setNewComment] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  const { 
    collaborationData,
    addComment  } = useDashboardStore()

  const handleAddComment = (projectId: string) => {
    if (newComment.trim()) {
      addComment(projectId, {
        user: "Utilisateur actuel", // À remplacer par le nom de l'utilisateur connecté
        message: newComment
      })
      setNewComment("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'review': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Edit className="h-3 w-3" />
      case 'review': return <Eye className="h-3 w-3" />
      case 'completed': return <CheckCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hub Collaboration</h2>
          <p className="text-muted-foreground">
            Gérez vos projets collaboratifs et communiquez avec votre équipe
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des projets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projets Actifs</TabsTrigger>
          <TabsTrigger value="activity">Activité Récente</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collaborationData.projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(project.status)} text-white`}
                    >
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status}</span>
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Team Members */}
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{project.members.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-3 w-3" />
                    Mis à jour {project.lastActivity}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Commenter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>
                Dernières actions de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {collaborationData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span>
                          {' '}{activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collaborationData.teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center mt-2">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
