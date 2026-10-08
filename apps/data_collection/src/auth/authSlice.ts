import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { LoggedInUserData, Menu } from '@/types/auth'

export interface AuthState {
  token: string | null
  userGroupCode: string | null
  clientCode: string | null
  userInfo: LoggedInUserData | null
  menus: Menu[] | null
}

const STORAGE_KEY_TOKEN = 'token'
const STORAGE_KEY_USER_GROUP_CODE = 'user_group_code'
const STORAGE_KEY_CLIENT_CODE = 'client_code'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userGroupCode: null,
    clientCode: null,
    userInfo: null,
    menus: null,
  } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.token = action.payload.token ?? null
      state.userGroupCode = action.payload.userGroupCode ?? null
      state.clientCode = action.payload.clientCode ?? null
      state.userInfo = action.payload.userInfo ?? null
      state.menus = action.payload.menus ?? null

      // Persist to localStorage so the token survives page refresh
      if (state.token) localStorage.setItem(STORAGE_KEY_TOKEN, state.token)
      else localStorage.removeItem(STORAGE_KEY_TOKEN)
      if (state.userGroupCode) localStorage.setItem(STORAGE_KEY_USER_GROUP_CODE, state.userGroupCode)
      else localStorage.removeItem(STORAGE_KEY_USER_GROUP_CODE)
      if (state.clientCode) localStorage.setItem(STORAGE_KEY_CLIENT_CODE, state.clientCode)
      else localStorage.removeItem(STORAGE_KEY_CLIENT_CODE)
    },
    setUserInfo: (state, action: PayloadAction<LoggedInUserData>) => {
      state.userInfo = action.payload
    },
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload
    },
    logout: (state) => {
      state.token = null
      state.userGroupCode = null
      state.clientCode = null
      state.userInfo = null
      state.menus = null
      localStorage.removeItem(STORAGE_KEY_TOKEN)
      localStorage.removeItem(STORAGE_KEY_USER_GROUP_CODE)
      localStorage.removeItem(STORAGE_KEY_CLIENT_CODE)
    },
  },
})

export const { setCredentials, setUserInfo, setMenus, logout } = authSlice.actions
export default authSlice.reducer

// Rehydration helper used at app startup (store.ts preloadedState)
export const rehydrateAuth = (): Partial<AuthState> => ({
  token: localStorage.getItem(STORAGE_KEY_TOKEN),
  userGroupCode: localStorage.getItem(STORAGE_KEY_USER_GROUP_CODE),
  clientCode: localStorage.getItem(STORAGE_KEY_CLIENT_CODE),
})