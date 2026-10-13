import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button } from '@data-collection-suite/ui'
import type { DepartmentItem } from './types/department'

interface DepartmentFormValues {
  DepartmentID?: number
  DepartmentName: string
  DepartmentCode?: string
  ParentDepartmentName?: string
}

const DepartmentForm = ({
  department = null,
  onCancel,
  onSuccess,
}: {
  department?: DepartmentItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if(department) {
      form.setFieldsValue({
        DepartmentID: department.DepartmentID,
        DepartmentName: department.DepartmentName,
        DepartmentCode: department.DepartmentCode,
        // PerentDepartmentID: Department.ParenetDepartmentID,
        ParentDepartmentName: department.ParentDepartmentName
      })
    }else{
      form.resetFields()
    }
  }, [department, form])

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
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="DepartmentID" hidden>
          <AppInput />
        </Form.Item>
        <Form.Item
          name="DepartmentName"
          rules={[{ required: true, message: 'Department name is required' }]}
        >
          <AppInput label="Department Name" placeholder="Enter department name" />
        </Form.Item>

        <Form.Item name="DepartmentCode">
          <AppInput label="Department Code" placeholder="Enter department code" />
        </Form.Item>

        <Form.Item name="ParentDepartmentName" >
          <AppInput label ="Parent Department Name" placeholder ="Enter parent department name" />
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
