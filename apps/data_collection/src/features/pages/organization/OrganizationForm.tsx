import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'

interface OrganizationFormValues {
  Title: string
  ParentOrganizationID: number
}

const OrganizationForm = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: OrganizationFormValues) => {
    setSaving(true)
    try {
      // await saveOrganization(values)
      message.success(`Organization created: ${values.Title}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save organization')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="Title" rules={[{ required: true, message: 'Organization name is required' }]}>
          <AppInput label="Organization Name" placeholder="Enter organization name" />
        </Form.Item>

        <Form.Item name="ParentOrganizationID">
          <AppSelect
            label="Parent Organization"
            placeholder="None (root organization)"
            options={[
              { value: 0, label: 'None' },
              /* ...fetchOrganizations(1, 100, '').data.map(o => ({ value: o.OrganizationID, label: o.Title })) */
            ]}
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

export default OrganizationForm