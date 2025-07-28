// lib/wp.ts

import type { WPPost, WPTerm, WPAuthor } from '../types/wp';

const WP_URL = process.env.WP_URL!;
const AUTH = Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString('base64');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${AUTH}`,
};

/**
 * Cliente genérico para llamar a WP REST API
 */
async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${WP_URL}/wp-json/wp/v2/${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP API ${endpoint} error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Obtiene lista de posts, embebiendo featured media y términos (categories/tags)
 */
export async function getPosts({
  page = 1,
  per_page = 10,
}: {
  page?: number;
  per_page?: number;
} = {}): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('posts', {
    page: String(page),
    per_page: String(per_page),
    _embed: 'wp:featuredmedia,wp:term',
  });
}

/**
 * Obtiene un post por slug, con media, autor y términos embebidos
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>('posts', {
    slug,
    _embed: 'wp:featuredmedia,author,wp:term',
  });
  return posts[0] ?? null;
}

/**
 * Lista todos los tags
 */
export async function getTags(): Promise<WPTerm[]> {
  return wpFetch<WPTerm[]>('tags', {
    per_page: '100',
  });
}

/**
 * Obtiene un autor por ID
 */
export async function getAuthor(id: number): Promise<WPAuthor> {
  return wpFetch<WPAuthor>(`users/${id}`);
}

/**
 * Lista todas las categorías
 */
export async function getCategories(): Promise<WPTerm[]> {
  return wpFetch<WPTerm[]>('categories', { per_page: '100' });
}

/**
 * Obtiene una categoría por slug
 */
export async function getCategoryBySlug(slug: string): Promise<WPTerm | null> {
  const cats = await wpFetch<WPTerm[]>('categories', { slug });
  return cats[0] ?? null;
}

/**
 * Obtiene lista de posts, embebiendo featured media y términos (categories/tags)
 */
export async function getPostsByCategory(
  categoryId: number,
  page = 1,
  per_page = 10
): Promise<WPPost[]> {
  return wpFetch<WPPost[]>('posts', {
    categories: String(categoryId),
    _embed:     'wp:featuredmedia,wp:term,author',
    page:       String(page),
    per_page:   String(per_page),
  });
}

/**
 * Obtiene un post por slug, con media, autor y términos embebidos
 */
export async function getPostBySlugAndCategory(
  slug: string,
  categoryId: number
): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>('posts', {
    slug,
    categories: String(categoryId),
    _embed:     'wp:featuredmedia,wp:term,author',
  });
  return posts[0] ?? null;
}

/** Extrae el site name y tagline desde el root endpoint */
export async function getSiteMeta(): Promise<{
  name: string;
  description: string;
  url: string;
  home: string;
}> {
  const res = await fetch(`${WP_URL}/wp-json`);
  if (!res.ok) throw new Error('No se pudo cargar site meta de WP');
  const data = await res.json();
  return {
    name:        data.name,
    description: data.description,
    url:         data.url,
    home:        data.home,
  };
}

/**
 * Obtiene lista de posts relacionados por categoría, excluyendo el post actual
 */
export async function getRelatedPostsByCategory({
  categoryId,
  excludePostId,
  per_page = 3,
}: {
  categoryId: number;
  excludePostId: number;
  per_page?: number;
}): Promise<WPPost[]> {
  // Pedimos un poco más para luego filtrar
  const posts = await wpFetch<WPPost[]>('posts', {
    categories: String(categoryId),
    per_page:   String(per_page + 1),
    _embed:     'wp:featuredmedia,wp:term',
  });
  // Excluimos el post actual y cortamos al tamaño deseado
  return posts
    .filter((p) => p.id !== excludePostId)
    .slice(0, per_page);
}