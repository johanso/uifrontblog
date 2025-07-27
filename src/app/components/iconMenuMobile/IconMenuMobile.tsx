import React from 'react'
import { Close, DotsVertical } from '../icons/icons'

const IconMenuMobile = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  return (
    <>
      {isMenuOpen ? <Close 
        width={18} 
        height={18} 
        fill="currentColor" 
      /> : <DotsVertical 
        width={22} 
        height={22} 
        fill="currentColor" 
      />}
    </>
  )
}

export default IconMenuMobile