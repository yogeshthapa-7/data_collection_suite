import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button, AppSelect } from '@data-collection-suite/ui'
import type { DepartmentItem, DepartmentSelectItem } from './types/department'
import { getDepartmentSelectList, saveDepartment, buildDepartmentSavePayload } from './services/department.service'

interface DepartmentFormValues {
  DepartmentID?: number
  DepartmentName: string
  DepartmentCode?: string
  ParentDepartmentID?: string
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
  const [departments, setDepartments] = useState<DepartmentSelectItem[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  useEffect(() => {
  let isMounted = true
  const load = async () => {
    setLoadingOptions(true)
    const list = await getDepartmentSelectList()
    if (!isMounted) return
    setDepartments(list)
    setLoadingOptions(false)
  }
  load()
  return () => { isMounted = false }
}, [])

  useEffect(() => {
    if(department) {
      form.setFieldsValue({
        DepartmentID: department.DepartmentID,
        DepartmentName: department.DepartmentName,
        DepartmentCode: department.DepartmentCode,
        ParentDepartmentID: department.ParentDepartmentID ? String(department.ParentDepartmentID) : undefined,
        ParentDepartmentName: department.ParentDepartmentName
      })
    }else{
      form.resetFields()
    }
  }, [department, form])

  const handleFinish = async (values: DepartmentFormValues) => {
    setSaving(true)
    try {
      const parent = departments.find((d) => String(d.DepartmentID) === String(values.ParentDepartmentID))

await saveDepartment(
  buildDepartmentSavePayload({
    DepartmentID: department?.DepartmentID ?? 0,
    DepartmentName: values.DepartmentName,
    DepartmentCode: values.DepartmentCode,
    ParentDepartmentID: values.ParentDepartmentID,
    ParentDepartmentName: parent?.DepartmentName ?? '',
  })
)
message.success(`Department ${department ? 'updated' : 'created'}: ${values.DepartmentName}`)
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

        <Form.Item name="ParentDepartmentID">
  <AppSelect
    label="Parent Department"
    placeholder="None (root department)"
    options={[
      { value: '', label: 'None (root department)' },
      ...departments.map((d) => ({ value: String(d.DepartmentID), label: d.DepartmentName })),
    ]}
    loading={loadingOptions}
    allowClear
  />
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
