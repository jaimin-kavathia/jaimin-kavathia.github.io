/** Minimal Dart colouring for short code samples, done at build time. */
export function highlightDart(code: string): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped
    .split('\n')
    .map((line) => {
      const comment = line.indexOf('//');
      const source = comment >= 0 ? line.slice(0, comment) : line;
      const rest = comment >= 0 ? `<span class="tk-c">${line.slice(comment)}</span>` : '';
      const coloured = source.replace(
        /('(?:[^'\\]|\\.)*')|\b(final|await|const|var|if|else|for|in|return|true|false|null)\b|\b([A-Z][A-Za-z0-9]+)\b|\b([a-z][A-Za-z0-9]*)(?=:)|\.([a-z][A-Za-z0-9]*)(?=\()/g,
        (match, text, keyword, type, property, method) => {
          if (text) return `<span class="tk-s">${text}</span>`;
          if (keyword) return `<span class="tk-k">${keyword}</span>`;
          if (type) return `<span class="tk-t">${type}</span>`;
          if (property) return `<span class="tk-p">${property}</span>`;
          if (method) return `.<span class="tk-f">${method}</span>`;
          return match;
        },
      );
      return coloured + rest;
    })
    .join('\n');
}
