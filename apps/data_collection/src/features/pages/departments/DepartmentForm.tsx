import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button } from '@data-collection-suite/ui'

interface DepartmentFormValues {
  DepartmentName: string
  DepartmentCode?: string
}

const DepartmentForm = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: DepartmentFormValues) => {
    setSaving(true)
    try {
      // await saveDepartment(values)
      message.success(`Department created: ${values.DepartmentName}`)
      onSuccess()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save department'
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item
          name="DepartmentName"
          rules={[{ required: true, message: 'Department name is required' }]}
        >
          <AppInput label="Department Name" placeholder="Enter department name" />
        </Form.Item>

        <Form.Item name="DepartmentCode">
          <AppInput label="Department Code" placeholder="Enter department code" />
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

export default DepartmentForm
