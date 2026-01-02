/**
 * Estimates the number of tokens in a text string.
 * Uses a rough heuristic acceptable for GPT-style tokenizers.
 *
 * Approximation: ~0.75 tokens per word, accounting for punctuation and whitespace.
 * This is a simplified estimation but provides useful guidance.
 */
export function estimateTokenCount(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  // Split by whitespace to get words
  const words = text.trim().split(/\s+/);

  // Count words
  const wordCount = words.length;

  // Rough approximation: ~0.75 tokens per word
  // Adding slight overhead for punctuation
  const estimatedTokens = Math.ceil(wordCount * 0.75);

  return estimatedTokens;
}
