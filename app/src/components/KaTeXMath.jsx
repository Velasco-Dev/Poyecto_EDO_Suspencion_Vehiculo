import React, { useMemo } from 'react';
import katex from 'katex';

export default function KaTeXMath({ math, block = true, inline, className = '' }) {
  const isBlock = inline !== undefined ? !inline : block;
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: isBlock,
        throwOnError: false
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return `<span>${math}</span>`;
    }
  }, [math, isBlock]);

  return (
    <span
      className={`katex-math-render ${isBlock ? 'block my-1 overflow-x-auto py-1' : 'inline-block align-baseline mx-0.5'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
