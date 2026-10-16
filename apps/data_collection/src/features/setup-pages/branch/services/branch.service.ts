import axios from 'axios'
import type {
  BranchServerSearchRequest,
  BranchServerSearchResponse,
  BranchSavePayload,
} from '@/features/pages/branch/types/branch'
import type { DepartmentSelectItem } from '@/features/setup-pages/departments/types/department'

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

const toRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[]
  const wrapper = data as { data?: unknown[]; Data?: unknown[] } | null
  if (Array.isArray(wrapper?.data)) return wrapper.data as Record<string, unknown>[]
  if (Array.isArray(wrapper?.Data)) return wrapper.Data as Record<string, unknown>[]
  return []
}

export interface MainBranchSelectItem {
  MainBranchID: number
  MainBranchName: string
}

// export const getMainBranchSelectList = async (): Promise<MainBranchSelectItem[]> => {
//   try {
//     const response = await axios.get<unknown>(`${base_url}MainBranch/SelectList`)
//     return toRows(response.data).map((item) => ({
//       MainBranchID: Number(item.MainBranchID ?? 0),
//       MainBranchName: String(item.MainBranchName ?? item.Name ?? item.name ?? item.Text ?? ''),
//     }))
//   } catch {
//     return []
//   }
// }

export const saveBranch = async (
  payload: BranchSavePayload
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveBranch`,
    payload
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to save branch')
  }
  return result
}

export const buildBranchSavePayload = (values: {
  BranchID?: number
  BranchName: string
  BranchCode?: string
  MainBranchID?: string | number
  MainBranchName?: string
  DepartmentID?: string | number
  DepartmentName?: string
}): BranchSavePayload => ({
  BranchID: Number(values.BranchID ?? 0),
  BranchName: values.BranchName,
  BranchCode: values.BranchCode ?? '',
  MainBranchID: Number(values.MainBranchID) || 0,
  MainBranchName: values.MainBranchName ?? '',
  DepartmentID: Number(values.DepartmentID) || 0,
  DepartmentName: values.DepartmentName ?? '',
})

export const buildBranchSelectPayload = buildBranchSavePayload

export const getDepartmentSelectList = async (): Promise<DepartmentSelectItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Department/SelectList`)
    return toRows(response.data).map((item) => ({
      DepartmentID: Number(item.DepartmentID ?? item.DepartmentInfoID ?? item.Value ?? item.ID ?? item.id ?? 0),
      DepartmentName: String(item.DepartmentName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const getMainBranchSelectList = async (): Promise<MainBranchSelectItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}MainBranch/SelectList`)
    return toRows(response.data).map((item) => ({
      MainBranchID: Number(item.MainBranchID ?? item.Value ?? item.ID ?? item.id ?? 0),
      MainBranchName: String(item.MainBranchName ?? item.Name ?? item.name ?? item.Text ?? ''),
      DepartmentID: Number(item.DepartmentID ?? 0),
    }))
  } catch {
    return []
  }
}

export const getMainBranchSelectListByDept = async (
  deptId: number = 0
): Promise<MainBranchSelectItem[]> => {
  try {
    const response = await axios.get<unknown>(
      `${base_url}MainBranch/SelectList`,
      { params: { departmentID: deptId } }
    )
    const rows = toRows(response.data).map((item) => ({
      MainBranchID: Number(item.MainBranchID ?? item.Value ?? item.ID ?? item.id ?? 0),
      MainBranchName: String(item.MainBranchName ?? item.Name ?? item.name ?? item.Text ?? ''),
      DepartmentID: Number(item.DepartmentID ?? 0),
    }))

    // If API returned all branches or didn't filter by deptId on server, filter on client if DepartmentID is present
    if (deptId && rows.some((r) => r.DepartmentID > 0)) {
      return rows.filter((r) => r.DepartmentID === deptId)
    }
    return rows
  } catch {
    return []
  }
}