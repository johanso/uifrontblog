// types/wp.ts

/** Media embebida (featured media) */
export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      [size: string]: {
        file: string;
        width: number;
        height: number;
        source_url: string;
      };
    };
  };
}

/** Autor embebido */
export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  avatar_urls: {
    [size: string]: string;
  };
}

/** Taxonomías (categorías y tags) */
export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  description: string;
  taxonomy: 'category' | 'post_tag';
}

/** La estructura principal de un post */
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  tags: number[];
  categories: number[];
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[];
    author?: WPAuthor[];
    'wp:term'?: WPTerm[][];
  };
}