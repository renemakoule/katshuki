// supabase/functions/_shared/generators/3d-generator.ts

import { OpenAIService } from '../openai-service'

export interface Model3DGenerationPayload {
  prompt?: string
  style?: string
  complexity?: string
  format?: string
  useCase?: string
  choices?: any
}

export interface Model3DGenerationResult {
  modelUrl: string
  previewUrl: string
  metadata: {
    format: string
    vertices: number
    faces: number
    processingTime: number
    fileSize: number
  }
}

export class ModelGenerator3D {
  private openaiService: OpenAIService

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService
  }

  /**
   * Générer un modèle 3D (simulation pour l'instant)
   */
  async generate(
    payload: Model3DGenerationPayload,
    progressCallback?: (progress: number) => void
  ): Promise<Model3DGenerationResult> {
    const startTime = Date.now()

    try {
      console.log('Starting 3D model generation with payload:', payload)

      if (progressCallback) progressCallback(10)

      // Construire la description du modèle 3D
      const description = this.build3DDescription(payload)
      console.log('Generated 3D model description:', description)

      if (progressCallback) progressCallback(20)

      // Modérer le contenu
      const moderation = await this.openaiService.moderateContent(description)
      if (moderation.results[0]?.flagged) {
        throw new Error('Le contenu du prompt a été signalé par la modération')
      }

      if (progressCallback) progressCallback(30)

      // Générer des spécifications techniques avec OpenAI
      const specsResponse = await this.openaiService.createChatCompletion([
        {
          role: 'system',
          content: 'Tu es un expert en modélisation 3D. Crée des spécifications techniques détaillées pour un modèle 3D.'
        },
        {
          role: 'user',
          content: `Crée des spécifications techniques pour ce modèle 3D: ${description}`
        }
      ], {
        model: 'gpt-4',
        max_tokens: 600
      })

      if (progressCallback) progressCallback(50)

      const specifications = specsResponse.choices[0]?.message.content || ''

      // Simulation de génération 3D
      await this.simulate3DGeneration(progressCallback)

      const processingTime = Date.now() - startTime

      return {
        modelUrl: `https://example.com/generated-model-${Date.now()}.glb`,
        previewUrl: `https://example.com/preview-${Date.now()}.png`,
        metadata: {
          format: payload.format || 'GLB',
          vertices: this.calculateVertices(payload.complexity || 'medium'),
          faces: this.calculateFaces(payload.complexity || 'medium'),
          processingTime,
          fileSize: 5000000 // 5MB simulé
        }
      }

    } catch (error) {
      console.error('Error in 3D model generation:', error)
      throw error
    }
  }

  private build3DDescription(payload: Model3DGenerationPayload): string {
    let description = payload.prompt || ''

    if (!description && payload.choices) {
      const parts: string[] = []

      if (payload.choices.object) {
        parts.push(`Objet: ${payload.choices.object}`)
      }

      if (payload.choices.style || payload.style) {
        parts.push(`Style: ${payload.choices.style || payload.style}`)
      }

      if (payload.choices.complexity || payload.complexity) {
        parts.push(`Complexité: ${payload.choices.complexity || payload.complexity}`)
      }

      if (payload.choices.materials) {
        parts.push(`Matériaux: ${payload.choices.materials}`)
      }

      if (payload.choices.colors) {
        parts.push(`Couleurs: ${payload.choices.colors}`)
      }

      description = parts.join(', ')
    }

    return description || 'Un modèle 3D créatif et détaillé'
  }

  private async simulate3DGeneration(progressCallback?: (progress: number) => void): Promise<void> {
    const steps = [60, 70, 80, 85, 90, 95]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 4000))
      if (progressCallback) progressCallback(step)
    }
  }

  private calculateVertices(complexity: string): number {
    const vertexMap: Record<string, number> = {
      'low': 1000,
      'medium': 5000,
      'high': 15000,
      'ultra': 50000
    }
    return vertexMap[complexity] || 5000
  }

  private calculateFaces(complexity: string): number {
    const faceMap: Record<string, number> = {
      'low': 800,
      'medium': 4000,
      'high': 12000,
      'ultra': 40000
    }
    return faceMap[complexity] || 4000
  }
}
