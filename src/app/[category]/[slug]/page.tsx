import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser';
import { getPostBySlug, getPosts, getRelatedPostsByCategory } from '../../lib/wp';
import { WPPost } from '../../types/wp';
import MetasArticle from '../../components/metasArticle/MetasArticle';
import ShareArticle from '../../components/shareArticle/ShareArticle';
import TableOfContent from '../../components/tableContents/TableOfContent';
import Logo from '../../components/logo/Logo';
import { extractTerms } from '../../helpers/extractTerms';
import Tags from '../../components/tags/Tags';
import Breadcrumb, { BreadcrumbItem } from '@/app/components/breadcrumb/Breadcrumb';
import { HomeIcon } from '@/app/components/icons/icons';

import "./articles.scss"
import 'highlight.js/styles/grayscale.min.css';
import "./js-snippets.scss"
import RelatedPosts from '@/app/components/relatedPosts/RelatedPosts';
import CodeHighlighter from '@/app/components/codeHighlighter/CodeHighlighter';
import InteractiveCodeBlock from '@/app/components/interactiveCodeBlock/InteractiveCodeBlock';

export const revalidate = 3600;

/**
 * En build genera rutas estáticas para cada post
 */
export async function generateStaticParams() {
  const posts = await getPosts({ per_page: 100 });
  return posts.flatMap(post => {
    const { categories } = extractTerms(post);
    if (categories.length === 0) return [];
    const primaryCategory = categories[0];
    return {
      category: primaryCategory.slug,
      slug: post.slug,
    };
  });
}

/**
 * 3. Metadata dinámica para cada post
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {

  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

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
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${categorySlug}/${post.slug}`

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
  let post: WPPost | null;

  try {
    post = await getPostBySlug(postSlug);
  } catch (error) {
    console.error(`Error al obtener el post "${postSlug}":`, error);
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  const { categories, tags, authorName } = extractTerms(post);
  const postCategory = categories.find(c => c.slug === catSlug);

  if (!postCategory) return notFound();

  let relatedPosts: WPPost[] = [];

  try {
    relatedPosts = await getRelatedPostsByCategory({
      categoryId: postCategory.id,
      excludePostId: post.id,
      per_page: 3,
    });
  } catch (error) {
    console.error(`Error al obtener posts relacionados para la categoría "${postCategory.slug}":`, error);
  }

  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  const crumbs: BreadcrumbItem[] = [
    { label: <HomeIcon width={16} height={16} />, href: '/' },
    { label: postCategory.name,   href: `/${postCategory.slug}` },
    { label: post.title.rendered },
  ];

  const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs?.class?.includes('wp-block-js-snippets-code-block')) {
      
      // --- 👇 LA LÓGICA CORREGIDA ESTÁ AQUÍ 👇 ---

      // 1. Encontramos el primer 'div' hijo, que es el contenedor intermedio.
      const innerWrapper = domNode.children.find(
        (child): child is Element => child instanceof Element && child.name === 'div'
      );
      if (!innerWrapper) return; // Si no lo encontramos, no hacemos nada.

      // 2. AHORA, dentro de ese contenedor intermedio, buscamos el <pre>.
      const preElement = innerWrapper.children.find(
        (child): child is Element => child instanceof Element && child.name === 'pre'
      );
      if (!preElement) return;

      // 3. Dentro del <pre>, buscamos el <code>.
      const codeElement = preElement.children.find(
        (child): child is Element => child instanceof Element && child.name === 'code'
      );

      // 4. Extraemos el texto del código de forma segura.
      if (codeElement && codeElement.children[0]?.type === 'text') {
        const codeString = codeElement.children[0].data;
        const language = preElement.attribs.class?.replace('language-', '') || 'code';
        
        // Filtramos los hijos para quitar el header Y el footer originales de WordPress.
        const contentChildren = innerWrapper.children.filter(
          child => !(child instanceof Element && 
            (child.attribs?.class?.includes('js-snippet-header') || child.attribs?.class?.includes('js-snippet-footer')))
        );

        return (
          <InteractiveCodeBlock codeString={codeString} language={language}>
            {/* Pasamos solo el contenido relevante (el <pre>) */}
            {domToReact(contentChildren as DOMNode[])}
          </InteractiveCodeBlock>
        );
      }
    }
    
    // Tu lógica para las imágenes <img> se mantiene igual.
    if (domNode instanceof Element && domNode.name === 'img') {
      const { src, alt, width, height } = domNode.attribs;
      return (
        <Image
          src={src} alt={alt}
          width={Number(width) || 800} height={Number(height) || 400}
          className="image-content"
        />
      );
    }
  },
};


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

        <section className="article__content prose">
          {parse(post.content.rendered, options)}
        </section>
        <CodeHighlighter />

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

      <RelatedPosts posts={relatedPosts} categorySlug={postCategory.slug} />
    </>
  );
}
