export const ROUTES = {
  home:      '/',
  about:     '/about',
  products:  '/products',
  product:   (id: string) => `/products/${id}`,
  blog:      '/blog',
  events:    '/events',
  locations: '/locations',
  contact:   '/contact',

  login:     '/login',

  admin: {
    root:        '/admin',
    dashboard:   '/admin/dashboard',
    products:    '/admin/products',
    reviews:     '/admin/reviews',
    blog:        '/admin/blog',
    locations:   '/admin/locations',
    subscribers: '/admin/subscribers',
    messages:    '/admin/messages',
    events:      '/admin/events',
    settings:    '/admin/settings',
    data:        '/admin/data',
  },
} as const;
