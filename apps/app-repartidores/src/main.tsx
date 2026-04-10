import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
// Let the bundler resolve the index.tsx automatically
import { appRouter } from './app/router'; 
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Critical: Failed to find the root element 'root'.");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <RouterProvider router={appRouter} />
  </React.StrictMode>
);