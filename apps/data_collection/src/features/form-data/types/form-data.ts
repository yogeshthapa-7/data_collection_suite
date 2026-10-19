export interface PageParams {
  row: number
  skip: number
}

export interface TreeNode {
  id: string
  text: string
  code: string
  icon: string
  IsFolder: boolean
  children?: TreeNode[]
  Latitude?: string | number
  Longitude?: string | number
}

export interface TreeApiParams {
  parentGUID?: string
  approveType?: number
  formID?: number
}

export interface CustomApiResponse {
  Data: TreeNode[]
  Message: string | null
  Success: boolean
}

export interface CategoryOption {
  id: string
  text: string
  code?: string
  icon?: string
  IsFolder?: boolean
  children?: TreeNode[]
}

export interface SelectOptionItem {
  OptionValue: string
  DispName: string
}

export interface SearchableQuestion {
  DbColumnName: string
  LabelName: string
  InputType: string
  SelectOptions?: SelectOptionItem[]
}

export interface TreeDataItem {
  [key: string]: unknown
  Latitude?: string | number
  Longitude?: string | number
}
