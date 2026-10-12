import axios from 'axios'
import type {
  EmployeeServerSearchRequest,
  EmployeeServerSearchResponse,
  OrgOfficeItem,
  DepartmentItem,
  MainBranchItem,
  BranchItem
} from '@/features/pages/employee/types/employee'

const base_url = import.meta.env.VITE_BASE_URL || ''


export const fetchEmployees = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
): Promise<EmployeeServerSearchResponse> => {
  const payload: EmployeeServerSearchRequest = {
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
      EmployeeInfoID: 0,
    },
  }
  return employeeServerSearch(payload)
}

export const employeeServerSearch = async (
  data: EmployeeServerSearchRequest
): Promise<EmployeeServerSearchResponse> => {
  const response = await axios.post<EmployeeServerSearchResponse>(
    `${base_url}EmployeeInfo/ServerSearch`,
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

export const getOrganizationOfficeSelectList = async (): Promise<OrgOfficeItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}OrganizationOffice/SelectList`)
    return toRows(response.data).map((item) => ({
      OrganizationOfficeID: Number(item.OrganizationOfficeID ?? item.Value ?? item.id ?? 0),
      OrganizationOfficeName: String(item.OrganizationOfficeName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const getDepartmentSelectList = async (): Promise<DepartmentItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Department/SelectList`)
    return toRows(response.data).map((item) => ({
      DepartmentInfoID: Number(item.DepartmentInfoID ?? item.DepartmentID ?? item.Value ?? item.id ?? 0),
      DepartmentName: String(item.DepartmentName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const getMainBranchSelectList = async (): Promise<MainBranchItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}MainBranch/SelectList`)
    return toRows(response.data).map((item) => ({
      MainBranchID: Number(item.MainBranchID ?? item.Value ?? item.id ?? 0),
      MainBranchName: String(item.MainBranchName ?? item.Name ?? item.name ?? item.Text ?? ''),
      DepartmentID: Number(item.DepartmentID ?? 0),
    }))
  } catch {
    return []
  }
}

export const getBranchSelectList = async (): Promise<BranchItem[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}Branch/SelectList`)
    return toRows(response.data).map((item) => ({
      BranchID: Number(item.BranchID ?? item.Value ?? item.id ?? 0),
      BranchName: String(item.BranchName ?? item.Name ?? item.name ?? item.Text ?? ''),
      MainBranchID: Number(item.MainBranchID ?? 0),
      DepartmentID: Number(item.DepartmentID ?? 0),
    }))
  } catch {
    return []
  }
}

export const uploadEmployeePhoto = async (file: File): Promise<string> => {
  const uploadFormData = new FormData()
  uploadFormData.append('Image', file)
  uploadFormData.append('UserId', '0')

  const response = await axios.post<{
    Success: boolean
    Message?: string
    Data?: { BasePath?: string }
  }>(
    `${base_url}UploadFile`,
    uploadFormData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )

  const basePath = response.data?.Data?.BasePath || ''
  if (!response.data?.Success || !basePath) {
    throw new Error(response.data?.Message || 'failed to upload file')
  }
  return basePath
}
