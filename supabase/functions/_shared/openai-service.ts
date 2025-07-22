// lib/services/openai-service.ts
// Service OpenAI compatible Node.js et Deno

// Interfaces pour les types OpenAI
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
  usage?: {
    total_tokens: number
    prompt_tokens: number
    completion_tokens: number
  }
}

export interface ImageGenerationResponse {
  data: Array<{
    url: string
    b64_json?: string
  }>
}

export class OpenAIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY!
    this.baseUrl = 'https://api.openai.com/v1'
    
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
  }

  /**
   * Créer une completion de chat
   */
  async createChatCompletion(
    messages: OpenAIMessage[],
    options: {
      model?: string
      temperature?: number
      max_tokens?: number
      stream?: boolean
    } = {}
  ): Promise<OpenAIResponse> {
    const {
      model = 'gpt-4o',
      temperature = 0.7,
      max_tokens = 2000,
      stream = false
    } = options

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Error in createChatCompletion:', error)
      throw error
    }
  }

  /**
   * Générer une image avec DALL-E
   */
  async generateImage(
    prompt: string,
    options: {
      model?: string
      size?: string
      quality?: string
      n?: number
    } = {}
  ): Promise<ImageGenerationResponse> {
    const {
      model = 'dall-e-3',
      size = '1024x1024',
      quality = 'standard',
      n = 1
    } = options

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          size,
          quality,
          n
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in generateImage:', error)
      throw error
    }
  }

  /**
   * Créer un embedding
   */
  async createEmbedding(
    input: string,
    model: string = 'text-embedding-ada-002'
  ): Promise<{ data: Array<{ embedding: number[] }> }> {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          input
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in createEmbedding:', error)
      throw error
    }
  }

  /**
   * Modérer du contenu
   */
  async moderateContent(input: string): Promise<{
    results: Array<{
      flagged: boolean
      categories: Record<string, boolean>
      category_scores: Record<string, number>
    }>
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/moderations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in moderateContent:', error)
      throw error
    }
  }

  /**
   * Créer une transcription audio
   */
  async createTranscription(
    audioFile: Blob,
    options: {
      model?: string
      language?: string
      prompt?: string
    } = {}
  ): Promise<{ text: string }> {
    const {
      model = 'whisper-1',
      language,
      prompt
    } = options

    try {
      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('model', model)
      
      if (language) formData.append('language', language)
      if (prompt) formData.append('prompt', prompt)

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in createTranscription:', error)
      throw error
    }
  }

  /**
   * Créer une traduction audio
   */
  async createTranslation(
    audioFile: Blob,
    options: {
      model?: string
      prompt?: string
    } = {}
  ): Promise<{ text: string }> {
    const {
      model = 'whisper-1',
      prompt
    } = options

    try {
      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('model', model)
      
      if (prompt) formData.append('prompt', prompt)

      const response = await fetch(`${this.baseUrl}/audio/translations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Error in createTranslation:', error)
      throw error
    }
  }
}

// Instance singleton pour faciliter l'utilisation
export const openaiService = new OpenAIService();
