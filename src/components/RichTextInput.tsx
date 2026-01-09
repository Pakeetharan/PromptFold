'use client';

import { useCallback, useRef, useEffect } from 'react';

interface RichTextInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function RichTextInput({ value, onChange }: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUserTyping = useRef(false);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      isUserTyping.current = true;
      onChange(target.innerHTML);
    },
    [onChange]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      // Get HTML if available, otherwise plain text
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');

      const content = html || text;

      // Insert at cursor position
      const selection = globalThis.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.innerHTML = content;

        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }

        range.insertNode(fragment);

        // Move cursor to end of inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Trigger onChange
      isUserTyping.current = true;
      onChange(e.currentTarget.innerHTML);
    },
    [onChange]
  );

  // Enable rich text formatting commands
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Allow browser default formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      // Don't prevent default for common shortcuts like Ctrl+B, Ctrl+I, etc.
      return;
    }
  }, []);

  // Clear the input
  const handleClear = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      isUserTyping.current = true;
      onChange('');
      editorRef.current.focus();
    }
  }, [onChange]);

  // Sync external value changes (but not during user typing)
  useEffect(() => {
    if (editorRef.current && !isUserTyping.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isUserTyping.current = false;
  }, [value]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-gray-300 bg-gradient-to-r from-blue-600 to-blue-700 -mx-6 -mt-6 px-6 pt-6 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Rich Text Input</h2>
            <p className="text-sm text-blue-100">Paste rich text • Formatting will be stripped</p>
          </div>
          <button
            onClick={handleClear}
            disabled={!value}
            className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
            aria-label="Clear input"
            title="Clear input"
          >
            Clear
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        id="rich-text-input"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto bg-white"
        role="textbox"
        aria-label="Rich text input area"
        aria-multiline="true"
        tabIndex={0}
        suppressContentEditableWarning
      />
    </div>
  );
}
