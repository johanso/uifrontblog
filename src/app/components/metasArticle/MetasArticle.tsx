'use client';
import React from 'react'
import './meta-article.scss'
import Image from 'next/image';
import { WPPost, WPTerm } from '@/app/types/wp';
import Link from 'next/link';
import { formatDateES } from '@/lib/date';

const MetasArticle = (
  {
    categories,
    authorName,
    post
  }: {
    categories: WPTerm[];
    authorName: string;
    post: WPPost;
  }
) => {

  const {name, slug} = categories[0];
  
  return (
    <div className='meta-article'>
      <div className="meta-article__author">
        <div className="meta-article__author-image">
          <Image 
            src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg" 
            alt="" 
            width={100}
            height={100}
            className="box-author__image"
            priority
          />
        </div>
        <h4 className="author-name">{authorName}</h4>
      </div>
      <span>&#8226;</span>
      <span className='meta-article__category'>
        <Link href={`/${slug}`}>{name}</Link>
      </span> 
      <span>&#8226;</span>
      <span className='meta-article__date'>{formatDateES(post.date)}</span>
    </div>
  )
}

export default MetasArticle