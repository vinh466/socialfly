import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/main.css'
import { Provider } from 'react-redux';
import { store } from './store';
import SocketProvider from './components/SocketContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>,
)
