'use client';
import React, { useEffect, useState } from 'react'
import './table-of-contents.scss'

interface Heading {
  id: string;
  text: string;
}

const TableOfContent = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const used = new Map<string, number>();

    const contentEl = document.querySelector('.article__content');
    if (!contentEl) return;

    // 1. Recopilar todos los H2
    const h2s = Array.from(contentEl.querySelectorAll('h2'));

    const items: Heading[] = h2s.map((h2) => {
      const base = (h2.textContent || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      const count = used.get(base) ?? 0;
      used.set(base, count + 1);

      const id = count === 0 ? base : `${base}-${count}`; // añade -1, -2…

      h2.id = id;
      return { id, text: h2.textContent || '' };
    });

    setHeadings(items);

    // 3. Observer para resaltar la sección activa
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0% 0% -80% 0%', // dispara cuando el heading llega al 20% superior
        threshold: 0,
      }
    );
    h2s.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="table-of-contents">
      <h2 className="table-of-contents__title">En este articulo...</h2>
      <ul className="table-of-contents__list">
        {headings.map((h) => (
          <li key={h.id} className={`table-of-contents__item ${activeId === h.id ? 'active' : ''}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>   
        ))}
      </ul>
    </section>
  )
}

export default TableOfContent