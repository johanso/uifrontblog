import type { Metadata } from 'next';
import { getCategories, getPosts } from './lib/wp';
import { WPPost } from './types/wp';
import ListPost from './components/listPost/ListPost';
import MenuAsideCategories from './components/menuAsideCategories/MenuAsideCategories';
import { siteConfig } from '@/config/site';
import './page.scss'

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const { siteUrl, title, description } = siteConfig;
  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
export default async function BlogPage() {

  const initialPage   = 1;
  const perPage       = 10;
  const posts: WPPost[]   = await getPosts({ page: initialPage, per_page: perPage });
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
          />
        </div>
      </div>
    </main>
  );
}
