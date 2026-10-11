import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './store/store';
import useAuth from './hooks/useAuth';
import AppRouter from './router';

function AppInner() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession().catch(() => {});
  }, []);

  return <AppRouter />;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </Provider>
  );
}