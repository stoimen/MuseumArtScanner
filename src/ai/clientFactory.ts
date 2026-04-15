import { AiVisionClient } from './types';
import { GeminiVisionClient } from './geminiVisionClient';
import { OpenAiVisionClient } from './openaiVisionClient';

const OPENAI_API_KEY = (process.env.OPENAI_API_KEY ?? '').trim();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY ?? '').trim();
const AI_PROVIDER = (process.env.AI_PROVIDER ?? 'openai').trim().toLowerCase();

let cachedClient: AiVisionClient | null = null;

export const getVisionClient = (): AiVisionClient => {
  if (cachedClient) return cachedClient;

  switch (AI_PROVIDER) {
    case 'openai':
      if (!OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY. Set OPENAI_API_KEY before starting the app.');
      }
      cachedClient = new OpenAiVisionClient({ apiKey: OPENAI_API_KEY });
      break;

    case 'gemini':
      if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY. Set GEMINI_API_KEY before starting the app.');
      }
      cachedClient = new GeminiVisionClient({ apiKey: GEMINI_API_KEY });
      break;

    default:
      throw new Error(
        `Unsupported AI_PROVIDER "${AI_PROVIDER}". Supported providers: openai, gemini.`,
      );
  }

  return cachedClient;
};
