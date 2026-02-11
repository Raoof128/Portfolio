import React from "react";

interface SimpleMarkdownProps {
  content: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**, `code`, and plain text
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="text-white font-semibold">{match[2]}</strong>);
    } else if (match[4]) {
      parts.push(<code key={match.index} className="text-cyan bg-cyan/10 px-1.5 py-0.5 rounded text-sm font-mono">{match[4]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function SimpleMarkdown({ content }: SimpleMarkdownProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === "") {
      i++;
      continue;
    }

    // H3: ###
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3 font-mono">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // H2: ##
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4 font-mono border-b border-white/10 pb-2">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // Ordered list: 1. or 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(
          <li key={i} className="flex items-start gap-2 text-zinc-300">
            <span className="text-cyan mt-1 shrink-0">▹</span>
            <span>{renderInline(itemText)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4">
          {items}
        </ol>
      );
      continue;
    }

    // Unordered list: * or -
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- "))) {
        const itemText = lines[i].trim().slice(2);
        items.push(
          <li key={i} className="flex items-start gap-2 text-zinc-300">
            <span className="text-cyan mt-1 shrink-0">▹</span>
            <span>{renderInline(itemText)}</span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-4">
          {items}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-zinc-300 leading-relaxed my-4">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}
