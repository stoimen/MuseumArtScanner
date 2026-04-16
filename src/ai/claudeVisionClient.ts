import { AiVisionClient, AnalyzeArtworkInput } from './types';

type ClaudeVisionClientConfig = {
  apiKey: string;
  model?: string;
  maxTokens?: number;
};

type ClaudeMessagesResponse = {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
};

export class ClaudeVisionClient implements AiVisionClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor({ apiKey, model = 'claude-sonnet-4-20250514', maxTokens = 1000 }: ClaudeVisionClientConfig) {
    this.apiKey = apiKey;
    this.model = model;
    this.maxTokens = maxTokens;
  }

  async analyzeArtwork({ base64Image, prompt }: AnalyzeArtworkInput): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            { type: 'text', text: prompt },
          ],
        }],
      }),
    });

    const data = (await response.json()) as ClaudeMessagesResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `Claude request failed with status ${response.status}`);
    }

    const text = data.content?.map(block => block.text ?? '').join('').trim();

    if (!text) {
      return 'No analysis was returned.';
    }

    return text;
  }
}
