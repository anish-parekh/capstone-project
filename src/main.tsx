import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'animate.css'
import 'react-loading-skeleton/dist/skeleton.css'
import './components/custom-styles.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
