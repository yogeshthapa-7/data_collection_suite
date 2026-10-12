import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import {
  LAYER_TYPE_MAP,
  RESOURCE_TYPE_MAP,
} from '@/features/pages/mapbox-resource/types/mapbox-resource'
import type { MapboxResourceItem, MapboxResourceFormValues } from '@/features/pages/mapbox-resource/types/mapbox-resource'
import { saveMapboxResource } from '@/features/pages/mapbox-resource/services/mapbox-resource.service'

const resourceTypeOptions = Object.entries(RESOURCE_TYPE_MAP).map(([value, label]) => ({
  value: Number(value),
  label,
}))

const layerTypeOptions = Object.entries(LAYER_TYPE_MAP).map(([value, label]) => ({
  value: Number(value),
  label,
}))

const MapboxResourceForm = ({
  resource = null,
  onCancel,
  onSuccess,
}: {
  resource?: MapboxResourceItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (resource) {
      form.setFieldsValue({
        MapboxResourceInfoID: resource.MapboxResourceInfoID,
        MapboxName: resource.MapboxName ?? '',
        MapboxId: resource.MapboxId ?? '',
        ResourceName: resource.ResourceName,
        CategoryCode: resource.CategoryCode ?? '',
        ResourceType: resource.ResourceType ?? undefined,
        LayerType: resource.LayerType ?? undefined,
        UniqueFeatureKey: resource.UniqueFeatureKey ?? '',
      })
    } else {
      form.resetFields()
    }
  }, [resource, form])

  const handleFinish = async (values: MapboxResourceFormValues) => {
    setSaving(true)
    try {
      await saveMapboxResource({
        MapboxResourceInfoID: resource?.MapboxResourceInfoID ?? 0,
        MapboxName: values.MapboxName.trim(),
        MapboxId: values.MapboxId.trim(),
        ResourceName: values.ResourceName.trim(),
        CategoryCode: values.CategoryCode?.trim() ?? '',
        ResourceType: values.ResourceType,
        LayerType: values.LayerType,
        UniqueFeatureKey: values.UniqueFeatureKey.trim(),
      })
      message.success(`Resource ${resource ? 'updated' : 'created'}: ${values.MapboxName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save resource')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <Form.Item name="MapboxName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Mapbox Name" placeholder="Enter mapbox name" />
          </Form.Item>

          <Form.Item name="MapboxId" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Mapbox ID" placeholder="mapbox://..." />
          </Form.Item>

          <Form.Item name="ResourceName" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Resource Name" placeholder="Enter resource name" />
          </Form.Item>

          <Form.Item name="CategoryCode" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Category Code" placeholder="Enter category code" />
          </Form.Item>

          <Form.Item name="ResourceType" rules={[{ required: true, message: 'Required Field' }]}>
            <AppSelect label="Resource Type" placeholder="Select resource type" options={resourceTypeOptions} />
          </Form.Item>

          <Form.Item name="LayerType" rules={[{ required: true, message: 'Required Field' }]}>
            <AppSelect label="Layer Type" placeholder="Select layer type" options={layerTypeOptions} />
          </Form.Item>

          <Form.Item name="UniqueFeatureKey" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput label="Unique Feature Key" placeholder="Enter unique feature key" />
          </Form.Item>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
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

export default MapboxResourceForm