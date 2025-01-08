import React from 'react';
import ReactDOM from 'react-dom/client'; // Use `react-dom/client` instead of `react-dom`
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Wrapping with BrowserRouter here

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);