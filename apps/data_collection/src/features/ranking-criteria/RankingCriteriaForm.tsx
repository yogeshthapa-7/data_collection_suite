import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button } from '@data-collection-suite/ui'
import { saveRankingCriteria } from '@/features/ranking-criteria/services/ranking-criteria.service'
import type { RankingCriteria, RankingCriteriaSavePayload } from '@/features/ranking-criteria/types/ranking-criteria'

interface Props {
  editingCriteria: RankingCriteria | null
  categoryId: number
  onCancel: () => void
  onSuccess: () => void
}

const RankingCriteriaForm = ({ editingCriteria, categoryId, onCancel, onSuccess }: Props) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingCriteria) {
      form.setFieldsValue({ CriteriaName: editingCriteria.CriteriaName })
    } else {
      form.resetFields()
    }
  }, [editingCriteria, form])

  const handleSubmit = async (values: { CriteriaName: string }) => {
    setSaving(true)
    try {
      const payload: RankingCriteriaSavePayload = {
        RankingCriteriaID: editingCriteria?.RankingCriteriaID ?? 0,
        CategoryID: categoryId,
        CriteriaName: values.CriteriaName,
      }
      await saveRankingCriteria(payload)
      message.success('Ranking criteria saved')
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
        <Form.Item name="CriteriaName" label="Criteria Name" rules={[{ required: true, message: 'Required Field' }]}>
          <AppInput placeholder="Enter criteria name" />
        </Form.Item>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>Save</Button>
        </div>
      </Form>
    </div>
  )
}

export default RankingCriteriaForm