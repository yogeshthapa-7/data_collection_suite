import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button } from '@data-collection-suite/ui'
import { saveDataSet } from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/services/dataset.service'
import type { GeoDataSetVM } from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/types/dataset'

interface DataSetFormValues {
  id?: string
  name: string
  description?: string
}

const DataSetForm = ({
  dataSet = null,
  onCancel,
  onSuccess,
}: {
  dataSet?: GeoDataSetVM | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (dataSet) {
      form.setFieldsValue({
        id: dataSet.id ?? '',
        name: dataSet.name ?? '',
        description: dataSet.description ?? '',
      })
    } else {
      form.resetFields()
    }
  }, [dataSet, form])

  const handleFinish = async (values: DataSetFormValues) => {
    setSaving(true)
    try {
      await saveDataSet({
        id: values.id || undefined,
        name: values.name.trim(),
        description: values.description?.trim() ?? '',
      })
      message.success(`Data set ${dataSet ? 'updated' : 'created'}: ${values.name}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save data set')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="id" hidden>
          <AppInput />
        </Form.Item>

        <Form.Item name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <AppInput label="Name" placeholder="Enter name" />
        </Form.Item>

        <Form.Item name="description">
          <AppInput label="Description" placeholder="Enter description" />
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

export default DataSetForm
