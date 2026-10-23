import axios from 'axios'
import type { PhotoGalleryItem, SearchableQuestion, SelectOptionItem } from '@/features/photo-gallary/types/photoGallery'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchAllCollectors = async (categoryID: number): Promise<{ value: number; label: string }[]> => {
  const res = await axios.get(`${base_url}GetCandidateCollectorForCategory?id=${categoryID}`)
  const data = res.data?.Data || res.data || []
  return data.map((u: any) => ({
    value: u.UserID ?? u.UserId,
    label: u.Fullname
      ? `${u.Username} (${u.Fullname})`
      : u.Username || u.text || '',
  }))
}

export const fetchData = async (
  categoryID: number,
  filterData: Record<string, unknown>,
  dynamicFilterData: Record<string, unknown>,
  row = 1000,
  skip = 0,
): Promise<any> => {
  const payload = {
    model: {
      draw: 0,
      start: skip,
      length: row,
      search: { value: '', regex: '' },
    },
    param: {
      CategoryID: categoryID,
      UserGroupCode: 'DCAD',
      FilterData: filterData,
      DynamicFilter: dynamicFilterData,
    },
  }
  const res = await axios.post(`${base_url}ViewFormData`, payload)
  return res.data
}

