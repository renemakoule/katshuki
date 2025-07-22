 class ConfigService {
  public readonly openaiApiKey: string;
  public readonly timeout: number;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.timeout = process.env.OPENAI_TIMEOUT ? parseInt(process.env.OPENAI_TIMEOUT, 10) : 30000;

    if (!this.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables.");
    }
  }
}

export const configService = new ConfigService();