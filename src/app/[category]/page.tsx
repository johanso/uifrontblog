// src/app/[category]/page.tsx
import { notFound } from 'next/navigation';
import { WPPost } from '../types/wp';
import ListPost from '../components/listPost/ListPost';
import { getCategories, getCategoryBySlug, getPostsByCategory } from '../lib/wp';
import MenuAsideCategories from '../components/menuAsideCategories/MenuAsideCategories';

export const revalidate = 60;

interface Params { params: Promise<{ category: string }> }

// Pre-render de todas las categorías
export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map(c => ({ category: c.slug }));
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
