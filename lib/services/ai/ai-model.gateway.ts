import OpenAI from 'openai';

// Interface for the AI model gateway
export interface IAIModelGateway {
  generateImage(prompt: string, params: Record<string, any>): Promise<any>;
  generateText(prompt: string, params: Record<string, any>): Promise<string>;
}

export class AIModelGateway implements IAIModelGateway {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Warning: OPENAI_API_KEY is not set. AI Gateway will not be able to generate images.");
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public async generateImage(prompt: string, params: Record<string, any>): Promise<any> {
    console.log(`Gateway: Generating image with prompt: "${prompt}" and params:`, params);

    if (!this.openai.apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }

    try {
      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: params.size || '1024x1024',
        quality: params.quality || 'standard',
        style: params.style || 'vivid',
        response_format: 'url',
      });

      const image = response.data?.[0];
      if (!image?.url) {
        throw new Error("API response did not contain a valid image.");
      }

      return {
        imageUrl: image.url,
        revisedPrompt: image.revised_prompt,
      };
    } catch (error) {
      console.error("[AI_GATEWAY_ERROR]", error);
      throw new Error("Failed to generate image via OpenAI API.");
    }
  }

  public async generateText(prompt: string, params: Record<string, any>): Promise<string> {
    console.log("Gateway: Generating text with prompt... (see meta-prompt in logs if needed)");

    if (!this.openai.apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo', // Using a powerful model for strategic tasks
        messages: [
          {
            role: 'system',
            content: prompt, // The entire meta-prompt is passed as a system message
          },
        ],
        // Enforce JSON output for predictable parsing
        response_format: { type: 'json_object' },
        temperature: params.temperature || 0.5, // Lower temperature for more predictable, structured output
        max_tokens: params.max_tokens || 2048,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('API response did not contain valid text content.');
      }

      return content;

    } catch (error) {
      console.error('[AI_GATEWAY_TEXT_ERROR]', error);
      throw new Error('Failed to generate text via OpenAI API.');
    }
  }
}
