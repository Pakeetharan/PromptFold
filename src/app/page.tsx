'use client';

import { useState, useMemo, useCallback } from 'react';
import RichTextInput from '@/components/RichTextInput';
import PromptOutput from '@/components/PromptOutput';
import { transformToPrompt, transformPlainText } from '@/utils/transformer';
import { estimateTokenCount } from '@/utils/tokenCounter';

export default function Home() {
  const [inputHtml, setInputHtml] = useState('');

  // Transform input to optimized prompt
  const optimizedPrompt = useMemo(() => {
    if (!inputHtml || inputHtml.trim().length === 0) {
      return '';
    }

    // Check if input contains HTML tags
    const hasHtmlTags = /<[^>]+>/.test(inputHtml);

    if (hasHtmlTags) {
      return transformToPrompt(inputHtml);
    } else {
      return transformPlainText(inputHtml);
    }
  }, [inputHtml]);

  // Calculate token count
  const tokenCount = useMemo(() => {
    return estimateTokenCount(optimizedPrompt);
  }, [optimizedPrompt]);

  const handleInputChange = useCallback((html: string) => {
    setInputHtml(html);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PromptFold</h1>
          <p className="text-gray-600">Convert rich text into token-optimized prompts for LLMs</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <RichTextInput value={inputHtml} onChange={handleInputChange} />
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <PromptOutput value={optimizedPrompt} tokenCount={tokenCount} />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">How it works</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Paste formatted text with paragraphs, lists, and styling</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Visual formatting is stripped, structure is preserved</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Whitespace is normalized for token efficiency</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Output is deterministic and optimized for LLM consumption</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-1">Built with Next.js, TypeScript, and Tailwind CSS</p>
          <p>
            <a
              href="https://github.com/Pakeetharan/PromptFold"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              View on GitHub
            </a>
            {' • '}
            <span>Created by Pakeetharan Balasubramaniam</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
