import axios from 'axios'
import type {
  CategoryServerSearchRequest,
  CategoryServerSearchResponse,
  CategoryGroupSelectItem,
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
  const response = await axios.get<CategoryGroupSelectItem[]>(
    `${base_url}CategoryGroup/SelectList`
  )
  return response.data
}
