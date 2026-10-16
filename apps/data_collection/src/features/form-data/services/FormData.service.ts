import axios from 'axios'

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