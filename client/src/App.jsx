import React from 'react';
import MantineStyleProvider from './provider/MantineStyleProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';
import { AppErrorBoundary } from './pages/ErrorBoundary.jsx';

const App = () => {
  return (
    <AppErrorBoundary>
      <MantineStyleProvider>
        <AppRouter />
      </MantineStyleProvider>
    </AppErrorBoundary>
  );
};

export default App;
