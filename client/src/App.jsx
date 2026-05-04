import React from 'react';
import MantineStyleProvider from './provider/MantineStyleProvider.jsx';
import AppRouter from './routes/AppRouter.jsx';

const App = () => {
  return (
    <MantineStyleProvider>
      <AppRouter />
    </MantineStyleProvider>
  );
};

export default App;
