import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import App from './app.jsx'
import MantineStyleProvider from '../provider/MantineStyleProvider.jsx'
import LoginPage from './auth/login/index.jsx'
import SignupPage from './auth/signup/index.jsx'
import AppLayout from '../container/AppLayout.jsx'

const getPageComponent = () => {
  const path = window.location.pathname;
  if (path === '/auth/login' || path === '/') return <LoginPage />;
  if (path === '/auth/signup') return <SignupPage />;
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineStyleProvider>
      <AppLayout>
        {getPageComponent()}
      </AppLayout>
    </MantineStyleProvider>
  </StrictMode>,
);
