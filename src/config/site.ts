// src/config/site.ts

export interface SiteConfig {
  siteUrl:     string;
  title:       string;
  description: string;
  author?:     string;
  locale?:     string;
}

export const siteConfig: SiteConfig = {
  siteUrl:     process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  title:       'UIfront, Guias y tutoriales frontend',
  description: 'UIfront, Guías y tutoriales para aprender los lenguajes y técnicas del frontend',
  author:      'Johanso',
  locale:      'es-ES',
};
