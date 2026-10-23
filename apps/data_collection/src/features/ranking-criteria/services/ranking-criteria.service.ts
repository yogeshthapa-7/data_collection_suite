import axios from 'axios'
import type { RankingCriteria, RankingCriteriaSavePayload } from '@/features/ranking-criteria/types/ranking-criteria'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchRankingCriteria = async (categoryID: number): Promise<RankingCriteria[]> => {
  const payload = {
    model: { draw: 0, start: 0, length: 99, search: { value: '', regex: '' } },
    param: { CategoryID: categoryID },
  }
  const res = await axios.post<{ data: RankingCriteria[] }>(`${base_url}RankingCriteria/ServerSearch`, payload)
  return res.data.data || []
}

export const saveRankingCriteria = async (data: RankingCriteriaSavePayload): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.post<{ Success: boolean; Message?: string }>(`${base_url}SaveRankingCriteria`, data)
  return res.data
}

export const deleteRankingCriteria = async (id: number): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.get<{ Success: boolean; Message?: string }>(`${base_url}DeleteRankingCriteria?id=${id}`)
  return res.data
}