export interface DeploymentItem {
  CategoryDeploymentInfoID: number
  Title: string
  CategoryID: number
  CollectorsArray?: string
  ManagersArray?: string
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
  CollectorsArray: string
  ManagersArray: string
  UserPermissionList: UserPermissionItem[]
}

export interface UserPermissionItem {
  UserID: number
  CanEdit: boolean
  CanReject: boolean
  CanApprove: boolean
}
