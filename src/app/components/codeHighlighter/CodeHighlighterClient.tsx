'use client';
import dynamic from 'next/dynamic';

const CodeHighlighter = dynamic(
  () => import('./CodeHighlighter'),
  { ssr: false }
);

export default function CodeHighlighterClient() {
  return <CodeHighlighter />;
}