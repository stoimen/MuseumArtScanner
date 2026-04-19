import { AiVisionClient } from './types';
import { ClaudeVisionClient } from './claudeVisionClient';
import { GeminiVisionClient } from './geminiVisionClient';
import { OpenAiVisionClient } from './openaiVisionClient';

// Expo only inlines env vars prefixed with EXPO_PUBLIC_ into the client bundle.
// Fall back to the unprefixed names so the same config works in Node/test contexts.
const readEnv = (name: string): string =>
  (process.env[`EXPO_PUBLIC_${name}`] ?? process.env[name] ?? '').trim();

const OPENAI_API_KEY = readEnv('OPENAI_API_KEY');
const GEMINI_API_KEY = readEnv('GEMINI_API_KEY');
const ANTHROPIC_API_KEY = readEnv('ANTHROPIC_API_KEY');
const AI_PROVIDER = (readEnv('AI_PROVIDER') || 'claude').toLowerCase();

let cachedClient: AiVisionClient | null = null;

export const getVisionClient = (): AiVisionClient => {
  if (cachedClient) return cachedClient;

  switch (AI_PROVIDER) {
    case 'claude':
      if (!ANTHROPIC_API_KEY) {
        throw new Error('Missing ANTHROPIC_API_KEY. Set EXPO_PUBLIC_ANTHROPIC_API_KEY before starting the app.');
      }
      cachedClient = new ClaudeVisionClient({ apiKey: ANTHROPIC_API_KEY });
      break;

    case 'openai':
      if (!OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY. Set EXPO_PUBLIC_OPENAI_API_KEY before starting the app.');
      }
      cachedClient = new OpenAiVisionClient({ apiKey: OPENAI_API_KEY });
      break;

    case 'gemini':
      if (!GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY. Set EXPO_PUBLIC_GEMINI_API_KEY before starting the app.');
      }
      cachedClient = new GeminiVisionClient({ apiKey: GEMINI_API_KEY });
      break;

    default:
      throw new Error(
        `Unsupported AI_PROVIDER "${AI_PROVIDER}". Supported providers: claude, openai, gemini.`,
      );
  }

  return cachedClient;
};
