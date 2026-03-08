import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  published?: string;
  updated?: string;
}

export function SEO({
  title,
  description,
  image = 'https://lesjusnatuelsbens.com/images-bens/logos/logo.png',
  url = 'https://lesjusnatuelsbens.com',
  type = 'website',
  author,
  published,
  updated,
}: SEOProps) {
  const fullTitle = `${title} | Les Jus Naturels Ben's`;

  return (
    <Helmet>
      {/* Essentials */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French, English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Les Jus Naturels Ben's" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article specific */}
      {type === 'article' && published && (
        <meta property="article:published_time" content={published} />
      )}
      {type === 'article' && updated && (
        <meta property="article:modified_time" content={updated} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
