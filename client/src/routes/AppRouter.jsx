import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';

// Guards
import { ProtectedRoute, RoleGuard, PublicOnlyRoute } from './RouteGuards';

// Layouts
import AppLayout from '../container/AppLayout';
import StallManagerLayout from '../container/StallManagerLayout';

// Error boundary
import RouteErrorBoundary from '../pages/ErrorBoundary';

// Lazy Pages
const LoginPage            = lazy(() => import('../pages/auth/login/index'));
const SignupPage            = lazy(() => import('../pages/auth/signup/index'));
const ForgotPasswordPage   = lazy(() => import('../pages/auth/forgot-password/index'));
const UserHomepage         = lazy(() => import('../pages/module/users/userHomepage'));
const MyProfile            = lazy(() => import('../pages/module/users/myProfile'));
const AdminPage            = lazy(() => import('../pages/module/admin/index'));
const UserManagementPage   = lazy(() => import('../pages/module/admin/SuperAdmin/UserManagement/index'));
const StallManagementPage  = lazy(() => import('../pages/module/admin/SuperAdmin/StallManagement/index'));
const SuperAdminVouchersPage   = lazy(() => import('../pages/module/admin/SuperAdmin/VoucherManagement/index'));
const SuperAdminChallengesPage = lazy(() => import('../pages/module/admin/SuperAdmin/ChallengeManagement/index'));
const StallManagerMenuPage    = lazy(() => import('../pages/module/admin/StallManager/MenuManagement/index'));
const StallManagerInfoPage    = lazy(() => import('../pages/module/admin/StallManager/StallInformation/index'));
const StallManagerVouchersPage = lazy(() => import('../pages/module/admin/StallManager/VoucherManagement/index'));
const StallMDashboard      = lazy(() => import('../components/admin/stallMDashboard'));
const ChangePasswordPage   = lazy(() => import('../pages/auth/change-password/index'));
const NotFoundPage         = lazy(() => import('../pages/404'));
const LandingPage          = lazy(() => import('../pages/landing-page.jsx'));
const FindStallsPage       = lazy(() => import('../pages/module/users/findStalls/index'));
const StallDetailPage      = lazy(() => import('../pages/module/users/findStalls/ViewStalls/index'));
const BookmarksPage        = lazy(() => import('../pages/module/users/bookmarks/index'));
const StallMapPage         = lazy(() => import('../pages/module/users/stallMap/index'));

const PageLoader = () => (
  <Center style={{ width: '100vw', height: '100vh' }}>
    <Loader color="#4D6459" size="xl" type="bars" />
  </Center>
);

// Wrap element in Suspense with the standard fallback
const S = (Page) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
);

const router = createBrowserRouter([
  // ── Root error boundary wraps everything ────────────────────────────────
  {
    // A layout-less root route whose only job is to provide the errorElement
    // that all child routes inherit. React Router v6 data router propagates
    // errorElement up the route tree, so this single definition covers every page.
    path: '/',
    errorElement: <RouteErrorBoundary />,
    children: [

      // Landing
      { index: true, element: S(LandingPage) },

      // Public map (no login required)
      {
        path: 'map',
        element: <AppLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: S(StallMapPage) }
        ]
      },

      // Auth routes (unauthenticated only)
      {
        element: <PublicOnlyRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: 'auth/login',           element: S(LoginPage) },
          { path: 'auth/signup',          element: S(SignupPage) },
          { path: 'auth/forgot-password', element: S(ForgotPasswordPage) },
        ]
      },

      // Protected user routes
      {
        element: <ProtectedRoute />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: <AppLayout />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { path: 'home',                 element: S(UserHomepage) },
              { path: 'profile',              element: S(MyProfile) },
              { path: 'bookmarks',            element: S(BookmarksPage) },
              { path: 'search',               element: S(FindStallsPage) },
              { path: 'stall-detail/:id',     element: S(StallDetailPage) },
            ]
          },
          { path: 'auth/change-password', element: S(ChangePasswordPage) },
        ]
      },

      // Admin routes
      {
        path: 'admin',
        element: <RoleGuard allowedRoles={['admin']} />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true,       element: <Navigate to="/admin/dashboard" replace /> },
          { path: 'dashboard', element: S(AdminPage) },
          { path: 'users',     element: S(UserManagementPage) },
          { path: 'stalls',    element: S(StallManagementPage) },
          { path: 'vouchers',  element: S(SuperAdminVouchersPage) },
          { path: 'challenges',element: S(SuperAdminChallengesPage) },
        ]
      },

      // Stall Manager routes
      {
        path: 'stall',
        element: <RoleGuard allowedRoles={['StallManager']} />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            element: <StallManagerLayout />,
            children: [
              { path: 'dashboard', element: S(StallMDashboard) },
              { path: 'my',        element: S(StallManagerInfoPage) },
              { path: 'menu',      element: S(StallManagerMenuPage) },
              { path: 'vouchers',  element: S(StallManagerVouchersPage) },
            ]
          }
        ]
      },

      // 404 catch-all
      { path: '*', element: S(NotFoundPage) },
    ]
  }
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
