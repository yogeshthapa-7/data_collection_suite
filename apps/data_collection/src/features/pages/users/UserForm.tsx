import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import type { UserItem, UserGroupItem, OrganizationItem, UserFormValues } from '@/features/pages/users/types/users'
import { getUserGroupSelectList, getOrganizationSelectList } from '@/features/pages/users/services/users.service'

const UserForm = ({
  user = null,
  onCancel,
  onSuccess,
}: {
  user?: UserItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [userGroups, setUserGroups] = useState<UserGroupItem[]>([])
  const [organizations, setOrganizations] = useState<OrganizationItem[]>([])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoadingOptions(true)
      const [groups, orgs] = await Promise.all([getUserGroupSelectList(), getOrganizationSelectList()])
      if (!isMounted) return
      setUserGroups(groups)
      setOrganizations(orgs)
      setLoadingOptions(false)
    }
    load()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        UserId: user.UserId,
        UserName: user.UserName,
        FullName: user.FullName ?? '',
        UserGroupId: user.UserGroupId ? String(user.UserGroupId) : undefined,
        OrganizationID: user.OrganizationID ? String(user.OrganizationID) : undefined,
        Theme: user.Theme,
        Password: '',
        ConfirmPassword: '',
      })
    } else {
      form.resetFields()
    }
  }, [user, form])

  const userGroupOptions = userGroups.map((item) => ({
    value: String(item.UserGroupId),
    label: item.UserGroupName,
  }))

  const organizationOptions = organizations.map((item) => ({
    value: String(item.OrganizationID),
    label: item.OrganizationName,
  }))

  const handleFinish = async (values: UserFormValues) => {
    setSaving(true)
    try {
      const group = userGroups.find((g) => String(g.UserGroupId) === values.UserGroupId)
      const org = organizations.find((o) => String(o.OrganizationID) === values.OrganizationID)

      await saveUser({
        UserId: user?.UserId ?? 0,
        UserName: values.UserName.trim(),
        FullName: values.FullName?.trim() ?? '',
        Password: values.Password || '',
        CPassword: values.Password || '',
        UserGroupId: values.UserGroupId ? Number(values.UserGroupId) : 0,
        UserGroupCode: group?.UserGroupCode ?? '',
        UserGroupName: group?.UserGroupName ?? '',
        OrganizationID: org?.OrganizationID ?? 0,
        OrganizationName: org?.OrganizationName ?? '',
        Theme: values.Theme || 'Facebook',
      })
      message.success(`User ${user ? 'updated' : 'created'}: ${values.UserName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <Form.Item
            name="UserName"
            rules={[
              { required: true, message: 'Required Field' },
              { type: 'name', message: 'Enter a username' },
            ]}
          >
            <AppInput label="User Name" />
          </Form.Item>

          <Form.Item name="FullName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Full Name" placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="Password"
            rules={user ? [] : [{ required: true, message: 'Required Field' }, { min: 8, message: 'Password must be at least 8 characters long' }]}
          >
            <AppInput label="Password" type="password" placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="ConfirmPassword"
            dependencies={['Password']}
            rules={[
              { required: !user, message: 'Required Field' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (user && !value) return Promise.resolve()
                  if (!value || getFieldValue('Password') === value) return Promise.resolve()
                  return Promise.reject(new Error('Password do not match'))
                },
              }),
            ]}
          >
            <AppInput label="Confirm Password" type="password" placeholder="Re-enter password" />
          </Form.Item>

          <Form.Item name="UserGroupId" rules={[{ required: true, message: 'User group is required' }]}>
            <AppSelect
              label="Users Group"
              placeholder="Select user group"
              options={userGroupOptions}
              loading={loadingOptions}
              allowClear
            />
          </Form.Item>

          <Form.Item name="OrganizationID" rules={[{ required: true, message: 'Organization is required' }]}>
            <AppSelect
              label="Organization Group"
              placeholder="Select organization"
              options={organizationOptions}
              loading={loadingOptions}
              allowClear
            />
          </Form.Item>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="ghost" className="!text-slate-600 hover:!text-slate-900" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default UserForm