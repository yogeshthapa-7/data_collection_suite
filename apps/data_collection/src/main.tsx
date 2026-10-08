import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { setupAxiosInterceptor } from '@/interceptors/axios.interceptor'
import { store } from '@/app/store'

setupAxiosInterceptor(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
