export interface DeploymentItem {
  CategoryDeploymentInfoID: number
  Title: string
  CategoryID: number
  Collectors?: string
  Managers?: string
  CollectorsArray?: string
  ManagersArray?: string
  CategoryDeploymentViewerInfo?: UserPermissionItem[]
  UserPermissionList?: UserPermissionItem[]
  UserID?: number
  UserName?: string
}

export interface UserSelectItem {
  UserId: number
  UserName: string
  UserGroupName?: string
  Theme?: string
  UserGroupId?: number
  OrganizationID?: number
}

export interface DeploymentSavePayload {
    CategoryDeploymentInfoID: number
  CategoryID: number
  Title: string
  Collectors: string
  Managers: string
  CategoryDeploymentViewerInfo: UserPermissionItem[]
}

export interface UserPermissionItem {
   UserID: number
  CanEdit: boolean
  CanReject: boolean
  CanApprove: boolean
  Username?: string
}
