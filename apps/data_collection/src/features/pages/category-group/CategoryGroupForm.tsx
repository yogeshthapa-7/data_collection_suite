import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import type { CategoryGroupItem } from '@/features/pages/category-group/types/category-type'

// Stored values are the FontAwesome class strings — must match the iconMap keys
// used to render the cards (category_group.tsx:14)
const ICON_OPTIONS = [
  { value: 'fa fa-home', label: 'Home' },
  { value: 'fa fa-road', label: 'Road' },
  { value: 'fa fa-address-book', label: 'Address Book' },
  { value: 'fa fa-address-book-o', label: 'Address Book (Outline)' },
  { value: 'fa fa-adn', label: 'Adn' },
  { value: 'fa fa-500px', label: '500px' },
  { value: 'fa fa-building', label: 'Building' },
  { value: 'fa fa-shopping-cart', label: 'Shopping Cart' },
]

interface CategoryGroupFormValues {
  CategoryGroupID: number
  GroupName: string
  GroupCode: string
  Icon?: string
}

const CategoryGroupForm = ({
  group = null,
  onCancel,
  onSuccess,
}: {
  group?: CategoryGroupItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        CategoryGroupID: group.CategoryGroupID,
        GroupName: group.GroupName,
        GroupCode: group.GroupCode,
        Icon: group.Icon,
      })
    } else {
      form.resetFields()
    }
  }, [group, form])

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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <Form.Item name="CategoryGroupID" hidden>
          <AppInput />
        </Form.Item>

        <Form.Item name="CategoryGroupName" rules={[{ required: true, message: 'Required Field' }]}>
          <AppInput label="Category Group Name" placeholder="Enter category group name" />
        </Form.Item>

        <Form.Item name="CategoryGroupCode" rules={[{ required: true, message: 'Required Field' }]}>
          <AppInput label="Category Group Code" placeholder="Enter category group code" />
        </Form.Item>

        <Form.Item name="Icon" rules={[{ required: true, message: 'Required Field' }]}>
          <AppSelect label="Icon" placeholder="Select icon" options={ICON_OPTIONS} />
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button
            variant="ghost"
            className="!text-slate-600 hover:!text-slate-900"
            onClick={() => form.resetFields()}
          >
            Reset
          </Button>
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

export default CategoryGroupForm
