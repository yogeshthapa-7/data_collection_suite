import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { AppInput, AppSelect, Button, AppNepaliDatePicker, AppDocumentUpload } from '@data-collection-suite/ui'
import type { EmployeeItem, OrgOfficeItem, DepartmentItem, MainBranchItem, BranchItem } from '@/features/pages/employee/types/employee'
import {
    getOrganizationOfficeSelectList,
    getDepartmentSelectList,
    getMainBranchSelectList,
    getBranchSelectList,
    uploadEmployeePhoto,
    saveEmployee,
    buildEmployeeSavePayload,
 } from '@/features/pages/employee/services/employee.service'

const GENDER_OPTIONS = [
    {value: 1, label: "Male"},
    {value: 2, label: "Female"},
    {value: 3, label: "Other"},
]

const EMP_STATUS_OPTIONS = [
    {value: 1, label: "Active"},
    {value: 2, label: "Suspend"},
    {value: 3, label: "Pending"},
]

interface EmployeeFormValues {
  EmployeeInfoID: number
  Fullname: string
  Address: string
  Phone: string
  Email: string
  Gender: number
  DOB?: string
  EmpStatus: number
  OrganizationOfficeID: string
  DepartmentID?: string
  MainBranchID?: string
  BranchID?: string
  Username: string
  Password: string
  ConfirmPassword: string
  Photo?: string
}

const EmployeeForm = ({
  employee = null,
  onCancel,
  onSuccess,
}: {
  employee?: EmployeeItem | null
  onCancel: () => void
  onSuccess: () => void
}) => {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

const [genderOptions] = useState(GENDER_OPTIONS)
const [statusOptions] = useState(EMP_STATUS_OPTIONS)
const [orgOffices, setOrgOffices] = useState<OrgOfficeItem[]>([])
const [departments, setDepartments] = useState<DepartmentItem[]>([])
const [mainBranches, setMainBranches] = useState<MainBranchItem[]>([])
const [branches, setBranches] = useState<BranchItem[]>([])
const [loadingOptions, setLoadingOptions] = useState(false)
const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null)
const [selectedMainBranchId, setSelectedMainBranchId] = useState<number | null>(null)

useEffect(() => {
  let isMounted = true
  const load = async () => {
    setLoadingOptions(true)
    const [org, dept, mb, br] = await Promise.all([
      getOrganizationOfficeSelectList(),
      getDepartmentSelectList(),
      getMainBranchSelectList(),
      getBranchSelectList(),
    ])
    if (!isMounted) return
    setOrgOffices(org)
    setDepartments(dept)
    setMainBranches(mb)
    setBranches(br)
    setLoadingOptions(false)
  }
  load()
  return () => { isMounted = false }
}, [])

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        EmployeeInfoID: employee.EmployeeInfoID,
        Fullname: employee.Fullname,
        Address: employee.Address,
        Phone: employee.Phone,
        Email: employee.Email,
        Gender: employee.Gender,
        DOB: employee.DOB,
        EmpStatus: employee.EmpStatus,
        OrganizationOfficeID: employee.OrganizationOfficeID ? String(employee.OrganizationOfficeID) : undefined,
        DepartmentID: employee.DepartmentID ? String(employee.DepartmentID) : undefined,
        MainBranchID: employee.MainBranchID ? String(employee.MainBranchID) : undefined,
        BranchID: employee.BranchID ? String(employee.BranchID) : undefined,
        Username: '',
        Password: '',
        ConfirmPassword: '',
      })
      setSelectedDepartmentId(employee.DepartmentID ? Number(employee.DepartmentID) : null)
      setSelectedMainBranchId(employee.MainBranchID ? Number(employee.MainBranchID) : null)
    } else {
      form.resetFields()
      setSelectedDepartmentId(null)
      setSelectedMainBranchId(null)
    }
  }, [employee, form])

    const handleFinish = async (values: EmployeeFormValues) => {
    setSaving(true)
    try {
      const dept = departments.find((d) => String(d.DepartmentInfoID) === String(values.DepartmentID))
      const mainBranch = mainBranches.find((mb) => String(mb.MainBranchID) === String(values.MainBranchID))
      const branch = branches.find((b) => String(b.BranchID) === String(values.BranchID))

      await saveEmployee(
        buildEmployeeSavePayload({
          ...values,
          EmployeeInfoID: employee?.EmployeeInfoID ?? 0,
          DepartmentName: dept?.DepartmentName ?? '',
          MainBranchName: mainBranch?.MainBranchName ?? '',
          BranchName: branch?.BranchName ?? '',
        })
      )
      message.success(`Employee ${employee ? 'updated' : 'created'}: ${values.Fullname}`)
      onSuccess()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Failed to save employee')
    } finally {
      setSaving(false)
    }
  }

  const officeOptions = orgOffices.map((item) => ({
    value: String(item.OrganizationOfficeID),
    label: item.OrganizationOfficeName,
  }))

  const departmentOptions = departments.map((item) => ({
    value: String(item.DepartmentInfoID),
    label: item.DepartmentName,
  }))

  const mainBranchOptions = mainBranches
    .filter((item) => !selectedDepartmentId || Number(item.DepartmentID) === selectedDepartmentId)
    .map((item) => ({ value: String(item.MainBranchID), label: item.MainBranchName }))

  const branchOptions = branches
    .filter((item) => !selectedMainBranchId || Number(item.MainBranchID) === selectedMainBranchId)
    .map((item) => ({ value: String(item.BranchID), label: item.BranchName }))

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartmentId(value ? Number(value) : null)
    setSelectedMainBranchId(null)
    form.setFieldsValue({ MainBranchID: undefined, BranchID: undefined })
  }

  const handleMainBranchChange = (value: string) => {
    setSelectedMainBranchId(value ? Number(value) : null)
    form.setFieldsValue({ BranchID: undefined })
  }

  return (
    <div className="drawer-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
        initialValues={{ Gender: 1, EmpStatus: 1 }}
      >
        <Form.Item name="EmployeeInfoID" hidden>
          <AppInput />
        </Form.Item>

        <fieldset className="mb-5 rounded-lg border border-slate-200 p-4">
          <legend className="ml-2 px-2 text-sm font-semibold text-slate-700">Personal Information</legend>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="Fullname" rules={[{ required: true, message: 'Required Field' }]}>
              <AppInput label="Full Name" placeholder="Enter full name" />
            </Form.Item>

            <Form.Item name="Address" rules={[{ required: true, message: 'Required Field' }]}>
              <AppInput label="Address" placeholder="Enter address" />
            </Form.Item>

            <Form.Item name="Phone" rules={[{ required: true, message: 'Required Field' }]}>
              <AppInput label="Phone" placeholder="98XXXXXXXX" />
            </Form.Item>

            <Form.Item
              name="Email"
              rules={[
                { required: true, message: 'Required Field' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <AppInput label="Email" placeholder="employee@example.com" />
            </Form.Item>

            <Form.Item name="Gender" rules={[{ required: true, message: 'Required Field' }]}>
              <AppSelect label="Gender" options={genderOptions} />
            </Form.Item>

            <Form.Item name="DOB" rules={[{ required: true, message: 'Required Field' }]}>
              <AppNepaliDatePicker label="Date of Birth" returnEnglishDate style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="Photo">
              <AppDocumentUpload label="Photo" accept="image/*" onUpload={uploadEmployeePhoto} />
            </Form.Item>
          </div>
        </fieldset>

        <fieldset className="mb-5 rounded-lg border border-slate-200 p-4">
          <legend className="ml-2 px-2 text-sm font-semibold text-slate-700">Employee Details</legend>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="EmpStatus" rules={[{ required: true, message: 'Required Field' }]}>
              <AppSelect label="Employee Status" options={statusOptions} />
            </Form.Item>
          </div>
        </fieldset>

        <fieldset className="mb-5 rounded-lg border border-slate-200 p-4">
          <legend className="ml-2 px-2 text-sm font-semibold text-slate-700">Organization Details</legend>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="OrganizationOfficeID">
              <AppSelect
                label="Organization Office"
                placeholder="Select office"
                options={officeOptions}
                loading={loadingOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="DepartmentID" rules={[{ required: true, message: 'Required Field' }]}>
              <AppSelect
                label="Department Name"
                placeholder="Select department"
                options={departmentOptions}
                loading={loadingOptions}
                allowClear
                onChange={handleDepartmentChange}
              />
            </Form.Item>

            <Form.Item name="MainBranchID" rules={[{ required: true, message: 'Required Field' }]}>
              <AppSelect
                label="Main Branch"
                placeholder="Select main branch"
                options={mainBranchOptions}
                loading={loadingOptions}
                allowClear
                onChange={handleMainBranchChange}
              />
            </Form.Item>

            <Form.Item name="BranchID" rules={[{ required: true, message: 'Required Field' }]}>
              <AppSelect
                label="Branch"
                placeholder="Select branch"
                options={branchOptions}
                loading={loadingOptions}
                allowClear
              />
            </Form.Item>
          </div>
        </fieldset>

        <fieldset className="mb-5 rounded-lg border border-slate-200 p-4">
          <legend className="ml-2 px-2 text-sm font-semibold text-slate-700">Account Information</legend>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <Form.Item name="Username" rules={[{ required: true, message: 'Required Field' }]}>
              <AppInput label="Username" placeholder="Enter username" />
            </Form.Item>

            <Form.Item
              name="Password"
              rules={[
                { required: true, message: 'Required Field' },
                { min: 8, message: 'Password must be at least 8 characters long' },
              ]}
            >
              <AppInput label="Password" type="password" placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              name="ConfirmPassword"
              dependencies={['Password']}
              rules={[
                { required: true, message: 'Required Field' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('Password') === value) return Promise.resolve()
                    return Promise.reject(new Error('Password do not match'))
                  },
                }),
              ]}
            >
              <AppInput label="Confirm Password" type="password" placeholder="Re-enter password" />
            </Form.Item>
          </div>
        </fieldset>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="ghost" className="!text-slate-600 hover:!text-slate-900" onClick={() => form.resetFields()}>
            Reset
          </Button>
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

export default EmployeeForm