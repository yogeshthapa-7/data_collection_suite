import axios from 'axios'
import type { TreeNode } from '@/features/form-data/types/form-data'

export const flattenTree = (nodes: TreeNode[], depth: number = 0): TreeNode[] => {
  const result: TreeNode[] = []
  nodes.forEach((n) => {
    result.push(n)
    if (n.children && n.children.length) {
      result.push(...flattenTree(n.children, depth + 1))
    }
  })
  return result
}

const base_url = import.meta.env.VITE_BASE_URL || ''

export interface PageParams {
  row: number
  skip: number
}

export interface FetchTreeDataParams {
  id: number
  usrGrpCode: string
  page?: PageParams
  filterData?: Record<string, unknown>
  dynamicFilterData?: Record<string, unknown>
}

export interface CustomResponse<T> {
  data?: T
  success?: boolean
  message?: string
}

export interface CustomApiResponse {
  Data: TreeNode[]
  Message: string | null
  Success: boolean
}

export interface TreeApiParams {
  parentGUID?: string
  approveType?: number
  formID?: number
}

export const fetchTreeView = async (params?: TreeApiParams): Promise<CustomApiResponse> => {
  let url = `${base_url}TreeView`
  if (params) {
    const qs = new URLSearchParams()
    if (params.parentGUID) qs.append('parentGUID', params.parentGUID)
    if (params.approveType !== undefined) qs.append('approveType', params.approveType.toString())
    if (params.formID !== undefined) qs.append('formID', params.formID.toString())
    if (qs.toString()) url += `?${qs.toString()}`
  }
  const response = await axios.get<CustomApiResponse>(url)
  return response.data
}

export const fetchFilteredTreeData = async (
  search: string,
  page = { row: 20, skip: 0 }
): Promise<CustomApiResponse> => {
  const url = `${base_url}ViewFormData`
  const data = {
    CategoryID: 0,
    UserGroupCode: '',
    RowCount: page.row,
    SkipCount: page.skip,
    ParentGUID: '',
    ApproveType: 0,
    PKID: 0,
    DynamicFilter: { Search: search },
  }
  const response = await axios.post<CustomApiResponse>(url, data)
  return response.data
}

export const fetchTreeData = async ({
  id,
  usrGrpCode,
  page = { row: 20, skip: 0 },
  filterData = {},
  dynamicFilterData = {},
}: FetchTreeDataParams): Promise<CustomResponse<unknown>> => {
  const data = {
    CategoryID: id,
    UserGroupCode: usrGrpCode,
    RowCount: page.row,
    SkipCount: page.skip,
    ParentGUID: (filterData.ParentGUID as string) || '',
    ApproveType: Number(filterData.ApproveType) || 0,
    PKID: Number(filterData.FormID) || 0,
    DynamicFilter: dynamicFilterData,
  }
  const url = `${base_url}ViewFormData`
  const response = await axios.post<CustomResponse<unknown>>(url, data)
  return response.data
}

export const getSelectOptionsList = async (cateCode: string, dbColName: string): Promise<unknown> => {
  const url = `${base_url}GetSelectListOptions?cateCode=${cateCode}&dbColumnName=${dbColName}`
  const response = await axios.get(url)
  return response.data
}

export const approveFormData = async (catID: number, rowID: number): Promise<unknown> => {
  const url = `${base_url}ApproveFormData?categoryID=${catID}&rowID=${rowID}`
  const response = await axios.get(url)
  return response.data
}