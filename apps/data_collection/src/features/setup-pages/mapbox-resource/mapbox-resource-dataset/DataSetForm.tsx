import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppTextarea, Button } from '@data-collection-suite/ui'
import { saveDataSet } from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/services/dataset.service'
import type { DataSetItem, DataSetFormValues, DataSetSavePayload } from '@/features/setup-pages/mapbox-resource/mapbox-resource-dataset/types/dataset'

const DataSetForm = ({
  dataSet = null,
  onCancel,
  onSuccess,
}: {
  dataSet?: DataSetItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

 useEffect(() => {
  if (dataSet) {
    form.setFieldsValue({
      id: dataSet.id,
      name: dataSet.name,
      description: dataSet.description ?? '',
    })
  } else {
    form.resetFields()
  }
}, [dataSet, form])

const handleFinish = async (values: DataSetFormValues) => {
  setSaving(true)
  try {
    let featureList: unknown[] = []
    try {
      const parsed = JSON.parse(values.FeatureJson)
      featureList = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      message.error('Feature must be valid JSON')
      return
    }
    await saveDataSet({
      id: dataSet?.id,
      name: values.name.trim(),
      description: values.description?.trim() ?? '',
      featureList,
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
        <Form.Item name="Name" rules={[{ required: true, message: 'Required Field' }]}>
          <AppInput label="Name" placeholder="Enter name" />
        </Form.Item>

        <Form.Item name="Description" rules={[{ required: true, message: 'Required Field' }]}>
          <AppInput label="Description" placeholder="Enter description" />
        </Form.Item>

        <Form.Item name="FeatureJson" rules={[{ required: true, message: 'Required Field' }]}>
          <AppTextarea
            label="Feature (JSON format)"
            placeholder='{ "type": "Feature", ... }'
            rows={8}
            className="font-mono text-sm"
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

export default DataSetForm