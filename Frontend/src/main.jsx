import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import AppRoutes from './app/app.routes.jsx'
import { appStore } from './app/app.store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <AppRoutes />
    </Provider>
  </StrictMode>,
)
