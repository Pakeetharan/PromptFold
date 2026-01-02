import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptFold - Token-Optimized Prompt Converter',
  description:
    'Convert rich text into deterministic, token-compact prompts optimized for LLM usage',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
