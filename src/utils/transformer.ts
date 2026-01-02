/**
 * Transforms rich text HTML into a deterministic, token-compact prompt.
 *
 * Rules:
 * - Trim leading and trailing spaces per line
 * - Collapse multiple spaces inside a line into one
 * - Remove empty lines completely
 * - Preserve meaningful line breaks using \n
 * - Each paragraph becomes one single line
 * - Paragraphs are separated by exactly one \n
 * - Nested lists with different types: main keeps format, sub uses proper format
 * - Nested lists with same type: main becomes "- item: sub1, sub2, sub3"
 * - No trailing whitespace anywhere
 *
 * @param html - Rich text HTML string
 * @returns Optimized prompt string
 */
export function transformToPrompt(html: string): string {
  if (!html || html.trim().length === 0) {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Extract text content preserving structure
  const lines: string[] = [];

  function getListType(element: HTMLElement): 'ol' | 'ul' | null {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'ol') return 'ol';
    if (tagName === 'ul') return 'ul';
    return null;
  }

  function getTextBeforeNestedList(element: HTMLElement): string {
    let text = '';

    function extractText(node: Node): void {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Stop if we hit a nested list
        if (tagName === 'ol' || tagName === 'ul') {
          return;
        }

        // Recursively extract text from children
        for (const child of el.childNodes) {
          extractText(child);
        }
      }
    }

    for (const child of element.childNodes) {
      extractText(child);
    }

    return text.trim();
  }

  function processListItem(li: HTMLElement, parentListType: 'ol' | 'ul', index: number): void {
    // Find nested lists
    const nestedLists = Array.from(li.children).filter(
      (child) => child.tagName.toLowerCase() === 'ol' || child.tagName.toLowerCase() === 'ul'
    );

    const mainText = getTextBeforeNestedList(li);

    if (nestedLists.length === 0) {
      // Simple list item with no nesting
      if (mainText) {
        const prefix = parentListType === 'ol' ? `${index}.` : '-';
        lines.push(`${prefix} ${mainText}`);
      }
    } else {
      // Has nested lists
      const nestedList = nestedLists[0] as HTMLElement;
      const nestedType = getListType(nestedList);
      const nestedItems: string[] = [];

      // Collect nested items
      Array.from(nestedList.children).forEach((child) => {
        if (child.tagName.toLowerCase() === 'li') {
          let itemText = child.textContent?.trim() || '';
          // Trim trailing period from nested items
          if (itemText.endsWith('.')) {
            itemText = itemText.slice(0, -1).trim();
          }
          if (itemText) {
            nestedItems.push(itemText);
          }
        }
      });

      if (mainText && nestedItems.length > 0) {
        // Check if same type (both numbered or both bulleted)
        const sameType = parentListType === nestedType;

        if (sameType) {
          // Same type: use "- main: sub1, sub2, sub3" format
          const subItemsText = nestedItems.join(', ');

          // Check if main text already ends with colon
          const mainTextNormalized = mainText.trim();
          const needsColon = !mainTextNormalized.endsWith(':');

          if (needsColon) {
            lines.push(`- ${mainTextNormalized}: ${subItemsText}`);
          } else {
            lines.push(`- ${mainTextNormalized} ${subItemsText}`);
          }
        } else {
          // Different types: main keeps its format, sub items use proper format
          const mainPrefix = parentListType === 'ol' ? `${index}.` : '-';
          lines.push(`${mainPrefix} ${mainText}`);

          // Add nested items with proper prefix
          nestedItems.forEach((item) => {
            lines.push(`- ${item}`);
          });
        }
      } else if (mainText) {
        const prefix = parentListType === 'ol' ? `${index}.` : '-';
        lines.push(`${prefix} ${mainText}`);
      } else if (nestedItems.length > 0) {
        // No main text, just nested items
        nestedItems.forEach((item) => {
          const prefix = nestedType === 'ol' ? '-' : '-';
          lines.push(`${prefix} ${item}`);
        });
      }
    }
  }

  function processNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const trimmed = text.trim();
      // Only add standalone text nodes (not inside lists)
      if (trimmed && !isInsideList(node)) {
        lines.push(trimmed);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Handle paragraphs
      if (tagName === 'p') {
        const text = element.textContent?.trim() || '';
        if (text) {
          lines.push(text);
        }
      }
      // Handle ordered lists
      else if (tagName === 'ol') {
        let index = 1;
        Array.from(element.children).forEach((child) => {
          if (child.tagName.toLowerCase() === 'li') {
            processListItem(child as HTMLElement, 'ol', index);
            index++;
          }
        });
      }
      // Handle unordered lists
      else if (tagName === 'ul') {
        Array.from(element.children).forEach((child) => {
          if (child.tagName.toLowerCase() === 'li') {
            processListItem(child as HTMLElement, 'ul', 0);
          }
        });
      }
      // Handle headings
      else if (tagName.match(/^h[1-6]$/)) {
        const text = element.textContent?.trim() || '';
        if (text) {
          lines.push(text);
        }
      }
      // Handle divs and other containers
      else if (tagName === 'div' || tagName === 'section' || tagName === 'article') {
        Array.from(element.childNodes).forEach((child) => processNode(child));
      }
      // Skip br, li (handled by parent list)
      else if (tagName !== 'br' && tagName !== 'li') {
        Array.from(element.childNodes).forEach((child) => processNode(child));
      }
    }
  }

  function isInsideList(node: Node): boolean {
    let parent = node.parentElement;
    while (parent) {
      const tagName = parent.tagName.toLowerCase();
      if (tagName === 'ol' || tagName === 'ul' || tagName === 'li') {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  // Process all child nodes
  Array.from(temp.childNodes).forEach((node) => processNode(node));

  // Post-process lines
  const processedLines = lines
    .map((line) => line.trim()) // Trim each line
    .map((line) => line.replace(/\s+/g, ' ')) // Collapse multiple spaces
    .filter((line) => line.length > 0); // Remove empty lines

  // Join with single newline and ensure no trailing whitespace
  return processedLines.join('\n').trim();
}

/**
 * Transforms plain text into optimized prompt format.
 * Handles text pasted without HTML formatting.
 */
export function transformPlainText(text: string): string {
  if (!text || text.trim().length === 0) {
    return '';
  }

  // Split into lines
  const lines = text.split('\n');

  // Process each line
  const processedLines = lines
    .map((line) => line.trim()) // Trim each line
    .map((line) => line.replace(/\s+/g, ' ')) // Collapse multiple spaces
    .filter((line) => line.length > 0); // Remove empty lines

  // Join with single newline
  return processedLines.join('\n').trim();
}
