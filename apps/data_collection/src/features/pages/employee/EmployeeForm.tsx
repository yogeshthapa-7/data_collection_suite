import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, AppTextarea, AppDatePicker, Button } from '@data-collection-suite/ui'

interface EmployeeFormValues {
  Fullname: string
  Address: string
  Email: string
  Phone: string
  DOB?: string
  DepartmentID: number
}

const EmployeeForm = ({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: EmployeeFormValues) => {
    setSaving(true)
    try {
      // await saveEmployee(values)
      message.success(`Employee created: ${values.Fullname}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save employee')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="Fullname" rules={[{ required: true, message: 'Full name is required' }]}>
          <AppInput label="Full Name" placeholder="Enter full name" />
        </Form.Item>

        <Form.Item name="Address" rules={[{ required: true, message: 'Address is required' }]}>
          <AppTextarea label="Address" placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          name="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <AppInput label="Email" placeholder="employee@example.com" />
        </Form.Item>

        <Form.Item name="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
          <AppInput label="Phone" placeholder="98XXXXXXXX" />
        </Form.Item>

        <Form.Item name="DOB">
          <AppDatePicker label="Date of Birth" className="w-full" />
        </Form.Item>

        <Form.Item name="DepartmentID" rules={[{ required: true, message: 'Department is required' }]}>
          <AppSelect
            label="Department"
            placeholder="Select department"
            options={[] /* fetchDepartments(1, 100, '').then(r => r.data.map(d => ({ value: d.DepartmentID, label: d.DepartmentName }))) */}
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

export default EmployeeForm