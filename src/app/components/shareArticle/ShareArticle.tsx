import React from 'react'
import { Facebook, Link, Linkedin, TwitterX } from '../icons/icons'
import './share-article.scss'

const ShareArticle = () => {
  return (
    <div className="share-article">
      <div className="share-article__content">
        <button className="share-article__button">
          <Facebook width={20} height={20} fill="currentColor" />
        </button>
        <button className="share-article__button">
          <TwitterX width={20} height={20} fill="currentColor" />
        </button>
        <button className="share-article__button">
          <Linkedin width={20} height={20} fill="currentColor" />
        </button>
        <button className="share-article__button">
          <Link width={20} height={20} fill="currentColor" />
        </button>
      </div>
    </div>
  )
}

export default ShareArticle