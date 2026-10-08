import axios from 'axios'
import type {
  EmployeeServerSearchRequest,
  EmployeeServerSearchResponse,
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
