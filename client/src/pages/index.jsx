import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import '../styles/theme.css'
import App from './app.jsx'
import MantineStyleProvider from '../provider/MantineStyleProvider.jsx'
import LoginPage from './auth/login/index.jsx'
import SignupPage from './auth/signup/index.jsx'
import UserHomepage from './module/users/userHomepage.jsx'
import MyProfile from './module/users/myProfile.jsx'
import UnauthorizedPage from './401.jsx'
import NotFoundPage from './404.jsx'
import AppLayout from '../container/AppLayout.jsx'
import { isAuthenticated } from '../utils/auth'

const getPageComponent = () => {
  const path = window.location.pathname;
  const isAuth = isAuthenticated();

  // Public Routes (No Layout)
  if (path === '/auth/login') return <LoginPage />;
  if (path === '/auth/signup') return <SignupPage />;
  
  if (path === '/') {
    return isAuth ? <AppLayout><UserHomepage /></AppLayout> : <LoginPage />;
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
    return isAuth ? <AppLayout><App /></AppLayout> : <UnauthorizedPage />;
  }

  // Catch-all 404
  return <NotFoundPage />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineStyleProvider>
      {getPageComponent()}
    </MantineStyleProvider>
  </StrictMode>,
);
