import React, { lazy, Suspense } from 'react';
import { Loader, Center } from '@mantine/core';
import MantineStyleProvider from './provider/MantineStyleProvider.jsx';
import AppLayout from './container/AppLayout.jsx';
import { isAuthenticated, getUserRole } from './utils/auth';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/auth/login/index.jsx'));
const SignupPage = lazy(() => import('./pages/auth/signup/index.jsx'));
const UserHomepage = lazy(() => import('./pages/module/users/userHomepage.jsx'));
const MyProfile = lazy(() => import('./pages/module/users/myProfile.jsx'));
const AdminPage = lazy(() => import('./pages/module/admin/index.jsx'));
const UserManagementPage = lazy(() => import('./pages/module/admin/UserManagement/index.jsx'));
const StallManagementPage = lazy(() => import('./pages/module/admin/StallManagement/index.jsx'));
const UnauthorizedPage = lazy(() => import('./pages/401.jsx'));
const NotFoundPage = lazy(() => import('./pages/404.jsx'));

// Internal components
const PageLoader = () => (
  <Center style={{ width: '100vw', height: '100vh' }}>
    <Loader color="#4D6459" size="xl" type="bars" />
  </Center>
);

const App = () => {
  const path = window.location.pathname;
  const isAuth = isAuthenticated();
  const role = getUserRole();

  const getPageComponent = () => {
    // Public Routes (No Layout)
    if (path === '/auth/login') return <LoginPage />;
    if (path === '/auth/signup') return <SignupPage />;
    
    if (path === '/') {
      if (!isAuth) return <LoginPage />;
      if (role === 'admin') {
        window.location.replace('/admin');
        return <PageLoader />;
      }
      return <AppLayout><UserHomepage /></AppLayout>;
    }

    // Admin sub-routes — check specific paths first before fallback
    if (path === '/admin/users') {
      if (!isAuth || role !== 'admin') return <UnauthorizedPage />;
      return <UserManagementPage />;
    }

    if (path === '/admin/stalls') {
      if (!isAuth || role !== 'admin') return <UnauthorizedPage />;
      return <StallManagementPage />;
    }

    // Admin catch-all route
    if (path === '/admin' || path === '/admin/dashboard' || path.startsWith('/admin/')) {
      if (!isAuth || role !== 'admin') return <UnauthorizedPage />;
      return <AdminPage />;
    }

    // Protected Routes (With Layout)
    if (path === '/home') {
      return isAuth ? <AppLayout><UserHomepage /></AppLayout> : <UnauthorizedPage />;
    }

    // Known but protected routes (With Layout)
    const protectedRoutes = ['/search', '/map', '/bookmarks', '/profile'];
    if (path === '/profile') {
      return isAuth ? <AppLayout><MyProfile /></AppLayout> : <UnauthorizedPage />;
    }
    
    if (protectedRoutes.includes(path)) {
      return isAuth ? <AppLayout><UserHomepage /></AppLayout> : <UnauthorizedPage />;
    }

    // Catch-all 404
    return <NotFoundPage />;
  };

  return (
    <MantineStyleProvider>
      <Suspense fallback={<PageLoader />}>
        {getPageComponent()}
      </Suspense>
    </MantineStyleProvider>
  );
};

export default App;
