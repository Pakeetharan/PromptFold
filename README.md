# PromptFold

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Convert rich text into deterministic, token-compact prompts optimized for LLM usage.**

PromptFold is a production-ready web application that transforms rich text input (with formatting, lists, paragraphs) into clean, token-efficient prompts suitable for Large Language Models. It strips visual styling while preserving document structure, ensuring consistent and optimized output.

🔗 **[Live Demo](https://promptfold.netlify.app)** | 📖 **[Documentation](#-getting-started)**

---

## ✨ Features

- 📝 **Rich Text Input**: Paste formatted text with paragraphs, numbered lists, bullet lists, and mixed formatting
- 🎯 **Deterministic Transformation**: Same input always produces the same output
- 🚀 **Token Optimization**: Removes redundant whitespace and normalizes formatting
- 📊 **Live Token Counter**: Real-time estimation of token count using GPT-style heuristics
- 📋 **One-Click Copy**: Copy optimized prompt to clipboard instantly
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🌐 **No Backend Required**: Runs entirely in the browser
- ⚡ **Zero Dependencies**: Lightweight and fast

## 🎯 Why PromptFold?

When working with LLMs, token efficiency matters. PromptFold helps you:

- **Reduce costs** by minimizing token usage
- **Improve clarity** by removing visual noise
- **Ensure consistency** with deterministic transformations
- **Save time** with instant copy-paste workflow

## 🔄 Transformation Rules

The application applies the following rules to optimize your text:

1. **Whitespace Normalization**

   - Trim leading and trailing spaces per line
   - Collapse multiple spaces inside a line into one
   - Remove empty lines completely

2. **Structure Preservation**

   - Each paragraph becomes one single line
   - Paragraphs separated by exactly one `\n`
   - Meaningful line breaks preserved using `\n`

3. **List Handling**

   - Numbered lists remain numbered (1. 2. 3. format)
   - Bullet lists converted to "- item" format
   - **Nested lists with different types**: Main item keeps format, sub-items use dash
   - **Nested lists with same type**: Converted to `- main: sub1, sub2, sub3` format

4. **Visual Formatting Ignored**
   - Colors, font sizes, bold, italics, underline removed
   - Only document structure matters

## 📦 Tech Stack

- **Framework**: [Next.js 15.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Runtime**: [React 19](https://react.dev/)
- **Zero external dependencies** for core functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Pakeetharan/PromptFold.git
cd PromptFold
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 💡 Usage Example

**Input (Rich Text):**

```
Welcome to PromptFold

Here are the features:
1. Token optimization
   • Fast processing
   • Low cost
2. Deterministic output
3. Real-time processing

Key benefits:
• Faster processing
• Lower costs
• Better results
```

**Output (Optimized):**

```
Welcome to PromptFold
Here are the features:
1. Token optimization: Fast processing, Low cost
2. Deterministic output
3. Real-time processing
Key benefits:
- Faster processing
- Lower costs
- Better results
```

## 🏗️ Architecture

### Project Structure

```
PromptFold/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main application page
│   │   └── globals.css          # Global styles and Tailwind
│   ├── components/
│   │   ├── RichTextInput.tsx    # Editable rich text input
│   │   ├── PromptOutput.tsx     # Read-only output with copy
│   │   └── TokenCounter.tsx     # Live token count display
│   └── utils/
│       ├── transformer.ts       # Core transformation logic
│       └── tokenCounter.ts      # Token estimation algorithm
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

### Key Components

#### `transformer.ts`

Pure utility function containing the core transformation logic. Parses HTML, applies optimization rules, and returns deterministic output.

**Functions:**

- `transformToPrompt(html: string): string` - Transforms rich text HTML
- `transformPlainText(text: string): string` - Handles plain text input

#### `tokenCounter.ts`

Token estimation using a rough heuristic (~0.75 tokens per word) acceptable for GPT-style tokenizers.

**Function:**

- `estimateTokenCount(text: string): number` - Returns estimated token count

#### Component Architecture

- **RichTextInput**: ContentEditable div with paste handling
- **PromptOutput**: Read-only textarea with copy button
- **TokenCounter**: Display component for token count
- **Page**: Main orchestrator using React hooks for state management

### State Management

- Local React state only (`useState`)
- Memoized transformations (`useMemo`) to avoid unnecessary re-renders
- Callback optimization (`useCallback`) for event handlers

## 🏗️ Architecture

### Project Structure

```
PromptFold/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles and Tailwind
│   ├── components/
│   │   ├── RichTextInput.tsx   # Editable rich text input
│   │   └── PromptOutput.tsx    # Read-only output with copy
│   └── utils/
│       ├── transformer.ts      # Core transformation logic
│       └── tokenCounter.ts     # Token estimation algorithm
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### Key Components

- **`transformer.ts`**: Pure utility functions for text transformation
- **`tokenCounter.ts`**: GPT-style token estimation (~0.75 tokens per word)
- **`RichTextInput`**: ContentEditable div with paste handling
- **`PromptOutput`**: Read-only textarea with copy button and live stats

## 🚢 Deployment

### Deploy to Netlify (Recommended)

1. **Push to GitHub** (see instructions below)
2. **Connect to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings are auto-detected
   - Click "Deploy"

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Other Platforms

- **AWS Amplify**: Connect GitHub repository
- **Docker**: Use the included configuration
- **Static hosting**: Run `npm run build` and deploy the `out` folder

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs**: Open an issue describing the problem
- ✨ **Suggest features**: Share your ideas in the discussions
- 📖 **Improve documentation**: Fix typos or add examples
- 🔧 **Submit PRs**: Fix bugs or add new features

### Development Guidelines

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: Ensure all existing functionality still works
5. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- Follow TypeScript strict mode
- Use Prettier for formatting
- Write clear, descriptive comments
- Keep transformation logic deterministic
- Avoid unnecessary dependencies

## 🧪 Testing

The transformation logic is implemented as pure functions, making testing straightforward:

```typescript
import { transformToPrompt } from './utils/transformer';

// Test deterministic output
const input = '<p>Hello World</p>';
const output = transformToPrompt(input);
expect(output).toBe('Hello World');
```

## 🐛 Known Issues & Limitations

- Token counting is approximate (not exact GPT tokenization)
- Very deeply nested lists may not format perfectly
- Browser compatibility requires modern JavaScript features

## 📋 Roadmap

- [ ] Exact token counting using tiktoken
- [ ] Dark mode support
- [ ] Export to file functionality
- [ ] Undo/redo functionality
- [ ] Custom transformation rules
- [ ] Batch processing
- [ ] API endpoint option

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@Pakeetharan](https://github.com/Pakeetharan)
- Twitter: [@PakeetharanB](https://twitter.com/PakeetharanB)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by the need for efficient LLM prompts

## ⭐ Show Your Support

If this project helps you, please give it a ⭐ on GitHub!

---

**Made with ❤️ for the AI community**
