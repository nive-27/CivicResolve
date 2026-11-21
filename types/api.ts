import type { AIAnalysis } from "./complaint";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[] | undefined>;
}

export interface ClassifyResponseData {
  analysis: AIAnalysis;
}

export interface ClassifyRequestPayload {
  title: string;
  description: string;
  location: string;
  category?: string;
  imageBase64?: string;
}
