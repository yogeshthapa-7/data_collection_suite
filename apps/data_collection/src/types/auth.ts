export interface LoginRequest {
  clientcode: string
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiration: string
  user_group_code: string
  department_code: string
  fullname: string
  email: string
  otp_need: boolean
  otp_code: string
  otp_valid_sec: number
}

export interface EmployeeInfo {
  EmployeeInfoID: number
  Fullname: string
  Address: string
  Phone: string
  Email: string
  Gender: number
  DOB: string
  DepartmentID: number
  MainBranchID: number
  BranchID: number
  Photo: string
  EmpStatus: number
  Username: string | null
  Password: string | null
  OrganizationOfficeID: number
  DepartmentName: string
  BranchName: string
  MainBranchName: string
  OrganizationOfficeName: string | null
  TraceKey: string | null
}

export interface LoggedInUserData {
  UserId: number
  UserName: string
  FullName: string | null
  Password: string | null
  UserGroupId: number
  UserGroupCode: string
  IsActive: boolean
  ValidTo: string | null
  ValidFrom: string | null
  UserGroupName: string
  Theme: string
  CompanyCode: string | null
  BaseURL: string | null
  Photo: string
  McavesDBCnr: string | null
  EmployeeID: number
  OrganizationID: number
  PublicEntry: boolean
  Module: string | null
  EmployeeInfo: EmployeeInfo
  EmpInfo: string | null
}

export interface LoggedInUserResponse {
  Data: LoggedInUserData
  Message: string | null
  Success: boolean
}

export interface SubMenu {
  ModuleName: string
  PageInfoID: number
  PageModuleID: number
  Title: string
  NepTitle: string
  Url: string
  Icon: string
  IconBG: string
  Caret: boolean
  MasterPageInfoID: number
  Level: number
  OrderKey: number
  ScreenCode: string
  Description: string
  CanView: boolean
  SubMenu: any[] | null
}

export interface Menu {
  ModuleName: string
  PageInfoID: number
  PageModuleID: number
  Title: string
  NepTitle: string
  Url: string
  Icon: string
  IconBG: string
  Caret: boolean
  MasterPageInfoID: number
  Level: number
  OrderKey: number
  ScreenCode: string
  Description: string
  CanView: boolean
  SubMenu: SubMenu[] | null
}

export interface LoggedInMenusResponse {
  Data: Menu[]
  Message: string | null
  Success: boolean
}

export interface UserSession {
  token: string
  userGroupCode: string
  clientCode: string
  userInfo: LoggedInUserData | null
  menus: Menu[] | null
}
