// src/app/components/codeHighlighter/CodeHighlighter.tsx

'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // O el tema que prefieras

export default function CodeHighlighter() {
  useEffect(() => {
    // ESTA LÍNEA ES PARA DEPURAR
    console.log('CodeHighlighter está intentando resaltar el código...');
    
    try {
      hljs.highlightAll();
    } catch (error) {
      console.error('Error al ejecutar highlight.js:', error);
    }
  }, []);

  return null;
}