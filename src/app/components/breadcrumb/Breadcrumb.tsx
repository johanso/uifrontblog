import React from 'react'
import './breadcrumb.scss'

const Breadcrumb = () => {
  return (
    <div className="breadcrumb">
      <div className="breadcrumb__content">
        <ul className="breadcrumb__list">
          <li className="breadcrumb__item">
            <a href="#" className="breadcrumb__link">Home</a>
          </li>
          <li className="breadcrumb__item">
            <a href="#" className="breadcrumb__link">Category</a>
          </li>
          <li className="breadcrumb__item">
            <a href="#" className="breadcrumb__link">Post</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Breadcrumb