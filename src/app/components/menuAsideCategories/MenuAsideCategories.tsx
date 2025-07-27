import { WPTerm } from '@/app/types/wp'
import React from 'react'
import Link from 'next/link'
import './menu-aside-categories.scss'
import Logo from '../logo/Logo'
import SocialBlog from '../socialBlog/SocialBlog'

const MenuAsideCategories = ({ categories, logo }: { categories: WPTerm[]; logo?: boolean }) => {
  return (
    <div className='menu-aside-categories'>

      {logo && (
        <div className="menu-aside-categories__logo">
          <Logo />
        </div>
      )}

      <ul className="menu-aside-categories__list">
        {categories.map((category) => (
          <li className="menu-aside-categories__item" key={category.id}>
            {
              category.name === 'Uncategorized' ? (
                null
              ) : (
                <Link 
                  href={`/${category.slug}`}
                className={
                `menu-aside-categories__item-link menu-aside-categories__item-link--${category.slug}`
                }
                >{category.name}</Link>
              )
            }
          </li>
        ))}
      </ul>

    </div>
  )
}

export default MenuAsideCategories