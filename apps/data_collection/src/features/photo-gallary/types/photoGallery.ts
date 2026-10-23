export interface FormDataSearchPayload {
  FormID: number
  ApproveType: number
  DateFrom?: string
  DateTo?: string
  UserID?: number
  DynamicFilter?: Record<string, unknown>
  Search?: string
}

export interface SearchableQuestion {
  DbColumnName: string
  LabelName: string
  InputType: string
  SelectOptions?: SelectOptionItem[]
}

export interface SelectOptionItem {
  OptionValue: string
  DispName: string
}

export interface PhotoGalleryItem {
  [key: string]: unknown
  CompanyName?: string
  CreatedByUsername?: string
  Fullname?: string
  PAN_VAT?: string
  MobileNo?: string
  LandlineNo?: string
  Tole?: string
  Email?: string
  WasteTypeName?: string
  CreatedDate?: string
  CurLoc?: string
  ApprovedByUsername?: string
  ApprovedDate?: string
  Fee?: string
  Remarks?: string
  CameraImages?: string[]
  Photo?: string
}

export interface ApiResponse<T> {
  data?: T
  Success: boolean
  Message?: string
}