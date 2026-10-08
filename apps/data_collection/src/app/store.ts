import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/auth/authApi'
import authReducer, { rehydrateAuth, type AuthState } from '@/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  preloadedState: {
    auth: rehydrateAuth() as AuthState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch