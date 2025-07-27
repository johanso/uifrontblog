import React from 'react'
import './button.scss'

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, className, onClick, disabled }: Props) => {
  return (
    <button 
      disabled={disabled}
      className={`btn ${className || ''}`} 
      onClick={onClick}>
      {children}
    </button>
  )
}

export default Button