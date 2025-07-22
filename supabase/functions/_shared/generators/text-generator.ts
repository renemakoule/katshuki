// supabase/functions/_shared/generators/text-generator.ts

import { OpenAIService, OpenAIMessage } from '../openai-service'

export interface TextGenerationPayload {
  prompt?: string
  type?: string
  tone?: string
  length?: string
  language?: string
  audience?: string
  useCase?: string
  choices?: any
}

export interface TextGenerationResult {
  content: string
  metadata: {
    model: string
    processingTime: number
    wordCount: number
    characterCount: number
    tokensUsed?: number
  }
}

export class TextGenerator {
  private openaiService: OpenAIService

  constructor(openaiService: OpenAIService) {
    this.openaiService = openaiService
  }

  /**
   * Générer du texte basé sur le payload
   */
  async generate(
    payload: TextGenerationPayload,
    progressCallback?: (progress: number) => void
  ): Promise<TextGenerationResult> {
    const startTime = Date.now()

    try {
      console.log('Starting text generation with payload:', payload)

      if (progressCallback) progressCallback(10)

      // Construire les messages pour le chat
      const messages = this.buildMessages(payload)
      console.log('Generated messages:', messages)

      if (progressCallback) progressCallback(20)

      // Modérer le contenu du prompt
      const promptText = messages.map(m => m.content).join(' ')
      const moderation = await this.openaiService.moderateContent(promptText)
      if (moderation.results[0]?.flagged) {
        throw new Error('Le contenu du prompt a été signalé par la modération')
      }

      if (progressCallback) progressCallback(30)

      // Paramètres de génération
      const model = this.selectModel(payload.type)
      const maxTokens = this.calculateMaxTokens(payload.length)
      const temperature = this.calculateTemperature(payload.type, payload.tone)

      if (progressCallback) progressCallback(40)

      // Générer le texte
      console.log(`Generating text with model: ${model}`)
      
      const response = await this.openaiService.createChatCompletion(messages, {
        model,
        max_tokens: maxTokens,
        temperature
      })

      if (progressCallback) progressCallback(80)

      if (!response.choices || response.choices.length === 0) {
        throw new Error('Aucune réponse générée par le modèle')
      }

      const content = response.choices[0].message.content
      const processingTime = Date.now() - startTime

      if (progressCallback) progressCallback(90)

      // Post-traitement du contenu
      const processedContent = this.postProcessContent(content, payload)

      if (progressCallback) progressCallback(100)

      console.log(`Text generation completed in ${processingTime}ms`)

      return {
        content: processedContent,
        metadata: {
          model,
          processingTime,
          wordCount: this.countWords(processedContent),
          characterCount: processedContent.length,
          tokensUsed: response.usage?.total_tokens
        }
      }

    } catch (error) {
      console.error('Error in text generation:', error)
      throw error
    }
  }

  /**
   * Construire les messages pour le chat
   */
  private buildMessages(payload: TextGenerationPayload): OpenAIMessage[] {
    const messages: OpenAIMessage[] = []

    // Message système pour définir le contexte
    const systemPrompt = this.buildSystemPrompt(payload)
    messages.push({
      role: 'system',
      content: systemPrompt
    })

    // Message utilisateur avec la demande
    const userPrompt = this.buildUserPrompt(payload)
    messages.push({
      role: 'user',
      content: userPrompt
    })

    return messages
  }

  /**
   * Construire le prompt système
   */
  private buildSystemPrompt(payload: TextGenerationPayload): string {
    const parts: string[] = []

    // Rôle de base
    parts.push('Tu es un assistant d\'écriture professionnel et créatif.')

    // Type de contenu
    if (payload.type) {
      const typeInstructions: Record<string, string> = {
        'article': 'Tu écris des articles informatifs et engageants.',
        'blog': 'Tu écris des articles de blog conversationnels et accessibles.',
        'email': 'Tu rédiges des emails professionnels et efficaces.',
        'social': 'Tu crées du contenu pour les réseaux sociaux, accrocheur et viral.',
        'marketing': 'Tu écris du contenu marketing persuasif et orienté conversion.',
        'creative': 'Tu écris de manière créative et originale.',
        'technical': 'Tu rédiges du contenu technique précis et clair.',
        'academic': 'Tu écris dans un style académique rigoureux.'
      }

      if (typeInstructions[payload.type]) {
        parts.push(typeInstructions[payload.type])
      }
    }

    // Ton
    if (payload.tone) {
      parts.push(`Adopte un ton ${payload.tone}.`)
    }

    // Audience
    if (payload.audience) {
      parts.push(`Écris pour une audience de ${payload.audience}.`)
    }

    // Langue
    const language = payload.language || 'français'
    parts.push(`Écris en ${language}.`)

    // Longueur
    if (payload.length) {
      const lengthInstructions: Record<string, string> = {
        'short': 'Sois concis et va droit au but (100-300 mots).',
        'medium': 'Développe tes idées de manière équilibrée (300-800 mots).',
        'long': 'Développe en profondeur avec des détails et exemples (800+ mots).'
      }

      if (lengthInstructions[payload.length]) {
        parts.push(lengthInstructions[payload.length])
      }
    }

    return parts.join(' ')
  }

  /**
   * Construire le prompt utilisateur
   */
  private buildUserPrompt(payload: TextGenerationPayload): string {
    let prompt = payload.prompt || ''

    // Si pas de prompt direct, construire à partir des choices
    if (!prompt && payload.choices) {
      const parts: string[] = []

      // Sujet principal
      if (payload.choices.topic || payload.choices.subject) {
        const topic = payload.choices.topic || payload.choices.subject
        parts.push(`Écris sur le sujet suivant: ${topic}`)
      }

      // Points clés à couvrir
      if (payload.choices.keyPoints && Array.isArray(payload.choices.keyPoints)) {
        parts.push(`Assure-toi de couvrir ces points: ${payload.choices.keyPoints.join(', ')}`)
      }

      // Angle ou perspective
      if (payload.choices.angle) {
        parts.push(`Adopte cette perspective: ${payload.choices.angle}`)
      }

      // Call-to-action
      if (payload.choices.cta) {
        parts.push(`Inclus cet appel à l'action: ${payload.choices.cta}`)
      }

      // Mots-clés à inclure
      if (payload.choices.keywords && Array.isArray(payload.choices.keywords)) {
        parts.push(`Intègre naturellement ces mots-clés: ${payload.choices.keywords.join(', ')}`)
      }

      prompt = parts.join('. ')
    }

    // Fallback si toujours pas de prompt
    if (!prompt) {
      prompt = 'Écris un contenu intéressant et engageant.'
    }

    return prompt
  }

  /**
   * Sélectionner le modèle approprié
   */
  private selectModel(type?: string): string {
    const modelMap: Record<string, string> = {
      'creative': 'gpt-4',
      'technical': 'gpt-4',
      'academic': 'gpt-4',
      'marketing': 'gpt-3.5-turbo',
      'social': 'gpt-3.5-turbo',
      'email': 'gpt-3.5-turbo',
      'blog': 'gpt-3.5-turbo'
    }

    return modelMap[type || 'blog'] || 'gpt-3.5-turbo'
  }

  /**
   * Calculer le nombre maximum de tokens
   */
  private calculateMaxTokens(length?: string): number {
    const tokenMap: Record<string, number> = {
      'short': 500,
      'medium': 1500,
      'long': 3000
    }

    return tokenMap[length || 'medium'] || 1500
  }

  /**
   * Calculer la température
   */
  private calculateTemperature(type?: string, tone?: string): number {
    // Plus créatif = température plus élevée
    if (type === 'creative' || tone === 'créatif') return 0.9
    if (type === 'marketing' || tone === 'persuasif') return 0.8
    if (type === 'social' || tone === 'décontracté') return 0.8
    if (type === 'technical' || tone === 'professionnel') return 0.3
    if (type === 'academic' || tone === 'formel') return 0.2

    return 0.7 // Valeur par défaut équilibrée
  }

  /**
   * Post-traitement du contenu
   */
  private postProcessContent(content: string, payload: TextGenerationPayload): string {
    let processed = content.trim()

    // Nettoyer les espaces multiples
    processed = processed.replace(/\s+/g, ' ')

    // Assurer une structure correcte pour les articles
    if (payload.type === 'article' || payload.type === 'blog') {
      // S'assurer qu'il y a des paragraphes
      if (!processed.includes('\n\n')) {
        processed = processed.replace(/\. /g, '.\n\n')
      }
    }

    // Ajouter des sauts de ligne pour les emails
    if (payload.type === 'email') {
      processed = processed.replace(/\n/g, '\n\n')
    }

    return processed
  }

  /**
   * Compter les mots
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }
}
