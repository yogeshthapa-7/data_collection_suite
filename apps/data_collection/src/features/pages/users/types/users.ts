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
  UserID: number
  UserName: string
  Email?: string
  PhoneNumber?: string
  Role?: string
  Status?: boolean
  CreatedAt?: string
}

export interface UserServerSearchResponse {
  data: UserItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}
