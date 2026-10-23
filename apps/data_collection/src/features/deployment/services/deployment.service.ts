import axios from 'axios'
import type { DeploymentSavePayload, UserSelectItem } from '@/features/deployment/types/deployment'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const userServerSearch = async (): Promise<UserSelectItem[]> => {
  const payload = {
    model: { draw: 0, start: 0, length: 9999, search: { value: '', regex: '' } },
    param: { UserId: 0 },
  }
  const res = await axios.post<{ data: UserSelectItem[] }>(`${base_url}Users/ServerSearch`, payload)
  return res.data.data || []
}

export const getCandidateCollectorForCategory = async (id: number): Promise<UserSelectItem[]> => {
  const res = await axios.get<UserSelectItem[]>(`${base_url}GetCandidateCollectorForCategory?id=${id}`)
  return res.data || []
}

export const saveCategoryDeploymentInfo = async (data: DeploymentSavePayload): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.post<{ Success: boolean; Message?: string }>(`${base_url}SaveCategoryDeploymentInfo`, data)
  return res.data
}

export const fetchDeploymentInfo = async (
  categoryDeploymentInfoID: number,
  categoryID: number,
): Promise<{ data: any[]; recordsTotal?: number; recordsFiltered?: number }> => {
  const payload = {
    model: {
      draw: 0,
      start: 0,
      length: 50,
      search: { value: '', regex: '' },
    },
    param: { CategoryDeploymentInfoID: categoryDeploymentInfoID, CategoryID: categoryID },
  }
  const res = await axios.post<{ data: any[]; recordsTotal?: number; recordsFiltered?: number }>(
    `${base_url}CategoryGroupDeploymentInfo/ServerSearch`,
    payload
  )
  return res.data
}

export const deleteDeployment = async (id: number): Promise<{ Success: boolean; Message?: string }> => {
  const res = await axios.get<{ Success: boolean; Message?: string }>(`${base_url}DeleteCategoryGroupDeploymentInfo?id=${id}`)
  return res.data
}

export const sendNotification = async (data: unknown): Promise<unknown> => {
  const res = await axios.post<unknown>(`${base_url}SendNotification`, data)
  return res.data
}