import { site } from '@data/site';

const ORIGIN = 'https://shilandah.com';
const BUSINESS_ID = `${ORIGIN}/#business`;

/** Site-wide VeterinaryCare LocalBusiness + AggregateRating node. */
export function localBusiness() {
  return {
    '@type': 'VeterinaryCare',
    '@id': BUSINESS_ID,
    name: site.name,
    url: `${ORIGIN}/`,
    telephone: site.phone.e164,
    email: site.email,
    priceRange: '$$',
    image: `${ORIGIN}/hero-photo.jpg`,
    logo: `${ORIGIN}/logo.webp`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: site.areaServedSchema,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Thursday', 'Friday'], opens: '08:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '20:00' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      reviewCount: String(site.rating.count),
    },
    sameAs: [site.links.facebook, site.links.instagram],
  };
}

/** BreadcrumbList from [{name, path}] where path is a trailing-slash route. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${ORIGIN}${it.path}`,
    })),
  };
}

/** Service node referencing the LocalBusiness by @id. */
export function service(name: string, description: string, path: string) {
  return {
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: `${ORIGIN}${path}`,
    provider: { '@id': BUSINESS_ID },
    areaServed: site.areaServedSchema,
  };
}

/** Wrap nodes into a single @graph document. */
export function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
