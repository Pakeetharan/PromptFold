'use client';

import { useCallback, useState } from 'react';

interface PromptOutputProps {
  readonly value: string;
  readonly tokenCount: number;
}

export default function PromptOutput({ value, tokenCount }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [value]);

  // Calculate line count
  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-300 bg-gradient-to-r from-green-600 to-green-700 -mx-6 -mt-6 px-6 pt-6 rounded-t-xl">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Optimized Prompt</h2>
          <div className="flex items-center gap-4 text-sm text-green-100">
            <span>{tokenCount.toLocaleString()} tokens</span>
            <span>{lineCount} lines</span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          disabled={!value}
          className="px-4 py-2 text-sm font-medium text-green-700 bg-white rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-sm"
          aria-label="Copy to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <textarea
        id="prompt-output"
        value={value}
        readOnly
        className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto"
        aria-label="Optimized prompt output"
        placeholder="Transformed output will appear here..."
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      />
    </div>
  );
}
