import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getPostBySlug, getPosts, getRelatedPostsByCategory } from '../../lib/wp';
import { WPPost } from '../../types/wp';
import MetasArticle from '../../components/metasArticle/MetasArticle';
import ShareArticle from '../../components/shareArticle/ShareArticle';
import TableOfContent from '../../components/tableContents/TableOfContent';
import CodeHighlighterClient from '../../components/codeHighlighter/CodeHighlighterClient';
import Logo from '../../components/logo/Logo';
import { extractTerms } from '../../helpers/extractTerms';
import Tags from '../../components/tags/Tags';
import Breadcrumb, { BreadcrumbItem } from '@/app/components/breadcrumb/Breadcrumb';
import { HomeIcon } from '@/app/components/icons/icons';

import "./articles.scss"
import 'highlight.js/styles/grayscale.min.css';
import "./js-snippets.scss"
import RelatedPosts from '@/app/components/relatedPosts/RelatedPosts';

export const revalidate = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS);

/**
 * En build genera rutas estáticas para cada post
 */
export async function generateStaticParams() {
  const posts = await getPosts({ per_page: 100 });
  return posts.map((p) => ({ slug: p.slug }));
}

/**
 * 3. Metadata dinámica para cada post
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'Este artículo no existe o ha sido movido.',
    };
  }

  // Limpia el excerpt de etiquetas HTML y limita a 155 chars
  const cleanDescription = post.excerpt.rendered
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, 155);

  // Imagen destacada para Open Graph y Twitter
  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  const ogImage   = featured?.source_url;

  // Extrae categorías y tags
  const { categories, tags } = extractTerms(post);
  const categorySlug = categories[0]?.slug;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${categorySlug}/${post.slug}`;

  return {
    title: post.title.rendered,
    description: cleanDescription,
    keywords: tags.map((t) => t.name).join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title.rendered,
      description: cleanDescription,
      url: canonicalUrl,
      siteName: 'Mi Sitio',
      images: ogImage
        ? [
            {
              url: ogImage,
              width:
                featured.media_details?.sizes?.full?.width ||
                featured.media_details.width,
              height:
                featured.media_details?.sizes?.full?.height ||
                featured.media_details.height,
              alt: featured.alt_text || post.title.rendered,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: cleanDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

interface Props {
  params: Promise<{ slug: string, category: string }>;
}

export default async function PostPage({ params }: Props) {

  const { category: catSlug, slug: postSlug } = await params;
  const cat = await getCategoryBySlug(catSlug);
  if (!cat) return notFound();

  const post: WPPost | null = await getPostBySlug(postSlug);
  if (!post) return notFound();

  const relatedPosts = await getRelatedPostsByCategory({
    categoryId:   cat.id,
    excludePostId: post.id,
    per_page:     3,
  });

  const { categories, tags, authorName } = extractTerms(post);
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  const crumbs: BreadcrumbItem[] = [
    { label: <HomeIcon width={16} height={16} />, href: '/' },
    { label: categories[0].name,   href: `/${categories[0].slug}` },
    { label: post.title.rendered },
  ];

  // Prepare breadcrumb data for JSON-LD
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categories[0].name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${categories[0].slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title.rendered,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${categories[0].slug}/${post.slug}`
      }
    ]
  };

  return (
    <>
      <Script
        id="breadcrumb-ld-json"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      <article className="article">
        <header className="article__header">
          <Breadcrumb items={crumbs} />

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

      <RelatedPosts posts={relatedPosts} categorySlug={cat.slug} />
    </>
  );
}
