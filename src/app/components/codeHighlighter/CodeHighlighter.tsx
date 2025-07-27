'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
// Importa los lenguajes que necesites:
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
// registra:
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);

export default function CodeHighlighter() {
  useEffect(() => {
    // encuentra todos los <pre><code> y aplica el resaltado
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, []);

  return null;
}
