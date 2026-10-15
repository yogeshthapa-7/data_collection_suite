import axios from 'axios'
import type {
  MainBranchServerSearchRequest,
  MainBranchServerSearchResponse,
} from '@/features/pages/main-branch/types/main-branch'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchMainBranches = async (
  page: number = 1,
  pageSize: number = 12,
  search: string = ''
): Promise<MainBranchServerSearchResponse> => {
  const payload: MainBranchServerSearchRequest = {
    model: {
      draw: page,
      start: (page - 1) * pageSize,
      length: pageSize,
      search: { value: search.trim(), regex: '' },
    },
    param: { MainBranchID: 0 },
  }
  const response = await axios.post<MainBranchServerSearchResponse>(
    `${base_url}MainBranch/ServerSearch`,
    payload
  )
  return response.data
}

export const deleteMainBranch = async (
  mainBranchId: number
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.get<{ Success: boolean; Message?: string }>(
    `${base_url}DeleteMainBranch?id=${mainBranchId}`
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to delete main branch')
  }
  return result
}