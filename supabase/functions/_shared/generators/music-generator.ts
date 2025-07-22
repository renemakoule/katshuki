// supabase/functions/_shared/generators/music-generator.ts

import { OpenAIService } from '../openai-service'

export interface MusicGenerationPayload {
  prompt?: string
  genre?: string
  mood?: string
  duration?: string
  instruments?: string[]
  tempo?: string
  useCase?: string
  choices?: any
}

export interface MusicGenerationResult {
  audioUrl: string
  metadata: {
    genre: string
    duration: number
    tempo: number
    key: string
    processingTime: number
    fileSize: number
  }
}

export class MusicGenerator {
  private openaiService: OpenAIService

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService
  }

  /**
   * Générer de la musique (simulation pour l'instant)
   */
  async generate(
    payload: MusicGenerationPayload,
    progressCallback?: (progress: number) => void
  ): Promise<MusicGenerationResult> {
    const startTime = Date.now()

    try {
      console.log('Starting music generation with payload:', payload)

      if (progressCallback) progressCallback(10)

      // Construire la description musicale
      const description = this.buildMusicDescription(payload)
      console.log('Generated music description:', description)

      if (progressCallback) progressCallback(20)

      // Générer des paroles ou une description détaillée avec OpenAI
      const compositionResponse = await this.openaiService.createChatCompletion([
        {
          role: 'system',
          content: 'Tu es un compositeur professionnel. Crée une description détaillée de composition musicale.'
        },
        {
          role: 'user',
          content: `Crée une composition musicale détaillée pour: ${description}`
        }
      ], {
        model: 'gpt-4',
        max_tokens: 800
      })

      if (progressCallback) progressCallback(40)

      const composition = compositionResponse.choices[0]?.message.content || ''

      // Simulation de génération musicale
      await this.simulateMusicGeneration(progressCallback)

      const processingTime = Date.now() - startTime

      return {
        audioUrl: `https://example.com/generated-music-${Date.now()}.mp3`,
        metadata: {
          genre: payload.genre || 'ambient',
          duration: this.parseDuration(payload.duration || 'medium'),
          tempo: this.parseTempo(payload.tempo || 'medium'),
          key: 'C Major',
          processingTime,
          fileSize: 8000000 // 8MB simulé
        }
      }

    } catch (error) {
      console.error('Error in music generation:', error)
      throw error
    }
  }

  private buildMusicDescription(payload: MusicGenerationPayload): string {
    let description = payload.prompt || ''

    if (!description && payload.choices) {
      const parts: string[] = []

      if (payload.choices.genre || payload.genre) {
        parts.push(`Genre: ${payload.choices.genre || payload.genre}`)
      }

      if (payload.choices.mood || payload.mood) {
        parts.push(`Ambiance: ${payload.choices.mood || payload.mood}`)
      }

      if (payload.choices.instruments || payload.instruments) {
        const instruments = payload.choices.instruments || payload.instruments
        parts.push(`Instruments: ${Array.isArray(instruments) ? instruments.join(', ') : instruments}`)
      }

      if (payload.choices.tempo || payload.tempo) {
        parts.push(`Tempo: ${payload.choices.tempo || payload.tempo}`)
      }

      description = parts.join(', ')
    }

    return description || 'Une composition musicale créative et harmonieuse'
  }

  private async simulateMusicGeneration(progressCallback?: (progress: number) => void): Promise<void> {
    const steps = [50, 65, 80, 90, 95]
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      if (progressCallback) progressCallback(step)
    }
  }

  private parseDuration(duration: string): number {
    const durationMap: Record<string, number> = {
      'short': 30,
      'medium': 120,
      'long': 300
    }
    return durationMap[duration] || 120
  }

  private parseTempo(tempo: string): number {
    const tempoMap: Record<string, number> = {
      'slow': 60,
      'medium': 120,
      'fast': 140,
      'very_fast': 180
    }
    return tempoMap[tempo] || 120
  }
}
