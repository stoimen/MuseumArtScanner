import { AiVisionClient, AnalyzeArtworkInput } from './types';

type GeminiVisionClientConfig = {
  apiKey: string;
  models?: string[];
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

// Ordered from most generous free-tier allowance to the strictest.
// When a model returns 404 (deprecated/unavailable) or 429 (quota exhausted),
// we fall through to the next one so the app keeps working on free keys.
const DEFAULT_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

export class GeminiVisionClient implements AiVisionClient {
  private readonly apiKey: string;
  private readonly models: string[];

  constructor({ apiKey, models }: GeminiVisionClientConfig) {
    this.apiKey = apiKey;
    this.models = models && models.length > 0 ? models : DEFAULT_MODELS;
  }

  async analyzeArtwork({ base64Image, prompt }: AnalyzeArtworkInput): Promise<string> {
    let lastError: Error | null = null;

    for (const model of this.models) {
      try {
        return await this.callModel(model, base64Image, prompt);
      } catch (err) {
        const error = err as GeminiRequestError;
        lastError = error;

        // Invalid API key — don't waste further quota, surface immediately.
        if (error.status === 400 && /API key/i.test(error.message)) {
          throw new Error('Invalid Gemini API key. Please check EXPO_PUBLIC_GEMINI_API_KEY.');
        }

        // Allowance/quota exhausted or model deprecated — try the next model.
        if (
          error.status === 404 ||
          error.status === 429 ||
          /no longer available/i.test(error.message) ||
          /quota/i.test(error.message)
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error(
      lastError?.message ?? 'All Gemini models failed. Please try again later.',
    );
  }

  private async callModel(model: string, base64Image: string, prompt: string): Promise<string> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

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
      const message = data.error?.message ?? `Gemini request failed with status ${response.status}`;
      throw new GeminiRequestError(message, response.status);
    }

    if (data.promptFeedback?.blockReason) {
      throw new GeminiRequestError(
        `Gemini blocked the request: ${data.promptFeedback.blockReason}`,
        response.status,
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

    if (!text) {
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason) {
        throw new GeminiRequestError(
          `Gemini returned no text output (finish reason: ${finishReason}).`,
          response.status,
        );
      }

      return 'No analysis was returned.';
    }

    return text;
  }
}

class GeminiRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GeminiRequestError';
    this.status = status;
  }
}
