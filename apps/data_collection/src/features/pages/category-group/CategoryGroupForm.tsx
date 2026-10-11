import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, AppTextarea, Button } from '@data-collection-suite/ui'

const ICON_OPTIONS = [
  { value: 'fa fa-home', label: 'Home' },
  { value: 'fa fa-carry-out', label: 'Carry Out' },
  { value: 'fa fa-heart', label: 'Heart' },
  { value: 'fa fa-tool', label: 'Tool' },
  { value: 'fa fa-book', label: 'Book' },
  { value: 'fa fa-phone', label: 'Phone' },
  { value: 'fa fa-apartment', label: 'Apartment' },
  { value: 'fa fa-shopping', label: 'Shopping' },
]

interface CategoryGroupFormValues {
  GroupName: string
  GroupCode?: string
  Icon?: string
  Description?: string
}

const CategoryGroupForm = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: CategoryGroupFormValues) => {
    setSaving(true)
    try {
      // await saveCategoryGroup(values)
      message.success(`Group created: ${values.GroupName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save group')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="GroupName" rules={[{ required: true, message: 'Group name is required' }]}>
          <AppInput label="Group Name" placeholder="Enter group name" />
        </Form.Item>

        <Form.Item name="GroupCode">
          <AppInput label="Group Code" placeholder="Enter group code" />
        </Form.Item>

        <Form.Item name="Icon">
          <AppSelect label="Icon" placeholder="Select icon" options={ICON_OPTIONS} />
        </Form.Item>

        <Form.Item name="Description">
          <AppTextarea label="Description" placeholder="Enter description" />
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

export default CategoryGroupForm