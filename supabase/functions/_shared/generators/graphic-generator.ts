// supabase/functions/_shared/generators/graphic-generator.ts

import { OpenAIService } from '../openai-service'

export interface GraphicGenerationPayload {
  prompt?: string
  type?: string
  style?: string
  format?: string
  dimensions?: string
  colors?: string[]
  useCase?: string
  choices?: any
}

export interface GraphicGenerationResult {
  imageUrl: string
  vectorUrl?: string
  metadata: {
    type: string
    format: string
    dimensions: string
    processingTime: number
    fileSize: number
  }
}

export class GraphicGenerator {
  private openaiService: OpenAIService

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService
  }

  /**
   * Générer un design graphique
   */
  async generate(
    payload: GraphicGenerationPayload,
    progressCallback?: (progress: number) => void
  ): Promise<GraphicGenerationResult> {
    const startTime = Date.now()

    try {
      console.log('Starting graphic design generation with payload:', payload)

      if (progressCallback) progressCallback(10)

      // Construire le prompt de design
      const designPrompt = this.buildDesignPrompt(payload)
      console.log('Generated design prompt:', designPrompt)

      if (progressCallback) progressCallback(20)

      // Modérer le contenu
      const moderation = await this.openaiService.moderateContent(designPrompt)
      if (moderation.results[0]?.flagged) {
        throw new Error('Le contenu du prompt a été signalé par la modération')
      }

      if (progressCallback) progressCallback(30)

      // Générer le concept de design avec OpenAI
      const conceptResponse = await this.openaiService.createChatCompletion([
        {
          role: 'system',
          content: 'Tu es un designer graphique expert. Crée un concept de design détaillé basé sur la demande.'
        },
        {
          role: 'user',
          content: `Crée un concept de design graphique pour: ${designPrompt}`
        }
      ], {
        model: 'gpt-4',
        max_tokens: 800
      })

      if (progressCallback) progressCallback(40)

      const concept = conceptResponse.choices[0]?.message.content || ''

      // Générer l'image avec DALL-E
      const imageResponse = await this.openaiService.generateImage(
        this.optimizePromptForGraphics(designPrompt, payload),
        {
          model: 'dall-e-3',
          size: this.mapDimensions(payload.dimensions || 'standard'),
          quality: 'hd'
        }
      )

      if (progressCallback) progressCallback(80)

      if (!imageResponse.data || imageResponse.data.length === 0) {
        throw new Error('Aucune image générée')
      }

      const processingTime = Date.now() - startTime

      if (progressCallback) progressCallback(100)

      return {
        imageUrl: imageResponse.data[0].url,
        vectorUrl: undefined, // Pas de version vectorielle pour l'instant
        metadata: {
          type: payload.type || 'general',
          format: payload.format || 'PNG',
          dimensions: payload.dimensions || 'standard',
          processingTime,
          fileSize: 2000000 // 2MB simulé
        }
      }

    } catch (error) {
      console.error('Error in graphic design generation:', error)
      throw error
    }
  }

  private buildDesignPrompt(payload: GraphicGenerationPayload): string {
    let prompt = payload.prompt || ''

    if (!prompt && payload.choices) {
      const parts: string[] = []

      // Type de design
      if (payload.choices.type || payload.type) {
        const type = payload.choices.type || payload.type
        parts.push(`${type} design`)
      }

      // Concept principal
      if (payload.choices.concept) {
        parts.push(`concept: ${payload.choices.concept}`)
      }

      // Style
      if (payload.choices.style || payload.style) {
        const style = payload.choices.style || payload.style
        parts.push(`${style} style`)
      }

      // Couleurs
      if (payload.choices.colors || payload.colors) {
        const colors = payload.choices.colors || payload.colors
        const colorStr = Array.isArray(colors) ? colors.join(', ') : colors
        parts.push(`using ${colorStr} colors`)
      }

      // Éléments à inclure
      if (payload.choices.elements) {
        parts.push(`including ${payload.choices.elements}`)
      }

      // Message ou texte
      if (payload.choices.message) {
        parts.push(`with message: "${payload.choices.message}"`)
      }

      prompt = parts.join(', ')
    }

    return prompt || 'Un design graphique moderne et professionnel'
  }

  private optimizePromptForGraphics(prompt: string, payload: GraphicGenerationPayload): string {
    let optimized = prompt

    // Ajouter des termes spécifiques au design graphique
    const designTerms = [
      'professional design',
      'clean layout',
      'modern typography',
      'balanced composition'
    ]

    // Ajouter des termes selon le type
    const typeTerms: Record<string, string[]> = {
      'logo': ['minimalist', 'scalable', 'memorable', 'brand identity'],
      'poster': ['eye-catching', 'bold typography', 'visual hierarchy'],
      'banner': ['attention-grabbing', 'clear message', 'web-ready'],
      'flyer': ['informative', 'attractive layout', 'print-ready'],
      'social': ['engaging', 'shareable', 'platform-optimized'],
      'business_card': ['professional', 'elegant', 'contact information'],
      'brochure': ['informative', 'structured layout', 'professional presentation']
    }

    const type = payload.type || 'general'
    if (typeTerms[type]) {
      optimized += `, ${typeTerms[type].join(', ')}`
    }

    // Ajouter des termes de qualité généraux
    optimized += `, ${designTerms.join(', ')}, high quality, vector-style`

    return optimized
  }

  private mapDimensions(dimensions: string): string {
    const dimensionMap: Record<string, string> = {
      'square': '1024x1024',
      'standard': '1024x1024',
      'portrait': '1024x1792',
      'landscape': '1792x1024',
      'banner': '1792x1024',
      'social_square': '1024x1024',
      'social_story': '1024x1792'
    }

    return dimensionMap[dimensions] || '1024x1024'
  }
}
