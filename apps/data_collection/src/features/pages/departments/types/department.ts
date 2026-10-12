export interface DepartmentServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface DepartmentServerSearchParam {
  DepartmentID: number
}

export interface DepartmentServerSearchRequest {
  model: DepartmentServerSearchModel
  param: DepartmentServerSearchParam
}

export interface DepartmentItem {
  SN?: number
  DepartmentID: number
  DepartmentName: string
  DepartmentCode?: string
  ParentDepartmentID?: number
  ParentDepartmentName?: string
  Description?: string
  Status?: boolean
  CreatedAt?: string
}

export interface DepartmentServerSearchResponse {
  data: DepartmentItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}
