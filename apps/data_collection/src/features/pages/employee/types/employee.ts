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
  Fullname: string
  Address: string
  Phone: string
  Email: string
  DOB?: string
  Gender: number
  EmpStatus: number
  DepartmentID: number
  DepartmentName: string
  BranchID: number
  BranchName: string
  MainBranchID: number
  MainBranchName: string
  OrganizationOfficeID: number
  OrganizationOfficeName: string
  Photo?: string
  Status?: number
}

export interface EmployeeServerSearchResponse {
  data: EmployeeItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface OrgOfficeItem {
  OrganizationOfficeID: number
  OrganizationOfficeName: string
}

export interface DepartmentItem {
  DepartmentInfoID: number
  DepartmentName: string
}

export interface MainBranchItem {
  MainBranchID: number
  MainBranchName: string
  DepartmentID: number
}

export interface BranchItem {
  BranchID: number
  BranchName: string
  MainBranchID: number
  DepartmentID: number
}
