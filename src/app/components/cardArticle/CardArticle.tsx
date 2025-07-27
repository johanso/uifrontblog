import Image from 'next/image'
import React from 'react'
import './card-article.scss'

const CardArticle = (
  {
    textCount = 100
  }: {
    textCount?: number
  }
) => {
  return (
    <article>
      <div className="card-article">
        <div className="card-article__image">
          <Image
            src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
            alt=""
            width={200}
            height={200}
            className="image"
            priority
          />
        </div>
        <div className="card-article__content">
          <h3>Card Article</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
    </article>
  )
}

export default CardArticle