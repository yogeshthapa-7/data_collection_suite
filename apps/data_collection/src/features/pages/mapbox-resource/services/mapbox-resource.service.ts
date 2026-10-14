import axios from 'axios'
import type {
  MapboxResourceServerSearchRequest,
  MapboxResourceServerSearchResponse,
  MapboxResourceFilterValues,
} from '@/features/pages/mapbox-resource/types/mapbox-resource'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchMapboxResources = async (
  page: number = 1,
  pageSize: number = 12,
  search: string = '',
  filter: MapboxResourceFilterValues = {}
): Promise<MapboxResourceServerSearchResponse> => {
  const payload: MapboxResourceServerSearchRequest = {
    model: {
      draw: page,
      start: (page - 1) * pageSize,
      length: pageSize,
      search: {
        value: search,
        regex: '',
      },
    },
    param: {
      MapboxResourceInfoId: 0,
      ...(filter.ResourceName?.trim() ? { ResourceName: filter.ResourceName.trim() } : {}),
      ...(filter.MapboxId?.trim() ? { MapboxId: filter.MapboxId.trim() } : {}),
      ...(filter.CategoryCode?.trim() ? { CategoryCode: filter.CategoryCode.trim() } : {}),
      ...(filter.ResourceType ? { ResourceType: filter.ResourceType } : {}),
    },
  }
  return mapboxResourceServerSearch(payload)
}

export const mapboxResourceServerSearch = async (
  data: MapboxResourceServerSearchRequest
): Promise<MapboxResourceServerSearchResponse> => {
  const response = await axios.post<MapboxResourceServerSearchResponse>(
    `${base_url}MapboxResourceInfo/ServerSearch`,
    data
  )
  return response.data
}

export const saveMapboxResource = async (
  payload: MapboxResourceSavePayload
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveMapboxResourceInfo`,
    payload
  )
  const result = response.data
  if (!result?.Success) throw new Error(result?.Message || 'Failed to save resource')
  return result
}

export const buildMapboxResourceSavePayload = (values: {
  MapboxResourceInfoId?: number
  ResourceName: string
  ResourceType: number
  LayerType: number
  MapboxId: string
  MapboxName: string
  CategoryCode?: string
  UniqueFeatureKey: string
}): MapboxResourceSavePayload => ({
  MapboxResourceInfoId: Number(values.MapboxResourceInfoId ?? 0),
  ResourceName: values.ResourceName,
  ResourceType: Number(values.ResourceType) || 0,
  LayerType: Number(values.LayerType) || 0,
  MapboxId: values.MapboxId,
  MapboxName: values.MapboxName,
  CategoryCode: values.CategoryCode ?? '',
  UniqueFeatureKey: values.UniqueFeatureKey,
})

export const deleteMapboxResource = async (
  mapboxResourceInfoId: number
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.get<{ Success: boolean; Message?: string }>(
    `${base_url}DeleteMapboxResourceInfo?id=${mapboxResourceInfoId}`
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to delete resource')
  }
  return result
}