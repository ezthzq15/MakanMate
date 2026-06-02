import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';

// Guards
import { ProtectedRoute, RoleGuard, PublicOnlyRoute } from './RouteGuards';

// Layouts
import AppLayout from '../container/AppLayout';
import StallManagerLayout from '../container/StallManagerLayout';

// Lazy Pages
const LoginPage = lazy(() => import('../pages/auth/login/index'));
const SignupPage = lazy(() => import('../pages/auth/signup/index'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/forgot-password/index'));
const UserHomepage = lazy(() => import('../pages/module/users/userHomepage'));
const MyProfile = lazy(() => import('../pages/module/users/myProfile'));
const AdminPage = lazy(() => import('../pages/module/admin/index'));
const UserManagementPage = lazy(() => import('../pages/module/admin/SuperAdmin/UserManagement/index'));
const StallManagementPage = lazy(() => import('../pages/module/admin/SuperAdmin/StallManagement/index'));
const SuperAdminVouchersPage = lazy(() => import('../pages/module/admin/SuperAdmin/VoucherManagement/index'));
const SuperAdminChallengesPage = lazy(() => import('../pages/module/admin/SuperAdmin/ChallengeManagement/index'));
const StallManagerMenuPage = lazy(() => import('../pages/module/admin/StallManager/MenuManagement/index'));
const StallManagerInfoPage = lazy(() => import('../pages/module/admin/StallManager/StallInformation/index'));
const StallManagerVouchersPage = lazy(() => import('../pages/module/admin/StallManager/VoucherManagement/index'));
const StallMDashboard = lazy(() => import('../components/admin/stallMDashboard'));
const ChangePasswordPage = lazy(() => import('../pages/auth/change-password/index'));
const NotFoundPage = lazy(() => import('../pages/404'));
const LandingPage = lazy(() => import('../pages/landing-page.jsx'));
const FindStallsPage = lazy(() => import('../pages/module/users/findStalls/index'));
const StallDetailPage = lazy(() => import('../pages/module/users/findStalls/ViewStalls/index'));
const BookmarksPage = lazy(() => import('../pages/module/users/bookmarks/index'));
const StallMapPage = lazy(() => import('../pages/module/users/stallMap/index'));

const PageLoader = () => (
  <Center style={{ width: '100vw', height: '100vh' }}>
    <Loader color="#4D6459" size="xl" type="bars" />
  </Center>
);

const router = createBrowserRouter([
  // Public Routes (Accessible by everyone)
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense>,
  },
  {
    path: '/map',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><StallMapPage /></Suspense> }
    ]
  },

  // Auth Routes (Only for unauthenticated users)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/auth/login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: '/auth/signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: '/auth/forgot-password', element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense> },
    ]
  },

  // Protected User Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/home', element: <Suspense fallback={<PageLoader />}><UserHomepage /></Suspense> },
          { path: '/profile', element: <Suspense fallback={<PageLoader />}><MyProfile /></Suspense> },
          { path: '/bookmarks', element: <Suspense fallback={<PageLoader />}><BookmarksPage /></Suspense> },
          { path: '/search', element: <Suspense fallback={<PageLoader />}><FindStallsPage /></Suspense> },
          { path: '/stall-detail/:id', element: <Suspense fallback={<PageLoader />}><StallDetailPage /></Suspense> },
        ]
      },
      { path: '/auth/change-password', element: <Suspense fallback={<PageLoader />}><ChangePasswordPage /></Suspense> },
    ]
  },

  // Admin Routes (Strict Role Check)
  {
    path: '/admin',
    element: <RoleGuard allowedRoles={['admin']} />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><AdminPage /></Suspense> },
      { path: 'users', element: <Suspense fallback={<PageLoader />}><UserManagementPage /></Suspense> },
      { path: 'stalls', element: <Suspense fallback={<PageLoader />}><StallManagementPage /></Suspense> },
      { path: 'vouchers', element: <Suspense fallback={<PageLoader />}><SuperAdminVouchersPage /></Suspense> },
      { path: 'challenges', element: <Suspense fallback={<PageLoader />}><SuperAdminChallengesPage /></Suspense> },
    ]
  },

  // Stall Manager Routes (Strict Role Check)
  {
    path: '/stall',
    element: <RoleGuard allowedRoles={['StallManager']} />,
    children: [
      {
        element: <StallManagerLayout />,
        children: [
          { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><StallMDashboard /></Suspense> },
          { path: 'my', element: <Suspense fallback={<PageLoader />}><StallManagerInfoPage /></Suspense> },
          { path: 'menu', element: <Suspense fallback={<PageLoader />}><StallManagerMenuPage /></Suspense> },
          { path: 'vouchers', element: <Suspense fallback={<PageLoader />}><StallManagerVouchersPage /></Suspense> },
        ]
      }
    ]
  },

  // 404 Catch-all
  {
    path: '*',
    element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
