import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button, AppSelect } from '@data-collection-suite/ui'
import type { MainBranchItem, DepartmentSelectItem } from './types/main-branch'
import { getDepartmentSelectList, saveMainBranch, buildMainBranchSavePayload } from './services/main-branch.service'

interface MainBranchFormValues {
  MainBranchID?: number
  MainBranchName: string
  MainBranchCode?: string
  DepartmentID?: string
}

const MainBranchForm = ({
  mainBranch = null,
  onCancel,
  onSuccess,
}: {
  mainBranch?: MainBranchItem | null
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
    if (mainBranch) {
      form.setFieldsValue({
         MainBranchID: mainBranch.MainBranchID,
        MainBranchName: mainBranch.MainBranchName,
        MainBranchCode: mainBranch.MainBranchCode,
        DepartmentID: mainBranch.DepartmentID ? String(mainBranch.DepartmentID) : undefined,
      })
    } else {
      form.resetFields()
    }
  }, [mainBranch, form])

  const handleFinish = async (values: MainBranchFormValues) => {
    setSaving(true)
    try {
      const dept = departments.find((d) => String(d.DepartmentID) === String(values.DepartmentID))

      await saveMainBranch(
        buildMainBranchSavePayload({
          MainBranchID: mainBranch?.MainBranchID ?? 0,
          MainBranchName: values.MainBranchName,
          MainBranchCode: values.MainBranchCode,
          DepartmentID: values.DepartmentID,
          DepartmentName: dept?.DepartmentName ?? '',
        })
      )
      message.success(`Main Branch ${mainBranch ? 'updated' : 'created'}: ${values.MainBranchName}`)
      onSuccess()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save main branch'
      message.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="MainBranchID" hidden>
          <AppInput />
        </Form.Item>
        <Form.Item
          name="MainBranchName"
          rules={[{ required: true, message: 'Main branch name is required' }]}
        >
          <AppInput label="Main Branch Name" placeholder="Enter main branch name" />
        </Form.Item>

        <Form.Item name="MainBranchCode">
          <AppInput label="Main Branch Code" placeholder="Enter main branch code" />
        </Form.Item>

        <Form.Item name="DepartmentID">
          <AppSelect
          label="Department"
            placeholder="Select Department"
            options={[
              { value: '', label: 'None' },
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

export default MainBranchForm