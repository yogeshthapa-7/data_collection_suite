import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import type { OrganizationItem, OrganizationSelectItem } from '@/features/pages/organization/types/organization'
import { getOrganizationSelectList } from '@/features/pages/organization/services/organization.service'

interface OrganizationFormValues {
  Title: string
  ParentOrganizationID?: string
}

const OrganizationForm = ({
  organization = null,
  onCancel,
  onSuccess,
}: {
  organization?: OrganizationItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [organizations, setOrganizations] = useState<OrganizationSelectItem[]>([])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoadingOptions(true)
      const list = await getOrganizationSelectList()
      if (!isMounted) return
      setOrganizations(list)
      setLoadingOptions(false)
    }
    load()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        Title: organization.Title,
        ParentOrganizationID: organization.ParentOrganizationID ? String(organization.ParentOrganizationID) : undefined,
      })
    } else {
      form.resetFields()
    }
  }, [organization, form])

  const parentOptions = [
    { value: '', label: 'None (root organization)' },
    ...organizations.map((item) => ({
      value: String(item.OrganizationID),
      label: item.Title,
    })),
  ]

  const handleFinish = async (values: OrganizationFormValues) => {
    setSaving(true)
    try {
      // await saveOrganization({
      //   OrganizationID: organization?.OrganizationID ?? 0,
      //   Title: values.Title,
      //   ParentOrganizationID: values.ParentOrganizationID ? Number(values.ParentOrganizationID) : 0,
      // })
      message.success(`Organization ${organization ? 'updated' : 'created'}: ${values.Title}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save organization')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="Title" rules={[{ required: true, message: 'Organization name is required' }]}>
          <AppInput label="Organization Name" placeholder="Enter organization name" />
        </Form.Item>

        <Form.Item name="ParentOrganizationID">
          <AppSelect
            label="Parent Organization"
            placeholder="None (root organization)"
            options={parentOptions}
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

export default OrganizationForm