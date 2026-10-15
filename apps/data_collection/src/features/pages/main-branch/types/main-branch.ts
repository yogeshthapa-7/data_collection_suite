export interface MainBranchServerSearchModel {
  draw: number
  start: number
  length: number
  search: { value: string; regex: string }
}

export interface MainBranchServerSearchParam {
  MainBranchID: number
}

export interface MainBranchServerSearchRequest {
  model: MainBranchServerSearchModel
  param: MainBranchServerSearchParam
}

export interface MainBranchItem {
   SN?: number
  MainBranchID: number
  MainBranchName: string
  MainBranchCode?: string
  DepartmentID?: number
  DepartmentName?: string
}

export interface MainBranchServerSearchResponse {
  data: MainBranchItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}