import axios from 'axios'
import type {
  OrganizationServerSearchRequest,
  OrganizationServerSearchResponse,
} from '@/features/pages/organization/types/organization'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchOrganizations = async (
  page: number = 1,
  pageSize: number = 10,
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
