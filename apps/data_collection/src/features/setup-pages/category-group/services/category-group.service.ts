import axios from 'axios'
import type { categoryGroupSavePayload, CategoryGroupServerSearchRequest, CategoryGroupServerSearchResponse, CategoryGroupSavePayload } from '@/features/setup-pages/category-group/types/category-type'

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
): Promise<{ Success: boolean; Message }> => {
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
}): CategoryGroupSavePayload => ({
    CategoryGroupID: values.CategoryGroupID ?? 0,
    GroupName: values.GroupName,
    GroupCode: values.GroupCode ?? '',
    Icon: values.Icon ?? '',
})