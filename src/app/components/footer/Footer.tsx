import React from 'react'
import './footer.scss'
import SocialBlog from '../socialBlog/SocialBlog'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <p className='footer__text'>© {new Date().getFullYear()} UIfront. All rights reserved.</p>
          <SocialBlog />
        </div>
      </div>
    </footer>
  )
}

export default Footer