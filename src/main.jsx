import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { persistor, store } from './redux/store.jsx'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react'


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Không tìm thấy element #root. Kiểm tra file public/index.html');
}

const root = ReactDOM.createRoot(rootElement);
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
     <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        </PersistGate>
      </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
 </QueryClientProvider>

);



//</React.StrictMode>