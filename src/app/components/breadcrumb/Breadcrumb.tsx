// src/components/breadcrumb/Breadcrumb.tsx
import Link from 'next/link';
import './breadcrumb.scss';

export interface BreadcrumbItem {
  label: string | React.ReactNode;
  href?:  string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      <div className="breadcrumb__content">
        <ul className="breadcrumb__list">
          {items.map((item, idx) => (
            <li key={idx} className="breadcrumb__item">
              {idx > 0 && <span className="breadcrumb__separator">/</span>}
              {item.href ? (
                <Link href={item.href} className="breadcrumb__link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb__text">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Breadcrumb;
