import axios from 'axios'
import type {
  BranchServerSearchRequest,
  BranchServerSearchResponse,
} from '@/features/pages/branch/types/branch'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchBranches = async (
  page: number = 1,
  pageSize: number = 12,
  search: string = ''
): Promise<BranchServerSearchResponse> => {
  const payload: BranchServerSearchRequest = {
    model: {
      draw: page,
      start: (page - 1) * pageSize,
      length: pageSize,
      search: { value: search.trim(), regex: '' },
    },
    param: { BranchID: 0 },
  }
  const response = await axios.post<BranchServerSearchResponse>(
    `${base_url}Branch/ServerSearch`,
    payload
  )
  return response.data
}

export const deleteBranch = async (
  branchId: number
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.get<{ Success: boolean; Message?: string }>(
    `${base_url}DeleteBranch?id=${branchId}`
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to delete branch')
  }
  return result
}