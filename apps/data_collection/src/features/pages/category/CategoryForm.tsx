import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import {
  AppInput,
  AppSelect,
  AppNepaliDatePicker,
  AppColorPicker,
  AppRichTextEditor,
  Button,
} from '@data-collection-suite/ui'
import { getCategoryGroupSelectList, saveCategory, buildCategorySavePayload } from '@/features/pages/category/services/category.service'
import type { CategoryGroupSelectItem, CategoryItem } from '@/features/pages/category/types/category'

// Mirrors the legacy app's `fontIcons` list — stored value is the FontAwesome class string
const FONT_ICONS = [
  'fa fa-home',
  'fa fa-carry-out',
  'fa fa-heart',
  'fa fa-tool',
  'fa fa-book',
  'fa fa-phone',
  'fa fa-apartment',
  'fa fa-shopping',
]

interface CategoryFormValues {
  CategoryName: string
  CategoryCode: string
  DbTableName: string
  DisplayName: string
  LocalLabelName: string
  Regex: string
  Icon?: string
  MapIconColor?: string
  OrderKey?: number
  CategoryGroupID?: number
  ExpiryDate?: string
  PublicFormTitle?: string
  PublicFormSubTitle?: string
}

const CategoryForm = ({
  category = null,
  onCancel,
  onSuccess,
}: {
  category?: CategoryItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [groupOptions, setGroupOptions] = useState<CategoryGroupSelectItem[]>([])

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await getCategoryGroupSelectList()
        setGroupOptions(response || [])
      } catch {
        // category group list is optional for the form
      }
    }
    loadGroups()
  }, [])

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        CategoryID: category.CategoryID,
        CategoryName: category.CategoryName,
        CategoryCode: category.CategoryCode,
        DbTableName: category.DbTableName,
        DisplayName: category.DisplayName,
        LocalLabelName: category.LocalLabelName,
        Regex: category.Regex,
        Icon: category.Icon,
        MapIconColor: category.MapIconColor,
        OrderKey: category.OrderKey,
        CategoryGroupID: category.CategoryGroupID,
        ExpiryDate: category.ExpiryDate,
        PublicFormTitle: category.PublicFormTitle,
        PublicFormSubTitle: category.PublicFormSubTitle,
      })
    } else {
      form.resetFields()
    }
  }, [category, form])

const handleSubmit = async (values: CategoryFormValues) => {
  setSaving(true)
  try {
    await saveCategory(buildCategorySavePayload(values))
    message.success(`Category created: ${values.CategoryName}`)
    onSuccess()
  } catch (error) {
    message.error(error instanceof Error ? error.message : 'Failed to save category')
  } finally {
    setSaving(false)
  }
}

  const handleReset = () => form.resetFields()

  return (
    <div className="drawer-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        initialValues={{ MapIconColor: '#1677ff' }}
      >
        <Form.Item name="CategoryID" hidden>
          <AppInput />
        </Form.Item>

        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item name="CategoryName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Category Name" placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="CategoryCode" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Category Code" placeholder="Enter category code" />
          </Form.Item>

          <Form.Item name="DbTableName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="DB Column Name" placeholder="Enter DB column name" />
          </Form.Item>

          <Form.Item name="DisplayName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Display Name" placeholder="Enter display name" />
          </Form.Item>

          <Form.Item name="LocalLabelName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Local Label Name" placeholder="Enter local label name" />
          </Form.Item>

          <Form.Item name="Regex">
            <AppInput label="Regex" placeholder="Enter regex pattern" />
          </Form.Item>

          <Form.Item name="Icon">
            <AppSelect
              label="Icon"
              placeholder="Select icon"
              options={FONT_ICONS.map((icon) => ({ value: icon, label: icon.replace('fa fa-', '') }))}
            />
          </Form.Item>

          <Form.Item name="MapIconColor">
            <AppColorPicker label="Map Icon Color" />
          </Form.Item>

          <Form.Item name="OrderKey">
            <AppInput label="Order Key" type="number" placeholder="0" />
          </Form.Item>

          <Form.Item name="CategoryGroupID" rules={[{ required: true, message: 'Required Field' }]}>
            <AppSelect
              label="Category Group"
              placeholder="Select category group"
              options={groupOptions.map((group) => ({
                value: group.CategoryGroupID,
                label: group.GroupName,
                style: {zIndex: 10001}
              }))}
            />
          </Form.Item>

          <Form.Item name="ExpiryDate">
            <AppNepaliDatePicker label="Form Expiry Date" returnEnglishDate style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item name="PublicFormTitle">
          <AppRichTextEditor label="Title" placeholder="Enter public form title" />
        </Form.Item>

        <Form.Item name="PublicFormSubTitle">
          <AppRichTextEditor label="Sub Title" placeholder="Enter public form sub title" />
        </Form.Item>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="ghost" className="!text-slate-600 hover:!text-slate-900" onClick={handleReset}>
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

export default CategoryForm