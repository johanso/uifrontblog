// src/app/[category]/page.tsx
import { notFound } from 'next/navigation';
import { WPPost } from '../types/wp';
import ListPost from '../components/listPost/ListPost';
import { getCategories, getCategoryBySlug, getPostsByCategory } from '../lib/wp';
import MenuAsideCategories from '../components/menuAsideCategories/MenuAsideCategories';

export const revalidate = 60;

interface Params { params: { category: string } }

// Pre-render de todas las categorías
export async function generateStaticParams(): Promise<Params['params'][]> {
  const cats = await getCategories();
  return cats.map(c => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return notFound();

  const initialPage = 1;
  const perPage     = 10;
  const posts: WPPost[] = await getPostsByCategory(cat.id, initialPage, perPage);
  const categories   = await getCategories();

  return (
    <main className="container">
      <div className="page page--right-aside">
        <aside className="page__aside">
          <MenuAsideCategories 
            logo={true}
            categories={categories}
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
    </main>
    // <main className="container">
    //   <h1>Categoría: {cat.name}</h1>
    //   <ListPost
    //     initialPosts={posts}
    //     initialPage={initialPage}
    //     perPage={perPage}
    //     // Si quisieras que loadMore filtre por categoryId:
    //     filter={{ categoryId: cat.id }}
    //   />
    // </main>
  );
}
