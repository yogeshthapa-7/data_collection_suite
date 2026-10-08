export interface CategoryGroupServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface CategoryGroupServerSearchParam {
  CategoryGroupID: number
}

export interface CategoryGroupServerSearchRequest {
  model: CategoryGroupServerSearchModel
  param: CategoryGroupServerSearchParam
}

export interface CategoryGroupItem {
  CategoryGroupID: number
  GroupName: string
  GroupCode?: string
  Icon?: string
  Description?: string
  OrderKey?: number
}

export interface CategoryGroupServerSearchResponse {
  data: CategoryGroupItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}