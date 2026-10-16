import axios from 'axios'
import type {
  MainBranchServerSearchRequest,
  MainBranchServerSearchResponse,
  MainBranchSavePayload,
} from '@/features/pages/main-branch/types/main-branch'
import type { DepartmentSelectItem } from '@/features/pages/departments/types/department'

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

const toRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[]
  const wrapper = data as { data?: unknown[]; Data?: unknown[] } | null
  if (Array.isArray(wrapper?.data)) return wrapper.data as Record<string, unknown>[]
  if (Array.isArray(wrapper?.Data)) return wrapper.Data as Record<string, unknown>[]
  return []
}

export const getDepartmentSelectList = async (): Promise<DepartmentSelectItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Department/SelectList`)
    return toRows(response.data).map((item) => ({
      DepartmentID: Number(
        item.DepartmentID ?? item.DepartmentInfoID ?? item.Value ?? item.ID ?? item.id ?? 0
      ),
      DepartmentName: String(item.DepartmentName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const saveMainBranch = async (
  payload: MainBranchSavePayload
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveMainBranch`,
    payload
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to save main branch')
  }
  return result
}

export const buildMainBranchSavePayload = (values: {
  MainBranchID?: number
  MainBranchName: string
  MainBranchCode?: string
  DepartmentID?: string | number
  DepartmentName?: string
}): MainBranchSavePayload => ({
  MainBranchID: Number(values.MainBranchID ?? 0),
  MainBranchName: values.MainBranchName,
  MainBranchCode: values.MainBranchCode ?? '',
  DepartmentID: Number(values.DepartmentID) || 0,
  DepartmentName: values.DepartmentName ?? '',
})