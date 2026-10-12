export interface MapboxResourceServerSearchModel {
  draw: number
  start: number
  length: number
  search: {
    value: string
    regex: string
  }
}

export interface MapboxResourceServerSearchParam {
  MapboxResourceInfoId: number
  ResourceName?: string
  MapboxId?: string
  CategoryCode?: string
  ResourceType?: number
}

export interface MapboxResourceServerSearchRequest {
  model: MapboxResourceServerSearchModel
  param: MapboxResourceServerSearchParam
}

export interface MapboxResourceItem {
  SN?: number
  MapboxResourceInfoID: number
  ResourceName: string
  ResourceCode?: string
  MapboxId?: string
  MapboxName?: string
  MapboxToken?: string
  CategoryCode?: string
  ResourceType?: number
  LayerType?: number
  UniqueFeatureKey?: string
  Description?: string
}

export interface MapboxResourceFormValues {
  MapboxResourceInfoID?: number
  MapboxName: string
  MapboxId: string
  ResourceName: string
  CategoryCode: string
  ResourceType: number
  LayerType: number
  UniqueFeatureKey: string
}

export interface MapboxResourceServerSearchResponse {
  data: MapboxResourceItem[]
  recordsTotal: number
  recordsFiltered: number
  draw: number
}

export interface MapboxResourceFilterValues {
  ResourceName?: string
  MapboxId?: string
  CategoryCode?: string
  ResourceType?: number
}

export type LayerTypeId = 1 | 2 | 3

export const LAYER_TYPE_MAP: Record<LayerTypeId, string> = {
  1: 'Line',
  2: 'Polygon',
  3: 'Point',
}

export const getLayerTypeLabel = (id: number): string => {
  if (id === 0) return ''
  return LAYER_TYPE_MAP[id as LayerTypeId] ?? String(id)
}


export const RESOURCE_TYPE_MAP: Record<number, string> ={
  1: 'Styles',
  2: 'Layers',
  3: 'Rasters',
  4: 'Datasets',
}

export const getResourceTypeLabel = (id: number): string => {
  return RESOURCE_TYPE_MAP[id] ?? String(id)
}

export const RESOURCE_TYPE_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Select ResourceType' },
  ...Object.entries(RESOURCE_TYPE_MAP).map(([value, label]) => ({ value: Number(value), label })),
]