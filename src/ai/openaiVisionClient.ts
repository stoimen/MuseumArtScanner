import OpenAI from 'openai';
import { AiVisionClient, AnalyzeArtworkInput } from './types';

type OpenAiVisionClientConfig = {
  apiKey: string;
  model?: string;
  maxTokens?: number;
};

export class OpenAiVisionClient implements AiVisionClient {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor({ apiKey, model = 'gpt-4o-mini', maxTokens = 500 }: OpenAiVisionClientConfig) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
    this.maxTokens = maxTokens;
  }

  async analyzeArtwork({ base64Image, prompt }: AnalyzeArtworkInput): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      max_tokens: this.maxTokens,
    });

    return response.choices[0]?.message?.content ?? 'No analysis was returned.';
  }
}
