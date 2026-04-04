export type AnalyzeArtworkInput = {
  base64Image: string;
  prompt: string;
};

export type AiVisionClient = {
  analyzeArtwork(input: AnalyzeArtworkInput): Promise<string>;
};
