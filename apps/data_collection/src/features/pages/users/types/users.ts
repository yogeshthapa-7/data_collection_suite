export interface UserServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface UserServerSearchParam {
  UserID: number
}

export interface UserServerSearchRequest {
  model: UserServerSearchModel
  param: UserServerSearchParam
}

export interface UserItem {
  SN?: number
  UserId: number
  UserName: string
  FullName?: string
  UserGroupId?: number
  UserGroupCode?: string
  UserGroupName?: string
  OrganizationID?: number
  OrganizationName?: string
  Theme?: string
}

export interface UserFormValues {
  UserId?: number
  UserName: string
  FullName: string
  Password: string
  ConfirmPassword: string
  UserGroupId: string
  OrganizationId: string
  Theme?: string
}

export interface UserServerSearchResponse {
  data: UserItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface UserGroupItem {
  UserGroupId: number
  UserGroupName: string
  UserGroupCode: string
}

export interface OrganizationItem {
  OrganizationID: number
  OrganizationName: string
}