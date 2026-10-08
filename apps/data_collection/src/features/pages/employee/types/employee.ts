export interface EmployeeServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface EmployeeServerSearchParam {
  EmployeeInfoID: number
}

export interface EmployeeServerSearchRequest {
  model: EmployeeServerSearchModel
  param: EmployeeServerSearchParam
}

export interface EmployeeItem {
  SN?: number
  EmployeeInfoID: number
  EmployeeName: string
  EmployeeCode?: string
  DepartmentName?: string
  Designation?: string
  Email?: string
  PhoneNumber?: string
  Status?: boolean
  CreatedAt?: string
}

export interface EmployeeServerSearchResponse {
  data: EmployeeItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}
