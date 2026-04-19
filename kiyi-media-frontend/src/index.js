// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Stiller (Cyber Navy Teması ve Fontlar için ŞART)
import './index.css';

// SEO Yönetimi için
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Development'ta %100, Prod'da daha düşük olmalı
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);