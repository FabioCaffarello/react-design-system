/**
 * Main Entry Point for Flow Playground Application
 * 
 * This file is the entry point for the standalone Vite application.
 * It renders the Flow Playground app for development and testing.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './style.css';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}

// Render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
