import { useEffect, useState, useMemo } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import { saveCategoryDeploymentInfo } from '@/features/deployment/services/deployment.service'
import type {
  DeploymentItem,
  UserSelectItem,
  UserPermissionItem,
  DeploymentSavePayload,
} from '@/features/deployment/types/deployment'

interface DeploymentFormProps {
  editingDeployment: DeploymentItem | null
  users: UserSelectItem[]
  categoryID: number
  onCancel: () => void
  onSuccess: () => void
}

const extractUserIds = (raw: unknown, users: UserSelectItem[]): number[] => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'number') return item
        if (typeof item === 'string') {
          const n = Number(item)
          if (!isNaN(n)) return n
          const u = users.find((x) => x.UserName?.toLowerCase() === item.toLowerCase())
          return u ? u.UserId : null
        }
        if (item && typeof item === 'object') {
          return (item as any).UserId ?? (item as any).UserID ?? null
        }
        return null
      })
      .filter((id): id is number => id !== null)
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((part) => {
        const n = Number(part)
        if (!isNaN(n)) return n
        const u = users.find((x) => x.UserName?.toLowerCase() === part.toLowerCase())
        return u ? u.UserId : null
      })
      .filter((id): id is number => id !== null)
  }
  return []
}

const extractPermissions = (deployment: DeploymentItem | null): UserPermissionItem[] => {
  if (!deployment) return []
  const list =
    deployment.CategoryDeploymentViewerInfo ||
    deployment.UserPermissionList ||
    (deployment as any).CategoryDeploymentViewerInfos ||
    (deployment as any).ViewerPermissions ||
    []
  if (!Array.isArray(list)) return []
  return list.map((p: any) => ({
    UserID: p.UserID ?? p.UserId ?? 0,
    CanEdit: Boolean(p.CanEdit),
    CanReject: Boolean(p.CanReject),
    CanApprove: Boolean(p.CanApprove),
    Username: p.Username ?? p.UserName,
  }))
}

const DeploymentForm = ({
  editingDeployment,
  users,
  categoryID,
  onCancel,
  onSuccess,
}: DeploymentFormProps) => {
  const [form] = Form.useForm()
  const [userPermissions, setUserPermissions] = useState<UserPermissionItem[]>([])
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [newRow, setNewRow] = useState<UserPermissionItem>({
    UserID: 0,
    CanEdit: false,
    CanReject: false,
    CanApprove: false,
  })
  const [saving, setSaving] = useState(false)

  // Options for users dropdown including fallback options for any IDs present in the deployment
  const userOptions = useMemo(() => {
    const list = [...users]
    const knownIds = new Set(list.map((u) => u.UserId))
    const rawCollectors = editingDeployment?.Collectors || editingDeployment?.CollectorsArray
    const rawManagers = editingDeployment?.Managers || editingDeployment?.ManagersArray
    const ids = [
      ...extractUserIds(rawCollectors, users),
      ...extractUserIds(rawManagers, users),
      ...userPermissions.map((p) => p.UserID),
    ]
    ids.forEach((id) => {
      if (id && !knownIds.has(id)) {
        list.push({ UserId: id, UserName: `User #${id}` })
        knownIds.add(id)
      }
    })
    return list.map((u) => ({ value: u.UserId, label: u.UserName || `User #${u.UserId}` }))
  }, [users, editingDeployment, userPermissions])

  useEffect(() => {
    if (editingDeployment) {
      const collectorsRaw =
        editingDeployment.Collectors ?? editingDeployment.CollectorsArray ?? ''
      const managersRaw =
        editingDeployment.Managers ?? editingDeployment.ManagersArray ?? ''

      const selectedCollectors = extractUserIds(collectorsRaw, users)
      const selectedManagers = extractUserIds(managersRaw, users)

      form.setFieldsValue({
        Title: editingDeployment.Title ?? '',
        Collectors: selectedCollectors,
        Managers: selectedManagers,
      })

      setUserPermissions(extractPermissions(editingDeployment))
    } else {
      form.resetFields()
      form.setFieldsValue({
        Title: '',
        Collectors: [],
        Managers: [],
      })
      setUserPermissions([])
    }
  }, [editingDeployment, users, form])

  const handleSubmit = async (values: {
    Title: string
    Collectors?: (number | string)[]
    Managers?: (number | string)[]
  }) => {
    setSaving(true)
    try {
      const payload: DeploymentSavePayload = {
        CategoryDeploymentInfoID: editingDeployment?.CategoryDeploymentInfoID ?? 0,
        CategoryID: categoryID || editingDeployment?.CategoryID || 0,
        Title: values.Title,
        Collectors: (values.Collectors || []).join(','),
        Managers: (values.Managers || []).join(','),
        CategoryDeploymentViewerInfo: userPermissions.map((perm) => ({
          UserID: perm.UserID,
          CanEdit: perm.CanEdit,
          CanReject: perm.CanReject,
          CanApprove: perm.CanApprove,
        })),
      }
      await saveCategoryDeploymentInfo(payload)
      message.success('Deployment saved successfully')
      onSuccess()
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save deployment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name="Title"
          label="Title"
          rules={[{ required: true, message: 'Required Field' }]}
        >
          <AppInput placeholder="Enter title" />
        </Form.Item>

        <Form.Item name="Collectors" label="Collectors">
          <AppSelect
            placeholder="Select collectors"
            options={userOptions}
            mode="multiple"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item name="Managers" label="Managers">
          <AppSelect
            placeholder="Select managers"
            options={userOptions}
            mode="multiple"
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <fieldset className="mb-5 rounded-lg border border-slate-200 p-4">
          <legend className="ml-2 px-2 text-sm font-semibold text-slate-700">
            Viewer Permissions
          </legend>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-3 py-2 text-left text-xs font-medium text-slate-600">
                    Username
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600">
                    Can Edit
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600">
                    Can Reject
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600">
                    Can Approve
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {userPermissions.map((row, index) => {
                  const selectedUser = users.find((u) => u.UserId === row.UserID)
                  return (
                    <tr key={index}>
                      <td className="border border-slate-200 px-3 py-2">
                        {selectedUser?.UserName ?? row.Username ?? (row.UserID ? `User #${row.UserID}` : '-')}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        {row.CanEdit ? '✔' : '❌'}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        {row.CanReject ? '✔' : '❌'}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        {row.CanApprove ? '✔' : '❌'}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRow(index)
                            setNewRow({ ...row })
                          }}
                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newPermissions = [...userPermissions]
                            newPermissions.splice(index, 1)
                            setUserPermissions(newPermissions)
                            if (editingRow === index) {
                              setEditingRow(null)
                              setNewRow({
                                UserID: 0,
                                CanEdit: false,
                                CanReject: false,
                                CanApprove: false,
                              })
                            }
                          }}
                          className="ml-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border border-slate-200 px-3 py-2">
                    <AppSelect
                      placeholder="Select user"
                      options={users
                        .filter((u) =>
                          editingRow !== null
                            ? true
                            : !userPermissions.some((p) => p.UserID === u.UserId)
                        )
                        .map((u) => ({ value: u.UserId, label: u.UserName }))}
                      value={newRow.UserID || undefined}
                      onChange={(val) => setNewRow({ ...newRow, UserID: val as number })}
                      className="w-full"
                      showSearch
                      allowClear
                    />
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-center">
                    <AppSelect
                      placeholder=""
                      options={[
                        { value: 1, label: 'True' },
                        { value: 0, label: 'False' },
                      ]}
                      value={newRow.CanEdit ? 1 : 0}
                      onChange={(val) => setNewRow({ ...newRow, CanEdit: val === 1 })}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-center">
                    <AppSelect
                      placeholder=""
                      options={[
                        { value: 1, label: 'True' },
                        { value: 0, label: 'False' },
                      ]}
                      value={newRow.CanReject ? 1 : 0}
                      onChange={(val) => setNewRow({ ...newRow, CanReject: val === 1 })}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-center">
                    <AppSelect
                      placeholder=""
                      options={[
                        { value: 1, label: 'True' },
                        { value: 0, label: 'False' },
                      ]}
                      value={newRow.CanApprove ? 1 : 0}
                      onChange={(val) => setNewRow({ ...newRow, CanApprove: val === 1 })}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-slate-200 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (editingRow !== null) {
                            const newPermissions = [...userPermissions]
                            newPermissions[editingRow] = { ...newRow }
                            setUserPermissions(newPermissions)
                            setEditingRow(null)
                            setNewRow({
                              UserID: 0,
                              CanEdit: false,
                              CanReject: false,
                              CanApprove: false,
                            })
                          } else {
                            setUserPermissions([...userPermissions, { ...newRow }])
                            setNewRow({
                              UserID: 0,
                              CanEdit: false,
                              CanReject: false,
                              CanApprove: false,
                            })
                          }
                        }}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                        disabled={!newRow.UserID}
                      >
                        {editingRow !== null ? 'Update' : 'Add'}
                      </button>
                      {editingRow !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRow(null)
                            setNewRow({
                              UserID: 0,
                              CanEdit: false,
                              CanReject: false,
                              CanApprove: false,
                            })
                          }}
                          className="rounded bg-gray-500 px-2 py-1 text-xs text-white hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </fieldset>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default DeploymentForm