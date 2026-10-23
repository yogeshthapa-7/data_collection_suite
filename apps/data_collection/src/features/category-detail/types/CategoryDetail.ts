import type { CategoryItem } from '@/features/setup-pages/category/types/category'

export interface CategoryWorkspaceContext {
  categoryId: number
  categoryInfo: CategoryItem | null
  loading: boolean
  refetchCategory: () => void
}

export interface TabItem {
  key: string
  label: string
}
