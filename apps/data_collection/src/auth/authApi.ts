import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import type { LoginRequest, LoginResponse, LoggedInUserResponse, LoggedInMenusResponse } from '@/types/auth'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const token = state.auth?.token
      const clientCode = state.auth?.clientCode || import.meta.env.VITE_CLIENT_CODE
      if (token && token !== 'undefined' && token !== 'null') {
        headers.set('Authorization', `Bearer ${token}`)
      }
      if (clientCode) {
        headers.set('clientcode', clientCode)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'Authenticate/Login',
        method: 'POST',
        body: credentials,
      }),
    }),
    publicAgentLogin: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'Authenticate/PublicAgentLogin',
        method: 'POST',
        body: credentials,
      }),
    }),
    getLoggedInUserInfo: builder.query<LoggedInUserResponse, void>({
      query: () => ({
        url: 'GetLoggedInUserInfo',
        method: 'GET',
      }),
    }),
    getLoggedInMenusInfo: builder.query<LoggedInMenusResponse, void>({
      query: () => ({
        url: 'GetLoggedInMenusInfo',
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  usePublicAgentLoginMutation,
  useGetLoggedInUserInfoQuery,
  useGetLoggedInMenusInfoQuery,
} = authApi