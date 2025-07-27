'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { WPPost, WPTerm } from '../../types/wp';
import './list-post.scss';
import Button from '../button/Button';

interface Props {
  initialPosts: WPPost[];
  initialPage:  number;
  perPage:      number;
  filter?:      { categoryId?: number };
}

export default function ListPost({ initialPosts, initialPage, perPage, filter }: Props) {
  const [posts, setPosts]     = useState<WPPost[]>(initialPosts);
  const [page, setPage]       = useState<number>(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts?.length === perPage);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/posts?page=${nextPage}&per_page=${perPage}${filter?.categoryId ? `&categories=${filter.categoryId}` : ''}`);
    const { posts: newPosts }: { posts: WPPost[] } = await res.json();
    setLoading(false);

    // Si no llegó el full batch, ya no hay más
    if (newPosts.length < perPage) setHasMore(false);

    setPosts(prev => [...prev, ...newPosts]);
    setPage(nextPage);
  };

  return (
    <section className='post-list'>
      <ul className="post-list__list">
        {posts?.map((post) => {
          const terms: WPTerm[][] = post._embedded?.['wp:term'] || [];
          const categories: WPTerm[] = terms.flat().filter(t => t.taxonomy === 'category');

          return (
            <li key={post.id} className="post-list__item">
              <div className="post-list__meta">
                {categories.length > 0 && (
                  <p className="post-list__categories">
                    {categories.map((cat, i) => (
                      <Link
                        key={cat.id}
                        href={`/${cat.slug}`}
                        className={`post-list__category post-list__category--${cat.slug}`}
                      >
                        {cat.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </Link>
                    ))}
                  </p>
                )}
              </div>

              <Link href={categories.length ? `/${categories[0].slug}/${post.slug}` : `/${post.slug}`}>
                <h2 className="post-list__title"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Link>

              <div className="post-list__excerpt"
                 dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                 suppressHydrationWarning
              />
            </li>
          );
        })}
      </ul>

      {hasMore && (
         <Button
           className="btn-sm btn-outline-secondary btn-rounded"
           onClick={loadMore}
           disabled={loading}
         >
           {loading ? 'Cargando…' : 'Cargar más'}
         </Button>
       )}

    </section>
  );
}
