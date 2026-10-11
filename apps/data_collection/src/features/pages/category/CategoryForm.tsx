import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, AppTextarea, Button } from '@data-collection-suite/ui'

interface CategoryFormValues {
  CategoryName: string
  CategoryGroupID?: number
  CategoryCode?: string
  DbTableName?: string
  Description?: string
  OrderKey?: number
}

const CategoryForm = ({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: CategoryFormValues) => {
    setSaving(true)
    try {
      // await saveCategory(values)
      message.success(`Category created: ${values.CategoryName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="CategoryName" rules={[{ required: true, message: 'Category name is required' }]}>
          <AppInput label="Category Name" placeholder="Enter category name" />
        </Form.Item>

        <Form.Item name="CategoryGroupID" rules={[{ required: true, message: 'Category group is required' }]}>
          <AppSelect
            label="Category Group"
            placeholder="Select category group"
            options={[] /* from getCategoryGroupSelectList() */}
          />
        </Form.Item>

        <Form.Item name="CategoryCode">
          <AppInput label="Category Code" placeholder="Enter category code" />
        </Form.Item>

        <Form.Item name="DbTableName">
          <AppInput label="DB Table Name" placeholder="Enter DB table name" />
        </Form.Item>

        <Form.Item name="Description">
          <AppTextarea label="Description" placeholder="Enter description" />
        </Form.Item>

        <Form.Item name="OrderKey">
          <AppInput label="Order" type="number" placeholder="0" />
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

export default CategoryForm