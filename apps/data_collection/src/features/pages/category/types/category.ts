export interface CategoryServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface CategoryServerSearchParam {
  CategoryID: number
}

export interface CategoryServerSearchRequest {
  model: CategoryServerSearchModel
  param: CategoryServerSearchParam
}

export interface CategoryItem {
  SN?: number
  CategoryID: number
  CategoryGroupID?: number
  CategoryName: string
  CategoryCode?: string
  Icon?: string
  DbTableName?: string
  MapIconColor?: string
  OrderKey?: number
  ExpiryDate?: string
  CategoryGroupName?: string
  CategoryGroupCode?: string
  PublicFormSubTitle?: string
  PublicFormTitle?: string
  Description?: string
  DisplayName?: string
  LocalLabelName?: string
  Regex?: string
  Status?: boolean
  CreatedAt?: string
}

export interface CategoryServerSearchResponse {
  data: CategoryItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface CategoryGroupSelectItem {
  CategoryGroupID: number
  GroupName: string
}

export interface CategoryGroupSelectResponse {
  data: CategoryGroupSelectItem[]
}

export interface CategorySavePayload {
  SN: number
  CategoryID: number
  CategoryName: string
  CategoryCode: string
  OrderKey: number
  DbTableName: string
  CategoryGroupID: number
  MapIconColor: string
  Icon: string
  PublicFormTitle: string
  PublicFormSubTitle: string
  ExpiryDate: string
  DisplayName?: string
  LocalLabelName?: string
  Regex?: string
}