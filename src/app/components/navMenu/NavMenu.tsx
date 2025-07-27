import Link from 'next/link'
import React from 'react'
import './nav-manu.scss'
import ToogleDark from '../toogleDark/ToogleDark'

const NavMenu = ({ 
  isMenuOpen, 
  toggleMenu, 
}: { 
    isMenuOpen: boolean, 
    toggleMenu: () => void, 
  }) => {
    
  return (
    <>
      <nav className={!isMenuOpen ? 'nav-menu' : 'nav-menu nav-menu--open'}>
        <ul className="nav-menu__list">
          <li className="nav-menu__item"><Link href="/">Home</Link></li>
          <li className="nav-menu__item"><Link href="/categories">Categories</Link></li>
          <li className="nav-menu__item"><Link href="/contact">Contact</Link></li>
          <li className="nav-menu__item nav-menu__item--dark">
            <ToogleDark />
          </li>
        </ul>
      </nav>
      <div 
        className={!isMenuOpen ? 'nav-menu__overlay' : 'nav-menu__overlay nav-menu__overlay--open'} 
        onClick={toggleMenu}
      ></div>
    </>
  )
}

export default NavMenu
