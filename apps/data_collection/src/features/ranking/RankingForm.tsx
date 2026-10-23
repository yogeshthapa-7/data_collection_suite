import { Form, message } from 'antd'
import { AppInput, AppSelect, Button } from '@data-collection-suite/ui'
import { saveRankingCondition } from '@/features/ranking/services/ranking.service'
import type { RankingCondition } from '@/features/ranking/types/ranking'
import { useEffect, useState } from 'react'

interface Props {
  editingCondition: RankingCondition | null
  onCancel: () => void
  onSuccess: () => void
}

const OPERATOR_OPTIONS = [
  { value: '=', label: 'Equal To' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater Than or Equal To' },
  { value: '<=', label: 'Less Than or Equal To' },
  { value: '<>', label: 'Not Equal To' },
  { value: 'in', label: 'In' },
]

const RankingForm = ({ editingCondition, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingCondition) {
      form.setFieldsValue({
        Group: editingCondition.Group,
        Expression: editingCondition.Expression,
        Operator: editingCondition.Operator,
        MatchMarks: editingCondition.MatchMarks,
        NotMatchMarks: editingCondition.NotMatchMarks,
        OrderKey: editingCondition.OrderKey,
      })
    } else {
      form.resetFields()
    }
  }, [editingCondition, form])

  const handleSubmit = async (values: any) => {
    setSaving(true)
    try {
      await saveRankingCondition({
        RankingConditionID: editingCondition?.RankingConditionID ?? 0,
        CategoryID: editingCondition?.CategoryID ?? 0,
        Group: values.Group,
        Expression: values.Expression,
        Operator: values.Operator,
        MatchMarks: values.MatchMarks,
        NotMatchMarks: values.NotMatchMarks,
        OrderKey: values.OrderKey,
      })
      message.success('Ranking condition saved')
      onSuccess()
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item name="Group" label="Group" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput placeholder="Enter group name" />
          </Form.Item>
          <Form.Item name="Expression" label="Expression" rules={[{ required: true, message: 'Required Field' }]}>
            <AppInput placeholder="Enter expression" />
          </Form.Item>
          <Form.Item name="Operator" label="Operator" rules={[{ required: true, message: 'Required Field' }]}>
            <AppSelect placeholder="Select operator" options={OPERATOR_OPTIONS} />
          </Form.Item>
          <Form.Item name="MatchMarks" label="Match Marks">
            <AppInput placeholder="Enter match marks" />
          </Form.Item>
          <Form.Item name="NotMatchMarks" label="Not Match Marks">
            <AppInput placeholder="Enter not match marks" />
          </Form.Item>
          <Form.Item name="OrderKey" label="Order Key">
            <AppInput type="number" placeholder="0" />
          </Form.Item>
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="ghost" className="!text-slate-600 hover:!text-slate-900" onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>Save</Button>
        </div>
      </Form>
    </div>
  )
}

export default RankingForm