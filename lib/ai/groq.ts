// lib/ai/groq.ts
// GroqCloud API Integration for AI Agents

import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GroqCallOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface GroqResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

/**
 * Call GroqCloud API with retry logic and error handling
 * @param prompt - The prompt to send to the LLM
 * @param options - Configuration options
 * @returns Response content and metadata
 */
export async function callGroq(
  prompt: string,
  options: GroqCallOptions = {}
): Promise<GroqResponse> {
  const {
    temperature = 0.7,
    maxTokens = 2048,
    model = "mixtral-8x7b-32768", // Default to Mixtral
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0,
  } = options;

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
      });

      const choice = completion.choices[0];
      if (!choice || !choice.message.content) {
        throw new Error("No response from Groq API");
      }

      return {
        content: choice.message.content,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        model: completion.model,
        finishReason: choice.finish_reason || "stop",
      };
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.status === 400 || error.status === 401) {
        throw new Error(`Groq API error: ${error.message}`);
      }

      // Exponential backoff for retries
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed to call Groq API after ${maxRetries} attempts: ${lastError?.message}`
  );
}

/**
 * Call Groq with structured JSON response
 * @param prompt - The prompt requesting JSON output
 * @param options - Configuration options
 * @returns Parsed JSON response
 */
export async function callGroqJSON<T = any>(
  prompt: string,
  options: GroqCallOptions = {}
): Promise<T> {
  const enhancedPrompt = `${prompt}\n\nRespond ONLY with valid JSON. Do not include any explanatory text before or after the JSON.`;

  const response = await callGroq(enhancedPrompt, {
    ...options,
    temperature: options.temperature || 0.3, // Lower temp for structured output
  });

  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response.content.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}\nResponse: ${response.content}`
    );
  }
}

/**
 * Available models for different use cases
 */
export const GroqModels = {
  MIXTRAL: "mixtral-8x7b-32768", // Best for complex reasoning
  LLAMA3_70B: "llama3-70b-8192", // Balanced performance
  LLAMA3_8B: "llama3-8b-8192", // Fast, lightweight
  GEMMA_7B: "gemma-7b-it", // Efficient for simple tasks
} as const;

/**
 * Check if Groq API is configured
 */
export function isGroqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}

/**
 * Estimate token count (rough approximation)
 * @param text - Text to estimate
 * @returns Approximate token count
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text to fit within token limit
 * @param text - Text to truncate
 * @param maxTokens - Maximum tokens
 * @returns Truncated text
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text);
  if (estimatedTokens <= maxTokens) return text;

  const ratio = maxTokens / estimatedTokens;
  const targetLength = Math.floor(text.length * ratio * 0.9); // 10% safety margin
  return text.substring(0, targetLength) + "...";
}
