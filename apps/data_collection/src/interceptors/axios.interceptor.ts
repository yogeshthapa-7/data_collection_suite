import axios from 'axios'
import type { RootState } from '@/app/store'
import { getToken } from '@/app/hooks'
import { logout } from '@/auth/authSlice'

export const setupAxiosInterceptor = (store: { getState: () => RootState; dispatch: (action: any) => void }) => {
  axios.interceptors.request.use(
    (config) => {
      const state = store.getState()
      const token = getToken(state)
      if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`
      }
      const clientCode = state.auth?.clientCode || import.meta.env.VITE_CLIENT_CODE
      if (clientCode) {
        config.headers.clientcode = clientCode
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        store.dispatch(logout())
        window.location.href = '/auth/login'
      }
      return Promise.reject(error)
    }
  )
}