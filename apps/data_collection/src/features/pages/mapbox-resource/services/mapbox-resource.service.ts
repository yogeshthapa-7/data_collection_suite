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
  body: Record<string, unknown>
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveMapboxResourceInfo`,
    body
  )
  const result = response.data
  if (!result?.Success) throw new Error(result?.Message || 'Failed to save resource')
  return result
}