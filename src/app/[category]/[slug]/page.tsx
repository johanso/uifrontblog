import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '../../lib/wp';
import { WPPost } from '../../types/wp';
import MetasArticle from '../../components/metasArticle/MetasArticle';
import ShareArticle from '../../components/shareArticle/ShareArticle';
import TableOfContent from '../../components/tableContents/TableOfContent';
import CodeHighlighterClient from '../../components/codeHighlighter/CodeHighlighterClient';

import "./articles.scss"
import 'highlight.js/styles/grayscale.min.css';
import "./js-snippets.scss"
import Logo from '../../components/logo/Logo';

import { extractTerms } from '../../helpers/extractTerms';
import Tags from '../../components/tags/Tags';


export const revalidate = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS);

/**
 * En build genera rutas estáticas para cada post
 */
export async function generateStaticParams() {
  const posts = await getPosts({ per_page: 100 });
  return posts.map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post: WPPost | null = await getPostBySlug(slug);
  if (!post) return notFound();

  const { categories, tags, authorName } = extractTerms(post);
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <main className="container">
      <article className="article">
        <header className="article__header">
          <h1 className="article__title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          
          <div className="article__meta">
            <MetasArticle
              categories={categories}
              authorName={authorName}
              post={post}
            />
          </div>
        </header>

        {/* Contenido image destacada */}
        <div className="article__featured-image">
          <Image
            src={featuredMedia?.source_url || '/images/default.jpg'}
            alt={featuredMedia?.alt_text || post.title.rendered}
            width={featuredMedia?.media_details?.width || 100}
            height={featuredMedia?.media_details?.height || 100}
            className="image"
            priority
          />
        </div>

        <section className="article__content prose" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        <CodeHighlighterClient />

        <div className="article__meta-share">
          <Tags tags={tags} />
          <ShareArticle />
        </div>

        <aside className="article__aside">
          <div className="article__aside-logo">
            <Logo />
          </div>
          <TableOfContent />
        </aside>
      </article>
    </main>
  );
}
