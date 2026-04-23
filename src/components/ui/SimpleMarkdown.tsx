import React from "react";

interface SimpleMarkdownProps {
  content: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
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
      parts.push(<code key={match.index} className="text-cyan bg-cyan/10 px-1.5 py-0.5 rounded text-sm font-mono break-words">{match[4]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith("|") && t.endsWith("|") && t.length > 1;
}

function isTableSeparator(line: string): boolean {
  const t = line.trim();
  return isTableRow(t) && /^\|?[\s:|-]+\|?$/.test(t) && t.includes("-");
}

function splitTableRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return t.split("|").map((c) => c.trim());
}

export function SimpleMarkdown({ content }: SimpleMarkdownProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Fenced code block: ```lang ... ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      // Skip closing fence
      if (i < lines.length) i++;
      elements.push(
        <div key={`code-${i}`} className="my-4 border border-cyan/15 bg-[#0a0e17] overflow-hidden">
          {lang && (
            <div className="px-3 py-1.5 border-b border-cyan/10 bg-cyan/[0.03] font-mono text-[10px] text-cyan/70 uppercase tracking-widest">
              {lang}
            </div>
          )}
          <div className="overflow-x-auto">
            <pre className="p-4 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 min-w-0">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        </div>
      );
      continue;
    }

    // Horizontal rule: --- or ***
    if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-cyan/15" />
      );
      i++;
      continue;
    }

    // Table: row followed by separator
    if (
      isTableRow(trimmed) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const headers = splitTableRow(trimmed);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      elements.push(
        <div key={`tbl-${i}`} className="my-6 -mx-4 sm:mx-0 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm border border-cyan/15">
            <thead className="bg-cyan/5">
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} className="px-3 py-2 text-left font-mono text-xs text-cyan font-semibold border-b border-cyan/15">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-cyan/8 hover:bg-cyan/[0.03]">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-slate-300 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H3: ###
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg sm:text-xl font-bold text-white mt-8 mb-3 font-mono">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // H2: ##
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4 font-mono border-b border-cyan/12 pb-2">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote: >
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote key={`bq-${i}`} className="my-4 border-l-2 border-cyan/50 pl-4 italic text-text-body">
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="my-1">{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        items.push(
          <li key={i} className="flex items-start gap-2 text-slate-300">
            <span className="text-cyan mt-1 shrink-0">▹</span>
            <span className="min-w-0 break-words">{renderInline(itemText)}</span>
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

    // Unordered list
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- "))) {
        const itemText = lines[i].trim().slice(2);
        items.push(
          <li key={i} className="flex items-start gap-2 text-slate-300">
            <span className="text-cyan mt-1 shrink-0">▹</span>
            <span className="min-w-0 break-words">{renderInline(itemText)}</span>
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
      <p key={i} className="text-slate-300 leading-relaxed my-4 break-words">
        {renderInline(trimmed)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}
