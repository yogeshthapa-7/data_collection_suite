export interface BranchServerSearchModel {
  draw: number
  start: number
  length: number
  search: { value: string; regex: string }
}

export interface BranchServerSearchParam {
  BranchID: number
}

export interface BranchServerSearchRequest {
  model: BranchServerSearchModel
  param: BranchServerSearchParam
}

export interface BranchItem {
 SN?: number
  BranchID: number
  BranchName: string
  BranchCode?: string
  MainBranchID?: number
  MainBranchName?: string
  DepartmentID?: number
  DepartmentName?: string
}

export interface BranchServerSearchResponse {
  data: BranchItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}