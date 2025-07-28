import React from 'react'
import { WPPost } from '@/app/types/wp'
import CardArticle from '../cardArticle/CardArticle';
import './relate-post.scss'

interface Props {
  posts: WPPost[];
  categorySlug: string;
}

const RelatedPosts = ({
    posts,
    categorySlug
  }: Props
) => {
  return (
    <>
      {posts.length > 0 ? (
      <div className="relate-post">
        <h2 className="relate-post__title">
          <span>Artículos relacionados</span>
        </h2>
        <div className="relate-post__list">
          {posts.map((post) => (
            <CardArticle key={post.id} post={post} categorySlug={categorySlug} />
          ))}
        </div>
      </div>
      ) : null}
    </>
  )
}

export default RelatedPosts