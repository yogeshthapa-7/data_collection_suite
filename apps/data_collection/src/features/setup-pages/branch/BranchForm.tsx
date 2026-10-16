import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { AppInput, Button, AppSelect } from '@data-collection-suite/ui'
import type { BranchItem, MainBranchSelectItem, DepartmentSelectItem } from './types/branch'
import {
  getMainBranchSelectListByDept,
  getDepartmentSelectList,
  saveBranch,
  buildBranchSavePayload,
} from './services/branch.service'

interface BranchFormValues {
  BranchID?: number
  BranchName: string
  BranchCode?: string
  DepartmentID?: string
  MainBranchID?: string
}

const BranchForm = ({
  branch = null,
  onCancel,
  onSuccess,
}: {
  branch?: BranchItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [departments, setDepartments] = useState<DepartmentSelectItem[]>([])
  const [mainBranches, setMainBranches] = useState<MainBranchSelectItem[]>([])
  const [loadingDept, setLoadingDept] = useState(false)
  const [loadingMainBranch, setLoadingMainBranch] = useState(false)

  // Load department list on mount
  useEffect(() => {
    let isMounted = true
    const loadDepts = async () => {
      setLoadingDept(true)
      try {
        const list = await getDepartmentSelectList()
        if (isMounted) setDepartments(list)
      } finally {
        if (isMounted) setLoadingDept(false)
      }
    }
    loadDepts()
    return () => {
      isMounted = false
    }
  }, [])

  // Handle department selection change -> fetch dependent main branches
  const handleDeptChange = async (deptId?: string) => {
    form.setFieldsValue({ MainBranchID: undefined })
    if (!deptId) {
      setMainBranches([])
      return
    }

    setLoadingMainBranch(true)
    try {
      const list = await getMainBranchSelectListByDept(Number(deptId))
      setMainBranches(list)
    } finally {
      setLoadingMainBranch(false)
    }
  }

  // When branch prop changes (edit mode), initialize form values and load main branches for its department
  useEffect(() => {
    if (branch) {
      form.setFieldsValue({
        BranchID: branch.BranchID,
        BranchName: branch.BranchName,
        BranchCode: branch.BranchCode,
        DepartmentID: branch.DepartmentID ? String(branch.DepartmentID) : undefined,
        MainBranchID: branch.MainBranchID ? String(branch.MainBranchID) : undefined,
      })

      if (branch.DepartmentID) {
        setLoadingMainBranch(true)
        getMainBranchSelectListByDept(Number(branch.DepartmentID))
          .then((list) => setMainBranches(list))
          .finally(() => setLoadingMainBranch(false))
      } else {
        setMainBranches([])
      }
    } else {
      form.resetFields()
      setMainBranches([])
    }
  }, [branch, form])

  const handleFinish = async (values: BranchFormValues) => {
    setSaving(true)
    try {
      const mb = mainBranches.find((m) => String(m.MainBranchID) === String(values.MainBranchID))
      const dept = departments.find((d) => String(d.DepartmentID) === String(values.DepartmentID))

      await saveBranch(
        buildBranchSavePayload({
          BranchID: branch?.BranchID ?? 0,
          BranchName: values.BranchName,
          BranchCode: values.BranchCode,
          MainBranchID: values.MainBranchID,
          MainBranchName: mb?.MainBranchName ?? '',
          DepartmentID: values.DepartmentID,
          DepartmentName: dept?.DepartmentName ?? '',
        })
      )
      message.success(`Branch ${branch ? 'updated' : 'created'}: ${values.BranchName}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save branch')
    } finally {
      setSaving(false)
    }
  }

  const selectedDeptId = Form.useWatch('DepartmentID', form)

  return (
    <div className="drawer-form">
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item name="BranchID" hidden>
          <AppInput />
        </Form.Item>

        <Form.Item
          name="BranchName"
          rules={[{ required: true, message: 'Branch name is required' }]}
        >
          <AppInput label="Branch Name" placeholder="Enter branch name" />
        </Form.Item>

        <Form.Item name="BranchCode">
          <AppInput label="Branch Code" placeholder="Enter branch code" />
        </Form.Item>

        {/* Department Select comes BEFORE Main Branch */}
        <Form.Item name="DepartmentID">
          <AppSelect
            label="Department"
            placeholder="Select department"
            loading={loadingDept}
            allowClear
            options={[
              { value: '', label: 'None' },
              ...departments.map((d) => ({
                value: String(d.DepartmentID),
                label: d.DepartmentName,
              })),
            ]}
            onChange={handleDeptChange}
          />
        </Form.Item>

        {/* Main Branch Select depends on Department */}
        <Form.Item name="MainBranchID">
          <AppSelect
            label="Main Branch"
            placeholder={selectedDeptId ? 'Select main branch' : 'Select department first'}
            loading={loadingMainBranch}
            disabled={!selectedDeptId}
            allowClear
            options={[
              { value: '', label: 'None' },
              ...mainBranches.map((m) => ({
                value: String(m.MainBranchID),
                label: m.MainBranchName,
              })),
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

export default BranchForm