import React, { useMemo } from 'react';
import katex from 'katex';

export default function KaTeXMath({ math, block = true, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return `<span>${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`katex-math-render ${block ? 'block my-1 overflow-x-auto py-1' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
