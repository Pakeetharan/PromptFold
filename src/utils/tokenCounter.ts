import { encode } from 'gpt-tokenizer';

/**
 * Counts the exact number of tokens in a text string using GPT tokenizer.
 * Uses the gpt-tokenizer library for accurate GPT-3.5/GPT-4 token counting.
 *
 * @param text - The text to count tokens for
 * @returns The exact number of tokens
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  try {
    // Encode the text to get tokens
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    // Fallback to word-based estimation if encoding fails
    console.error('Token encoding failed, using fallback:', error);
    const words = text.trim().split(/\s+/);
    return Math.ceil(words.length * 0.75);
  }
}
