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
const UserManagementPage = lazy(() => import('./pages/module/admin/SuperAdmin/UserManagement/index.jsx'));
const StallManagementPage = lazy(() => import('./pages/module/admin/SuperAdmin/StallManagement/index.jsx'));
const StallManagerMenuPage = lazy(() => import('./pages/module/admin/StallManager/MenuManagement/index.jsx'));
const StallManagerInfoPage = lazy(() => import('./pages/module/admin/StallManager/StallInformation/index.jsx'));
const StallMDashboard = lazy(() => import('./components/admin/stallMDashboard.jsx'));
const ChangePasswordPage = lazy(() => import('./pages/auth/change-password/index.jsx'));
const NotFoundPage = lazy(() => import('./pages/404.jsx'));

// Internal components
const PageLoader = () => (
  <Center style={{ width: '100vw', height: '100vh' }}>
    <Loader color="#4D6459" size="xl" type="bars" />
  </Center>
);

const App = () => {
  const [path, setPath] = React.useState(window.location.pathname);
  
  React.useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    // Also listen to custom navigation events if needed
    window.addEventListener('pushstate', handleLocationChange);
    window.addEventListener('replacestate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
      window.removeEventListener('replacestate', handleLocationChange);
    };
  }, []);

  const isAuth = isAuthenticated();
  const role = getUserRole();
  const user = getAuthUser();

  const getPageComponent = () => {
    // 2. Public Routes (No Layout)
    if (path === '/auth/login') return <LoginPage />;
    if (path === '/auth/signup') return <SignupPage />;
    if (path === '/auth/change-password') return isAuth ? <ChangePasswordPage /> : <NotFoundPage />;
    
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
      if (!isAuth) {
        window.location.replace('/auth/login');
        return <PageLoader />;
      }
      if (role !== 'admin') return <NotFoundPage />;
      if (path === '/admin/users') return <UserManagementPage />;
      if (path === '/admin/stalls') return <StallManagementPage />;
      return <AdminPage />;
    }

    // 5. Stall Manager Routes
    if (path.startsWith('/stall')) {
      if (!isAuth) {
        window.location.replace('/auth/login');
        return <PageLoader />;
      }
      if (role !== 'StallManager') return <NotFoundPage />;
      if (path === '/stall/dashboard') return <StallManagerLayout><StallMDashboard /></StallManagerLayout>;
      if (path === '/stall/my') return <StallManagerInfoPage />;
      if (path === '/stall/menu') return <StallManagerMenuPage />;
    }

    // 6. User Protected Routes
    const userProtectedRoutes = ['/home', '/search', '/map', '/bookmarks', '/profile'];
    if (userProtectedRoutes.includes(path)) {
      if (!isAuth) {
        window.location.replace('/auth/login');
        return <PageLoader />;
      }
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
