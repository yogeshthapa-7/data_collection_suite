import axios from 'axios'
import type { RankingCondition, RankingCriteriaSelectItem } from '@/features/ranking/types/ranking'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchRankingCriterias = async (categoryID: number): Promise<RankingCriteriaSelectItem[]> => {
  const payload = {
    model: { draw: 0, start: 0, length: 99, search: { value: '', regex: '' } },
    param: { CategoryID: categoryID },
  }
  const res = await axios.post<{ data: RankingCriteriaSelectItem[] }>(`${base_url}RankingCriteria/ServerSearch`, payload)
  return (res.data.data || []).map((c: any) => ({
    RankingCriteriaID: c.RankingCriteriaID,
    CriteriaName: c.CriteriaName,
  }))
}

export const fetchRankingConditions = async (categoryID: number, rankingCriteriaID: number): Promise<RankingCondition[]> => {
  const payload = {
    model: { draw: 0, start: 0, length: 999, search: { value: '', regex: '' } },
    param: { RankingConditionID: 0, CategoryID: categoryID, RankingCriteriaID: rankingCriteriaID },
  }
  const res = await axios.post<{ data: RankingCondition[] }>(`${base_url}RankingCondition/ServerSearch`, payload)
  return res.data.data || []
}

export const saveRankingCondition = async (data: Partial<RankingCondition>): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.post<{ Success: boolean; Message?: string }>(`${base_url}SaveRankingCondition`, data)
  return res.data
}

export const deleteRankingCondition = async (id: number): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.get<{ Success: boolean; Message?: string }>(`${base_url}DeleteRankingCondition?RankingConditionID=${id}`)
  return res.data
}