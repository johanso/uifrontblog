import React from 'react'
import { Facebook, Linkedin, TwitterX } from '../icons/icons'
import './social-blog.scss'

const SocialBlog = () => {
  return (
    <div className="social-blog">
      <div className="social-blog__content">
        <button className="social-blog__button">
          <Facebook width={18} height={18} fill="currentColor" />
        </button>
        <button className="social-blog__button">
          <TwitterX width={18} height={18} fill="currentColor" />
        </button>
        <button className="social-blog__button">
          <Linkedin width={18} height={18} fill="currentColor" />
        </button>
      </div>
    </div>
  )
}

export default SocialBlog