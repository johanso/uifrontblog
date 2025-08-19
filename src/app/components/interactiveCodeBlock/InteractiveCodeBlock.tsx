// src/app/components/interactiveCodeBlock/InteractiveCodeBlock.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clipboard, Check } from 'lucide-react';

interface InteractiveCodeBlockProps {
  codeString: string;
  language: string;
  children: React.ReactNode;
}

export default function InteractiveCodeBlock({ codeString, language, children }: InteractiveCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    // Contenedor principal para el borde y las esquinas redondeadas
    <div className="wp-block-js-snippets-code-block">
      
      {/* === EL NUEVO HEADER MEJORADO === */}
      <div className="js-snippet-code">

        <div className='js-snippet-header'>
          <span className="js-snippet-language">
            {language}
          </span>
          <button
            className="js-snippet-copy" 
            onClick={handleCopy}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copiado!</span>
              </>
            ) : (
              <Clipboard className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
            
        {children}
      </div>
      
    </div>
  );
}