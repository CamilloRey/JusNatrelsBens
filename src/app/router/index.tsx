import { createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from '@/app/layouts/PublicLayout';
import AdminLayout  from '@/app/layouts/AdminLayout';

import HomePage          from '@/features/home/pages/HomePage';
import AboutPage         from '@/features/about/pages/AboutPage';
import ProductsPage      from '@/features/products/pages/ProductsPage';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import IngredientsPage   from '@/features/ingredients/pages/IngredientsPage';
import RecipesPage       from '@/features/recipes/pages/RecipesPage';
import BlogPage          from '@/features/blog/pages/BlogPage';
import EventsPage        from '@/features/events/pages/EventsPage';
import LocationsPage     from '@/features/locations/pages/LocationsPage';
import ContactPage       from '@/features/contact/pages/ContactPage';
import LoginPage         from '@/features/auth/pages/LoginPage';

import DashboardPage          from '@/features/dashboard/pages/DashboardPage';
import AdminProductsPage      from '@/features/products/pages/AdminProductsPage';
import AdminIngredientsPage   from '@/features/ingredients/pages/AdminIngredientsPage';
import AdminReviewsPage       from '@/features/reviews/pages/AdminReviewsPage';
import AdminBlogPage          from '@/features/blog/pages/AdminBlogPage';
import AdminLocationsPage     from '@/features/locations/pages/AdminLocationsPage';
import AdminSubscribersPage   from '@/features/newsletter/pages/AdminSubscribersPage';
import AdminMessagesPage      from '@/features/contact/pages/AdminMessagesPage';
import AdminSettingsPage      from '@/features/auth/pages/AdminSettingsPage';
import AdminDataPage          from '@/features/dashboard/pages/AdminDataPage';
import AdminEventsPage        from '@/features/events/pages/AdminEventsPage';
import AdminStockPage         from '@/features/stock/pages/AdminStockPage';
import AdminFinancePage       from '@/features/finance/pages/AdminFinancePage';
import AdminReportsPage       from '@/features/reports/pages/AdminReportsPage';

import { ROUTES } from '@/shared/constants/routes';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  /* ── PUBLIC ── */
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home,      element: <HomePage /> },
      { path: ROUTES.about,     element: <AboutPage /> },
      { path: ROUTES.products,  element: <ProductsPage /> },
      { path: ROUTES.ingredients, element: <IngredientsPage /> },
      { path: '/products/:id',  element: <ProductDetailPage /> },
      { path: ROUTES.recipes,   element: <RecipesPage /> },
      { path: ROUTES.blog,      element: <BlogPage /> },
      { path: ROUTES.events,    element: <EventsPage /> },
      { path: ROUTES.locations, element: <LocationsPage /> },
      { path: ROUTES.contact,   element: <ContactPage /> },
    ],
  },

  /* ── LOGIN ── */
  { path: ROUTES.login, element: <LoginPage /> },

  /* ── ADMIN (protected) ── */
  {
    path: ROUTES.admin.root,
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to={ROUTES.admin.dashboard} replace /> },
      { path: 'dashboard',  element: <DashboardPage /> },
      { path: 'products',   element: <AdminProductsPage /> },
      { path: 'ingredients', element: <AdminIngredientsPage /> },
      { path: 'reviews',    element: <AdminReviewsPage /> },
      { path: 'blog',       element: <AdminBlogPage /> },
      { path: 'locations',  element: <AdminLocationsPage /> },
      { path: 'subscribers',element: <AdminSubscribersPage /> },
      { path: 'messages',   element: <AdminMessagesPage /> },
      { path: 'settings',   element: <AdminSettingsPage /> },
      { path: 'events',     element: <AdminEventsPage /> },
      { path: 'stock',      element: <AdminStockPage /> },
      { path: 'finance',    element: <AdminFinancePage /> },
      { path: 'reports',    element: <AdminReportsPage /> },
      { path: 'data',       element: <AdminDataPage /> },
    ],
  },

  /* ── FALLBACK ── */
  { path: '*', element: <Navigate to={ROUTES.home} replace /> },
]);
