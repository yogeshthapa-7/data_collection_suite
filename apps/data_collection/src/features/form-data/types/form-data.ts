export interface CategoryOption {
  id: string
  text: string
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
}