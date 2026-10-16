import axios from 'axios'
import type {
  UserServerSearchRequest,
  UserServerSearchResponse,
  UserGroupItem,
  OrganizationItem,
} from '@/features/setup-pages/users/types/users'

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

const toSelectRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data))
    return data as Record<string, unknown>[]
  const wrapper = data as { data?: unknown[]; Data?: unknown[] } | null
  if (Array.isArray(wrapper?.data)) return wrapper.data as Record<string, unknown>[]
  if (Array.isArray(wrapper?.Data)) return wrapper.Data as Record<string, unknown>[]
  return[]
}

export const getUserGroupSelectList = async (): Promise<UserGroupItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}UserGroup/SelectList`)
    return toSelectRows(response.data).map((item) => ({
      UserGroupId: Number(item.UserGroupId ?? item.UserGroupID ?? item.Value ?? item.id ?? 0),
      UserGroupName: String(item.UserGroupName ?? item.Name ?? item.name ?? item.Text ?? ''),
      UserGroupCode: String(item.UserGroupCode ?? item.Code ?? ''),
    }))
  } catch {
    return []
  }
}

export const getOrganizationSelectList = async (): Promise<OrganizationItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Organization/SelectList`)
    // console.log(response.data)
    return toSelectRows(response.data).map((item) => ({
      OrganizationID: Number(item.OrganizationID ?? item.OrganizationOfficeID ?? item.Value ?? item.id ?? 0),
      OrganizationName: String(item.OrganizationName || item.Title || item.Name || item.name || item.Text || ''),
    }))
  } catch {
    return []
  }
}

export const saveUser = async (
  body: Record<string, unknown>
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveUser`,
    body
  )
  const result = response.data
  if (!result?.Success) throw new Error(result?.Message || 'Failed to save user')
  return result
}

export const deleteUser = async (
  userId: number
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.get<{ Success: boolean; Message?: string }>(
    `${base_url}DeleteUser?UserID=${userId}`
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to delete User')
  }
  return result
}