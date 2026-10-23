import axios from 'axios'
import type { CategoryItem } from '@/features/setup-pages/category/types/category'

const base_url = import.meta.env.VITE_BASE_URL || ''

export const fetchCategoryById = async (categoryId: number): Promise<CategoryItem | null> => {
  try {
    const response = await axios.post(`${base_url}Category/ServerSearch`, {
      model: { draw: 1, start: 0, length: 1, search: { value: '', regex: '' } },
      param: { CategoryID: categoryId },
    })

    const items: CategoryItem[] = response.data?.data || []
    return items.length > 0 ? items[0] : null
  } catch (error) {
    console.error('Failed to fetch category details', error)
    return null
  }
}
