import axios from 'axios'
import type { CategoryGroupServerSearchRequest, CategoryGroupServerSearchResponse } from '@/features/pages/category-group/types/category-type'

const base_url = import.meta.env.VITE_BASE_URL

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
    pageSize: number = 10,
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