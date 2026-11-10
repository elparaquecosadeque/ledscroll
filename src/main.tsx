import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Offline support only in production builds; in dev it would cache stale modules.
if ('serviceWorker' in navigator && import.meta.env.PROD) void navigator.serviceWorker.register('sw.js')
