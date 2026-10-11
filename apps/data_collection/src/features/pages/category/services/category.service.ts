import axios from 'axios'
import type {
  CategoryServerSearchRequest,
  CategoryServerSearchResponse,
  CategoryGroupSelectItem,
  CategorySavePayload,
} from '@/features/pages/category/types/category'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const categoryServerSearch = async (
  data: CategoryServerSearchRequest
): Promise<CategoryServerSearchResponse> => {
  const response = await axios.post<CategoryServerSearchResponse>(
    `${base_url}Category/ServerSearch`,
    data
  )
  return response.data
}

export const fetchCategories = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
): Promise<CategoryServerSearchResponse> => {
  const payload: CategoryServerSearchRequest = {
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
      CategoryID: 0,
    },
  }
  return categoryServerSearch(payload)
}

export const getCategoryGroupSelectList = async (): Promise<CategoryGroupSelectItem[]> => {
  const response = await axios.get<
    Array<{ id?: number; text?: string; CategoryGroupID?: number; GroupName?: string; GroupCode?: string }>
  >(`${base_url}CategoryGroup/SelectList`)

  // CategoryGroup/SelectList returns either { id, text } or { CategoryGroupID, GroupName }
  return (response.data ?? []).map((item) => ({
    CategoryGroupID: item.id ?? item.CategoryGroupID ?? 0,
    GroupName: item.text ?? item.GroupName ?? '',
    GroupCode: item.GroupCode,
  }))
}

export const saveCategory = async (
  payload: CategorySavePayload
): Promise<{ Success: boolean; Message?: string }> => {
  const response = await axios.post<{ Success: boolean; Message?: string }>(
    `${base_url}SaveCategory`,
    payload
  )
  const result = response.data
  if (!result?.Success) {
    throw new Error(result?.Message || 'Failed to save category')
  }
  return result
}

export const buildCategorySavePayload = (values: {
  CategoryID?: number
  CategoryName: string
  CategoryCode?: string
  OrderKey?: number
  DbTableName?: string
  CategoryGroupID?: number
  MapIconColor?: string
  Icon?: string
  PublicFormTitle?: string
  PublicFormSubTitle?: string
  ExpiryDate?: string
  DisplayName?: string
  LocalLabelName?: string
  Regex?: string
}): CategorySavePayload => ({
  SN: 0,
  CategoryID: values.CategoryID ?? 0,
  CategoryName: values.CategoryName,
  CategoryCode: values.CategoryCode ?? '',
  OrderKey: Number(values.OrderKey ?? 0),
  DbTableName: values.DbTableName ?? '',
  CategoryGroupID: values.CategoryGroupID ?? 0,
  MapIconColor: values.MapIconColor ?? '',
  Icon: values.Icon ?? '',
  PublicFormTitle: values.PublicFormTitle ?? '',
  PublicFormSubTitle: values.PublicFormSubTitle ?? '',
  ExpiryDate: values.ExpiryDate ?? '',
  ...(values.DisplayName ? { DisplayName: values.DisplayName } : {}),
  ...(values.LocalLabelName ? { LocalLabelName: values.LocalLabelName } : {}),
  ...(values.Regex ? { Regex: values.Regex } : {}),
})
