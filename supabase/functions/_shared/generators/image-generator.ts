// supabase/functions/_shared/generators/image-generator.ts

import { OpenAIService } from '../openai-service'

export interface ImageGenerationPayload {
  prompt?: string
  style?: string
  size?: string
  quality?: string
  count?: number
  useCase?: string
  choices?: any
}

export interface ImageGenerationResult {
  images: Array<{
    url: string
    prompt: string
    size: string
    quality: string
  }>
  metadata: {
    model: string
    processingTime: number
    totalImages: number
  }
}

export class ImageGenerator {
  private openaiService: OpenAIService

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService
  }

  /**
   * Générer des images basées sur le payload
   */
  async generate(
    payload: ImageGenerationPayload,
    progressCallback?: (progress: number) => void
  ): Promise<ImageGenerationResult> {
    const startTime = Date.now()

    try {
      console.log('Starting image generation with payload:', payload)

      // Construire le prompt à partir du payload
      const prompt = this.buildPrompt(payload)
      console.log('Generated prompt:', prompt)

      if (progressCallback) progressCallback(20)

      // Modérer le contenu du prompt
      const moderation = await this.openaiService.moderateContent(prompt)
      if (moderation.results[0]?.flagged) {
        throw new Error('Le contenu du prompt a été signalé par la modération')
      }

      if (progressCallback) progressCallback(30)

      // Paramètres de génération
      const size = this.mapSize(payload.size || 'standard')
      const quality = this.mapQuality(payload.quality || 'standard')
      const count = Math.min(payload.count || 1, 4) // Limite à 4 images max

      if (progressCallback) progressCallback(40)

      // Générer les images
      const images: Array<{ url: string; prompt: string; size: string; quality: string }> = []
      
      for (let i = 0; i < count; i++) {
        console.log(`Generating image ${i + 1}/${count}`)
        
        const response = await this.openaiService.generateImage(prompt, {
          model: 'dall-e-3',
          size,
          quality,
          n: 1
        })

        if (response.data && response.data.length > 0) {
          images.push({
            url: response.data[0].url,
            prompt: prompt,
            size: size,
            quality: quality
          })
        }

        // Mettre à jour le progrès
        const progress = 40 + ((i + 1) / count) * 50
        if (progressCallback) progressCallback(Math.round(progress))

        // Pause entre les générations pour éviter les rate limits
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      const processingTime = Date.now() - startTime

      console.log(`Image generation completed in ${processingTime}ms`)

      return {
        images,
        metadata: {
          model: 'dall-e-3',
          processingTime,
          totalImages: images.length
        }
      }

    } catch (error) {
      console.error('Error in image generation:', error)
      throw error
    }
  }

  /**
   * Construire le prompt à partir du payload
   */
  private buildPrompt(payload: ImageGenerationPayload): string {
    let prompt = payload.prompt || ''

    // Si pas de prompt direct, construire à partir des choices
    if (!prompt && payload.choices) {
      const parts: string[] = []

      // Ajouter le sujet principal
      if (payload.choices.subject) {
        parts.push(payload.choices.subject)
      }

      // Ajouter le style
      if (payload.choices.style || payload.style) {
        const style = payload.choices.style || payload.style
        parts.push(`in ${style} style`)
      }

      // Ajouter l'ambiance/mood
      if (payload.choices.mood) {
        parts.push(`with ${payload.choices.mood} mood`)
      }

      // Ajouter les couleurs
      if (payload.choices.colors) {
        if (Array.isArray(payload.choices.colors)) {
          parts.push(`using ${payload.choices.colors.join(', ')} colors`)
        } else {
          parts.push(`using ${payload.choices.colors} colors`)
        }
      }

      // Ajouter la composition
      if (payload.choices.composition) {
        parts.push(`with ${payload.choices.composition} composition`)
      }

      // Ajouter l'éclairage
      if (payload.choices.lighting) {
        parts.push(`with ${payload.choices.lighting} lighting`)
      }

      // Ajouter des détails supplémentaires
      if (payload.choices.details) {
        parts.push(payload.choices.details)
      }

      prompt = parts.join(', ')
    }

    // Ajouter des améliorations de qualité par défaut
    if (prompt && !prompt.includes('high quality') && !prompt.includes('detailed')) {
      prompt += ', high quality, detailed, professional'
    }

    // Fallback si toujours pas de prompt
    if (!prompt) {
      prompt = 'A beautiful, high-quality, detailed artwork'
    }

    return prompt
  }

  /**
   * Mapper la taille demandée vers les tailles supportées par DALL-E
   */
  private mapSize(size: string): string {
    const sizeMap: Record<string, string> = {
      'small': '1024x1024',
      'standard': '1024x1024',
      'large': '1792x1024',
      'portrait': '1024x1792',
      'landscape': '1792x1024',
      'square': '1024x1024'
    }

    return sizeMap[size] || '1024x1024'
  }

  /**
   * Mapper la qualité demandée vers les qualités supportées par DALL-E
   */
  private mapQuality(quality: string): string {
    const qualityMap: Record<string, string> = {
      'draft': 'standard',
      'standard': 'standard',
      'high': 'hd',
      'premium': 'hd'
    }

    return qualityMap[quality] || 'standard'
  }

  /**
   * Optimiser le prompt pour de meilleurs résultats
   */
  private optimizePrompt(prompt: string, style?: string): string {
    let optimized = prompt

    // Ajouter des mots-clés de qualité selon le style
    const qualityKeywords: Record<string, string[]> = {
      'realistic': ['photorealistic', 'highly detailed', '8k resolution'],
      'artistic': ['masterpiece', 'fine art', 'gallery quality'],
      'cartoon': ['vibrant colors', 'clean lines', 'stylized'],
      'abstract': ['creative', 'unique perspective', 'artistic interpretation'],
      'minimalist': ['clean', 'simple', 'elegant composition']
    }

    if (style && qualityKeywords[style]) {
      const keywords = qualityKeywords[style]
      optimized += `, ${keywords.join(', ')}`
    }

    return optimized
  }
}
