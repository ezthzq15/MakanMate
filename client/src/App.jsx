import React, { lazy, Suspense } from 'react';
import { Loader, Center } from '@mantine/core';
import MantineStyleProvider from './provider/MantineStyleProvider.jsx';
import AppLayout from './container/AppLayout.jsx';
import { isAuthenticated, getUserRole, getAuthUser } from './utils/auth';
import StallManagerLayout from './container/StallManagerLayout.jsx';

// Lazy loaded components
const LoginPage = lazy(() => import('./pages/auth/login/index.jsx'));
const SignupPage = lazy(() => import('./pages/auth/signup/index.jsx'));
const UserHomepage = lazy(() => import('./pages/module/users/userHomepage.jsx'));
const MyProfile = lazy(() => import('./pages/module/users/myProfile.jsx'));
const AdminPage = lazy(() => import('./pages/module/admin/index.jsx'));
const UserManagementPage = lazy(() => import('./pages/module/admin/UserManagement/index.jsx'));
const StallManagementPage = lazy(() => import('./pages/module/admin/StallManagement/index.jsx'));
const MenuManagementPage = lazy(() => import('./pages/module/admin/MenuManagement/index.jsx'));
const StallMDashboard = lazy(() => import('./components/admin/stallMDashboard.jsx'));
const ChangePasswordPage = lazy(() => import('./pages/auth/change-password/index.jsx'));
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
  const user = getAuthUser();

  const getPageComponent = () => {
    // 2. Public Routes (No Layout)
    if (path === '/auth/login') return <LoginPage />;
    if (path === '/auth/signup') return <SignupPage />;
    if (path === '/auth/change-password') return isAuth ? <ChangePasswordPage /> : <UnauthorizedPage />;
    
    // 3. Root Redirection
    if (path === '/') {
      if (!isAuth) return <LoginPage />;
      if (role === 'admin') {
        window.location.replace('/admin/dashboard');
        return <PageLoader />;
      }
      if (role === 'StallManager') {
        window.location.replace('/stall/dashboard');
        return <PageLoader />;
      }
      return <AppLayout><UserHomepage /></AppLayout>;
    }

    // 4. Admin Routes
    if (path.startsWith('/admin')) {
      if (!isAuth || role !== 'admin') return <UnauthorizedPage />;
      if (path === '/admin/users') return <UserManagementPage />;
      if (path === '/admin/stalls') return <StallManagementPage />;
      return <AdminPage />;
    }

    // 5. Stall Manager Routes
    if (path.startsWith('/stall')) {
      if (!isAuth || role !== 'StallManager') return <UnauthorizedPage />;
      if (path === '/stall/dashboard') return <StallManagerLayout><StallMDashboard /></StallManagerLayout>;
      if (path === '/stall/my' || path === '/stall/menu') {
        return <StallManagerLayout><MenuManagementPage /></StallManagerLayout>;
      }
    }

    // 6. User Protected Routes
    const userProtectedRoutes = ['/home', '/search', '/map', '/bookmarks', '/profile'];
    if (userProtectedRoutes.includes(path)) {
      if (!isAuth) return <UnauthorizedPage />;
      if (path === '/profile') return <AppLayout><MyProfile /></AppLayout>;
      return <AppLayout><UserHomepage /></AppLayout>;
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
