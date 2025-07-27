import React from 'react'
import { WPTerm } from '@/app/types/wp';
import Link from 'next/link';
import './tags.scss'
import { TagsIcon } from '../icons/icons';

const Tags = ({ tags }: { tags: WPTerm[] }) => {
  return (
    <div className="tags">
      <span className="tags__icon">
        <TagsIcon width={16} height={16} fill="currentColor" />
      </span>
      {tags.map(({name, slug}, index) => (
        <Link href={`/${slug}`} key={index} className="tags__tag">
         {name}
        </Link>
      ))}
    </div>
  )
}

export default Tags