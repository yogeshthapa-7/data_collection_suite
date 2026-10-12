import axios from 'axios'
import type {
  OrganizationServerSearchRequest,
  OrganizationServerSearchResponse,
  OrganizationSelectItem,
} from '@/features/pages/organization/types/organization'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchOrganizations = async (
  page: number = 1,
  pageSize: number = 12,
  search: string = ''
): Promise<OrganizationServerSearchResponse> => {
  const payload: OrganizationServerSearchRequest = {
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
      OrganizationID: 0,
    },
  }
  return organizationServerSearch(payload)
}

export const organizationServerSearch = async (
  data: OrganizationServerSearchRequest
): Promise<OrganizationServerSearchResponse> => {
  const response = await axios.post<OrganizationServerSearchResponse>(
    `${base_url}Organization/ServerSearch`,
    data
  )
  return response.data
}

const toSelectRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[]
  const wrapper = data as { data?: unknown[]; Data?: unknown[] } | null
  if (Array.isArray(wrapper?.data)) return wrapper.data as Record<string, unknown>[]
  if (Array.isArray(wrapper?.Data)) return wrapper.Data as Record<string, unknown>[]
  return []
}

export const getOrganizationSelectList = async (): Promise<OrganizationSelectItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Organization/SelectList`)
    return toSelectRows(response.data).map((item) => ({
      OrganizationID: Number(item.OrganizationID ?? item.Value ?? item.id ?? 0),
      Title: String(item.Title ?? item.OrganizationName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}
