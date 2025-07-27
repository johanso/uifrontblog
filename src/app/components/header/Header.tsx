"use client"
import React, { useState } from 'react'
import './header.scss'
import Logo from '../logo/Logo'
import NavMenu from '../navMenu/NavMenu'
import IconMenuMobile from '../iconMenuMobile/IconMenuMobile'
import ToogleDark from '../toogleDark/ToogleDark'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.classList.toggle('no-scroll')
  }

  return (
    <header className="header">

      <div className="header__mobile">
        <div className="container">
          <div className="header__content">
            <Logo />

            <button className="header__menu-icon" onClick={toggleMenu}>
              <IconMenuMobile isMenuOpen={isMenuOpen} />
            </button>

            <NavMenu 
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
            />

          </div>
        </div>
      </div>

      <div className="header__desktop">
        <div className="header__desktop-toogle-dark">
          <ToogleDark />
        </div>
      </div>

    </header>
  )
}

export default Header