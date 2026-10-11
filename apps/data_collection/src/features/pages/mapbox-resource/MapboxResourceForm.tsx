import { useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import { LAYER_TYPE_MAP, RESOURCE_TYPE_MAP } from '@/features/pages/mapbox-resource/types/mapbox-resource'

const resourceTypeOptions = Object.entries(RESOURCE_TYPE_MAP).map(([value, label]) => ({
  value: Number(value),
  label,
}))

const layerTypeOptions = Object.entries(LAYER_TYPE_MAP).map(([value, label]) => ({
  value: Number(value),
  label,
}))

interface MapboxResourceFormValues {
  ResourceName: string
  ResourceType?: number
  CategoryCode?: string
  MapboxId?: string
  MapboxName?: string
  LayerType?: number
}

const MapboxResourceForm = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [saving, setSaving] = useState(false)

  const handleFinish = async (values: MapboxResourceFormValues) => {
    setSaving(true)
    try {
      // await saveMapboxResource(values)
      message.success(`Resource created: ${values.ResourceName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save resource')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="ResourceName" rules={[{ required: true, message: 'Resource name is required' }]}>
          <AppInput label="Resource Name" placeholder="Enter resource name" />
        </Form.Item>

        <Form.Item name="ResourceType">
          <AppSelect label="Resource Type" placeholder="Select resource type" options={resourceTypeOptions} />
        </Form.Item>

        <Form.Item name="CategoryCode">
          <AppInput label="Category Code" placeholder="Enter category code" />
        </Form.Item>

        <Form.Item name="MapboxId">
          <AppInput label="Mapbox ID" placeholder="mapbox://..." />
        </Form.Item>

        <Form.Item name="MapboxName">
          <AppInput label="Mapbox Name" placeholder="Enter mapbox name" />
        </Form.Item>

        <Form.Item name="LayerType">
          <AppSelect label="Layer Type" placeholder="Select layer type" options={layerTypeOptions} />
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

export default MapboxResourceForm