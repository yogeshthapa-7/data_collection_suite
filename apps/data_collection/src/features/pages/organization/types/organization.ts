export interface OrganizationServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface OrganizationServerSearchParam {
  OrganizationID: number
}

export interface OrganizationServerSearchRequest {
  model: OrganizationServerSearchModel
  param: OrganizationServerSearchParam
}

export interface OrganizationItem {
  SN?: number
  OrganizationID: number
  OrganizationName: string
  OrganizationCode?: string
  Description?: string
  Status?: boolean
  CreatedAt?: string
}

export interface OrganizationServerSearchResponse {
  data: OrganizationItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}
