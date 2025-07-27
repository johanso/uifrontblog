import type { WPPost, WPTerm } from '../types/wp';

export function extractTerms(post: WPPost): {
  categories: WPTerm[];
  tags:       WPTerm[];
  authorName: string;
} {
  const termsMatrix = post._embedded?.['wp:term'] ?? [];
  const allTerms = termsMatrix.flat();
  const authorName = post._embedded?.author?.[0]?.name || 'Desconocido';

  return {
    categories: allTerms.filter((t) => t.taxonomy === 'category'),
    tags:       allTerms.filter((t) => t.taxonomy === 'post_tag'),
    authorName
  };
}
