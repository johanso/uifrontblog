import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { WPPost } from '@/app/types/wp'
import './card-article.scss'
import { extractTerms } from '@/app/helpers/extractTerms';
import { formatDateES } from '@/lib/date';

interface Props {
  post: WPPost;
  categorySlug: string;
}

const CardArticle = (
  {
    post,
    categorySlug
  }: Props
) => {

    const { authorName, categories } = extractTerms(post);
  

  return (
    <article className="card-article">
      <div className="card-article__image">
        <Link href={`/${categorySlug}/${post.slug}`}>
          <Image
            src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''}
            alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || ''}
            width={200}
            height={200}  
            className="image"
            priority
          />
        </Link>
      </div>
      <div className="card-article__content">
        <Link href={`/${categorySlug}/${post.slug}`}>
          <h3 className="card-article__title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </Link>
        <div className="card-article__meta">
          <span className="card-article__date">{formatDateES(post.date)}</span>
          <span>&#8226;</span>
          <span className="card-article__category">{categories[0].name}</span>
        </div>
      </div>
    </article>
  )
}

export default CardArticle