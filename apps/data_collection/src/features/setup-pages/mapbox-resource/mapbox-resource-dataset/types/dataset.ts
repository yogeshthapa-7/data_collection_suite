export interface DataSetServerSearchModel {
  draw: number
  start: number
  length: number
  search: { value: string; regex: string }
}

export interface DataSetServerSearchParam {
  DataSetID: number
  Name?: string
}

export interface DataSetServerSearchRequest {
  model: DataSetServerSearchModel
  param: DataSetServerSearchParam
}

export interface DataSetItem {
  SN?: number
  id: string
  name: string
  description?: string
}

export interface DataSetServerSearchResponse {
  data: DataSetItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface DataSetFormValues {
  DataSetID?: number
  Name: string
  Description: string
  FeatureJson: string
}

export interface DataSetSavePayload {
  DataSetID: number
  Name: string
  Description: string
  FeatureJson: string
  MapboxResourceInfoId: number
}

export interface GeoDataSetVM {
  id?: string | null
  owner?: string | null
  mapId?: string | null
  created?: string | null
  modified?: string | null
  bounds?: number[] | null
  features?: number | null
  size?: number | null
  name?: string | null
  description?: string | null
  featureList?: unknown[] | null
}