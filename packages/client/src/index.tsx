import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { reduxStore } from './store';
import { login } from './store/userReducer';

const internalApiKey = localStorage.getItem('internalApiKey') || ''
reduxStore.dispatch(login(internalApiKey))

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
