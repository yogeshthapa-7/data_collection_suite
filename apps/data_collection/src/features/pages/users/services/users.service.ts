import axios from 'axios'
import type {
  UserServerSearchRequest,
  UserServerSearchResponse,
} from '@/features/pages/users/types/users'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchUsers = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
): Promise<UserServerSearchResponse> => {
  const payload: UserServerSearchRequest = {
    model: {
      draw: page,
      start: (page - 1) * pageSize,
      length: pageSize,
      search: {
        value: search,
        regex: '',
      },
    },
    param: {
      UserID: 0,
    },
  }
  return userServerSearch(payload)
}

export const userServerSearch = async (
  data: UserServerSearchRequest
): Promise<UserServerSearchResponse> => {
  const response = await axios.post<UserServerSearchResponse>(
    `${base_url}Users/ServerSearch`,
    data
  )
  return response.data
}
