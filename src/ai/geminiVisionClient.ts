import { AiVisionClient, AnalyzeArtworkInput } from './types';

type GeminiVisionClientConfig = {
  apiKey: string;
  model?: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
};

export class GeminiVisionClient implements AiVisionClient {
  private readonly apiKey: string;
  private readonly model: string;

  constructor({ apiKey, model = 'gemini-1.5-flash' }: GeminiVisionClientConfig) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeArtwork({ base64Image, prompt }: AnalyzeArtworkInput): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = (await response.json()) as GeminiGenerateContentResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `Gemini request failed with status ${response.status}`);
    }

    if (data.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked the request: ${data.promptFeedback.blockReason}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

    if (!text) {
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason) {
        throw new Error(`Gemini returned no text output (finish reason: ${finishReason}).`);
      }

      return 'No analysis was returned.';
    }

    return text;
  }
}
