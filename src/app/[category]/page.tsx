// src/app/[category]/page.tsx
import { notFound } from 'next/navigation';
import { WPPost } from '../types/wp';
import ListPost from '../components/listPost/ListPost';
import { getCategories, getCategoryBySlug, getPostsByCategory } from '../lib/wp';
import MenuAsideCategories from '../components/menuAsideCategories/MenuAsideCategories';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const revalidate = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS);

interface Params { params: Promise<{ category: string }> }

// Pre-render de todas las categorías
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map(c => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.category);
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
