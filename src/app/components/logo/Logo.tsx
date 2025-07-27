import React from 'react'
import './logo.scss'
import Link from 'next/link'

const Logo = () => {
  return (
    <span className="logo-wrapper">
      <Link href="/">
        <span className="logo-svg">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"></path>
          </svg>
        </span>
        <span className="logo-text">UIfront</span>
      </Link>
    </span>
  )
}

export default Logo