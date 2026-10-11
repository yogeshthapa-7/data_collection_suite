import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'

interface UserFormValues {
  UserName: string
  UserGroupId?: number
  Theme?: string
}

const UserForm = ({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: UserFormValues) => {
    setSaving(true)
    try {
      // await saveUser(values)
      message.success(`User created: ${values.UserName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item
          name="UserName"
          rules={[
            { required: true, message: 'User name is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <AppInput label="User Name" placeholder="user@example.com" />
        </Form.Item>

        <Form.Item name="UserGroupId" rules={[{ required: true, message: 'User group is required' }]}>
          <AppSelect
            label="User Group"
            placeholder="Select user group"
            options={[] /* [{ value: 3, label: 'Employee' }, ...] */}
          />
        </Form.Item>

        <Form.Item name="Theme">
          <AppInput label="Theme" placeholder="e.g. Facebook" />
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="ghost" className="!text-slate-600 hover:!text-slate-900" onClick={onCancel}>
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

export default UserForm