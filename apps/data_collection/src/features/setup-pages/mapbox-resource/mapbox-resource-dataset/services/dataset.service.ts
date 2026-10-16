import axios from 'axios'
import type { GeoDataSetVM } from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/types/dataset'

const maps_base_url = import.meta.env.VITE_MAPS_BASE_URL // https://maps.himalayankasturi.com.np/geojson

// GET /api/Datasets
export const fetchDataSets = async (search: string = ''): Promise<GeoDataSetVM[]> => {
  const response = await axios.get<GeoDataSetVM[]>(`${maps_base_url}/api/Datasets`)
  const all = Array.isArray(response.data) ? response.data : []
  const q = search.trim().toLowerCase()
  return q ? all.filter((d) => (d.name ?? '').toLowerCase().includes(q)) : all
}

// POST /api/Datasets
export const createDataSet = async (body: {
  name: string
  description?: string
  mapId?: string
  featureList?: unknown[]
}) => {
  const response = await axios.post<GeoDataSetVM>(`${maps_base_url}/api/Datasets`, {
    name: body.name,
    description: body.description ?? '',
    mapId: body.mapId ?? '',
    featureList: body.featureList ?? [],
  })
  return response.data
}

// PATCH /api/Datasets/{id}  — body is a BsonElement[]: [{ name, value }, ...]
export const updateDataSet = async (
  id: string,
  fields: Record<string, unknown>
): Promise<void> => {
  const body = Object.entries(fields).map(([name, value]) => ({ name, value }))
  await axios.patch(`${maps_base_url}/api/Datasets/${id}`, body)
}

// DELETE /api/Datasets/{id}
export const deleteDataSet = async (id: string): Promise<void> => {
  await axios.delete(`${maps_base_url}/api/Datasets/${id}`)
}

// one call for both create + update from the drawer
export const saveDataSet = async (payload: {
  id?: string
  name: string
  description?: string
  mapId?: string
}): Promise<void> => {
  if (payload.id) {
    await updateDataSet(payload.id, {
      name: payload.name,
      description: payload.description ?? '',
    })
  } else {
    await createDataSet(payload)
  }
}