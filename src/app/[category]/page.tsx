// src/app/[category]/page.tsx

import { notFound } from 'next/navigation';
import { WPPost } from '../types/wp';
import ListPost from '../components/listPost/ListPost';
import { getCategories, getCategoryBySlug, getPostsByCategory } from '../lib/wp';
import MenuAsideCategories from '../components/menuAsideCategories/MenuAsideCategories';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const revalidate = 3600;

interface Params { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map(c => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  // 2. Resolver la promesa con await
  const { category } = await params;
  
  const cat = await getCategoryBySlug(category);
  if (!cat) {
    return {
      title: 'Categoría no encontrada',
      description: siteConfig.description,
    };
  }
  const baseTitle = siteConfig.title;
  const url = `${siteConfig.siteUrl}/${cat.slug}`;

  return {
    title: `${cat.name} – ${baseTitle}`,
    description: cat.description || siteConfig.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.name} – ${baseTitle}`,
      description: cat.description,
      url,
      siteName: baseTitle,
    },
    twitter: {
      card: 'summary',
      title: cat.name,
      description: cat.description,
    },
  };
}

// Esta parte ya estaba correcta
export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;

  const cat = await getCategoryBySlug(slug);
  if (!cat) return notFound();

  const initialPage = 1;
  const perPage     = 10;
  const posts: WPPost[] = await getPostsByCategory(cat.id, initialPage, perPage);
  const categories   = await getCategories();

  return (
    <div className="page page--right-aside">
      <aside className="page__aside">
        <MenuAsideCategories 
          logo={true}
          categories={categories}
          activeCategory={cat.slug}
        />
      </aside>
      <div className="page__content">
        <ListPost 
          initialPosts={posts}
          perPage={perPage}
          initialPage={initialPage}
          filter={{ categoryId: cat.id }}
        />
      </div>
    </div>
  );
}