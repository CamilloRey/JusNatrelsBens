import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Product' | 'Organization';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

/**
 * LocalBusiness schema for company info
 */
export const localBusinessSchema = {
  name: 'Les Jus Naturels Ben\'s',
  description: 'Jus naturels artisanaux sans sucre ajouté, inspirés des traditions africaines et fabriqués à Montréal.',
  url: 'https://lesjusnatuelsbens.com',
  telephone: '+1-514-XXX-XXXX', // Update with real phone
  email: 'contact@lesjusnatuelsbens.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Montréal',
    addressLocality: 'Montréal',
    addressRegion: 'QC',
    postalCode: 'H1H 1H1', // Update with real postal code
    addressCountry: 'CA',
  },
  sameAs: [
    'https://www.instagram.com/lesjusnatuelsbens',
    'https://www.facebook.com/lesjusnatuelsbens',
  ],
  image: 'https://lesjusnatuelsbens.com/images-bens/logos/logo.png',
};

/**
 * Organization schema for search results
 */
export const organizationSchema = {
  name: 'Les Jus Naturels Ben\'s',
  url: 'https://lesjusnatuelsbens.com',
  logo: 'https://lesjusnatuelsbens.com/images-bens/logos/logo.png',
  description: 'Des jus naturels et exotiques faits maison pour la santé, la saveur et l\'authenticité.',
  sameAs: [
    'https://www.instagram.com/lesjusnatuelsbens',
    'https://www.facebook.com/lesjusnatuelsbens',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'contact@lesjusnatuelsbens.com',
  },
};
