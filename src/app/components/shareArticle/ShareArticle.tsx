// src/components/shareArticle/ShareArticle.tsx
'use client';

import React, { useState } from 'react';
import { Facebook, TwitterX, Linkedin, Link as LinkIcon } from '../icons/icons';
import './share-article.scss';

interface ShareArticleProps {
  /** Título que aparecerá en el share; por defecto usará document.title */
  title?: string;
}

export default function ShareArticle({ title }: ShareArticleProps) {
  const [copied, setCopied] = useState(false);

  // URL actual de la página
  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  // Abre una ventana nueva con opciones seguras
  const openWindow = (url: string) => {
    window.open(
      url,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    );
  };

  // Handlers de cada red
  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    openWindow(url);
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(title ?? document.title);
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${text}`;
    openWindow(url);
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    openWindow(url);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copiando link:', err);
    }
  };

  return (
    <div className="share-article">
      <div className="share-article__content">
        <button
          type="button"
          aria-label="Compartir en Facebook"
          className="share-article__button"
          onClick={handleFacebook}
        >
          <Facebook width={20} height={20} fill="currentColor" />
        </button>

        <button
          type="button"
          aria-label="Compartir en X (Twitter)"
          className="share-article__button"
          onClick={handleTwitter}
        >
          <TwitterX width={20} height={20} fill="currentColor" />
        </button>

        <button
          type="button"
          aria-label="Compartir en LinkedIn"
          className="share-article__button"
          onClick={handleLinkedIn}
        >
          <Linkedin width={20} height={20} fill="currentColor" />
        </button>

        <button
          type="button"
          aria-label="Copiar enlace"
          className="share-article__button"
          onClick={handleCopyLink}
        >
          <LinkIcon width={20} height={20} fill="currentColor" />
        </button>
      </div>

      {copied && (
        <div className="share-article__toast">
          ¡Enlace copiado!
        </div>
      )}
    </div>
  );
}
