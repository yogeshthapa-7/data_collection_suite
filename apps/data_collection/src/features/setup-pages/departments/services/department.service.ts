import axios from 'axios'
import type {
  DepartmentServerSearchRequest,
  DepartmentServerSearchResponse,
} from '@/features/setup-pages/departments/types/department'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchDepartments = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
): Promise<DepartmentServerSearchResponse> => {
  const payload: DepartmentServerSearchRequest = {
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
      DepartmentID: 0,
    },
  }
  return departmentServerSearch(payload)
}

export const departmentServerSearch = async (
  data: DepartmentServerSearchRequest
): Promise<DepartmentServerSearchResponse> => {
  const response = await axios.post<DepartmentServerSearchResponse>(
    `${base_url}Department/ServerSearch`,
    data
  )
  return response.data
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
      DepartmentID: Number(item.DepartmentID ?? item.DepartmentInfoID ?? item.Value ?? item.id ?? 0),
      DepartmentName: String(item.DepartmentName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const saveDepartment = async (
  payload: DepartmentSavePayload
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveDepartment`,
    payload
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to save department')
  }
  return result
}

export const buildDepartmentSavePayload = (values: {
  DepartmentID?: number
  DepartmentName: string
  DepartmentCode?: string
  ParentDepartmentID?: string | number
  ParentDepartmentName?: string
}): DepartmentSavePayload => ({
  DepartmentID: Number(values.DepartmentID ?? 0),
  DepartmentName: values.DepartmentName,
  DepartmentCode: values.DepartmentCode ?? '',
  ParentDepartmentID: Number(values.ParentDepartmentID) || 0,
  ParentDepartmentName: values.ParentDepartmentName ?? '',
})

export const deleteDepartment = async (
  departmentId: number
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.get<{ Success: boolean; Message?: string }>(
    `${base_url}DeleteDepartment?id=${departmentId}`
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to delete department')
  }
  return result
}
