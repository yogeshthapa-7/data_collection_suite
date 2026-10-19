import axios from 'axios'
import type { categoryGroupSavePayload, CategoryGroupServerSearchRequest, CategoryGroupServerSearchResponse } from '@/features/setup-pages/category-group/types/category-type'

export interface CategoryOption {
  id: string
  text: string
}

const base_url = import.meta.env.VITE_BASE_URL

const toRows = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) return data as Record<string, unknown>[]
  const wrapper = data as { data?: unknown[]; Data?: unknown[] } | null
  if (Array.isArray(wrapper?.data)) return wrapper.data as Record<string, unknown>[]
  if (Array.isArray(wrapper?.Data)) return wrapper.Data as Record<string, unknown>[]
  return []
}

export const getCategoryGroupSelectList = async (): Promise<CategoryOption[]> => {
  try {
    const response = await axios.get<unknown>(`${base_url}CategoryGroup/SelectList`)
    return toRows(response.data).map((item) => ({
      id: String(item.CategoryGroupID ?? item.Value ?? item.id ?? ''),
      text: String(item.GroupName ?? item.Name ?? item.name ?? item.Text ?? ''),
    }))
  } catch {
    return []
  }
}

export const categoryGroupServerSearch = async (
    data: CategoryGroupServerSearchRequest
): Promise <CategoryGroupServerSearchResponse> => {
    const response = await axios.post <CategoryGroupServerSearchResponse>(
        `${base_url}CategoryGroup/ServerSearch`,
        data
    )
    return response.data
}

export const fetchCategoryGroups = async (
    page: number = 1,
    pageSize: number = 12,
    search: string = ''
): Promise<CategoryGroupServerSearchResponse> => {
    const payload: CategoryGroupServerSearchRequest = {
        model: {
            draw: page,
            start: (page-1) * pageSize,
            length: pageSize,
            search: {
                value: search,
                regex: '',
            },
        },
        param: {
            CategoryGroupID: 0,
        },
    }
    return categoryGroupServerSearch(payload)
}

export const deleteCategoryGroup = async (
    categoryGroupId: number
): Promise<{ Success: boolean; Message?: string }> => {
    const response = await axios.get<{ Success: boolean; Message?: string }>(
        `${base_url}DeleteCategoryGroup?CategoryGroupID=${categoryGroupId}`
    )
    const result = response.data
    if (!result?.Success) {
        throw new Error(result?.Message || 'Failed to delete category group')
    }
    return result
}

export const saveCategoryGroup = async (
    payload: categoryGroupSavePayload
): Promise<{ Success: boolean; Message?: string }> => {
    const response = await axios.post<{ Success: boolean; Message?: string }>(
        `${base_url}SaveCategoryGroup`,
        payload
    )
    const result = response.data
    if (!result?.Success) {
        throw new Error(result?.Message || 'Failed to save category group')
    }
    return result
}

export const buildCategoryGroupSavePayload = (values: {
    CategoryGroupID?: number
    GroupName: string
    GroupCode?: string
    Icon?: string
}): categoryGroupSavePayload => ({
    CategoryGroupID: values.CategoryGroupID ?? 0,
    GroupName: values.GroupName,
    GroupCode: values.GroupCode ?? '',
    Icon: values.Icon ?? '',
})