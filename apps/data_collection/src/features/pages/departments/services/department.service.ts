import axios from 'axios'
import type {
  DepartmentServerSearchRequest,
  DepartmentServerSearchResponse,
} from '@/features/pages/departments/types/department'

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
