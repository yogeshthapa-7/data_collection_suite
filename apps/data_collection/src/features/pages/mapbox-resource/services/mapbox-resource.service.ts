import axios from 'axios'
import type {
  MapboxResourceServerSearchRequest,
  MapboxResourceServerSearchResponse,
} from '@/features/pages/mapbox-resource/types/mapbox-resource'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchMapboxResources = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
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
