import { useEffect, useState } from 'react'
import { Form, message, Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { ReloadOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { AppSearchInput, AppTable, Button, AppDrawer, AppSelect } from '@data-collection-suite/ui'
import { fetchTreeView, flattenTree } from '@/features/form-data/services/FormData.service'
import type { TreeNode, CategoryOption, SearchableQuestion, SelectOptionItem, TreeDataItem } from '@/features/form-data/types/form-data'
import { AppMapView } from '@/shared/components/AppMapView'

const tabs = [
  { key: '/departments', label: 'Departments' },
  { key: '/main-branch', label: 'Main-Branch' },
  { key: '/branch', label: 'Branch' },
  { key: '/form-data', label: 'Form Data' },
]

const FormData = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formStructure] = Form.useForm()
  const [dynamicFormStructure] = Form.useForm()

  const [selCategoryGroup, setSelCategoryGroup] = useState<CategoryOption[]>([])
  const [category, setCategory] = useState<CategoryOption[]>([])
  const [fetchedData, setFetchedData] = useState<TreeDataItem[]>([])
  const [columns, setColumns] = useState<Record<string, unknown>[]>([])
  const [items, setItems] = useState<string[]>([])
  const [searchableQuestions, setSearchableQuestions] = useState<SearchableQuestion[]>([])
  const [loading, setLoading] = useState(false)

  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)

  // Load TreeView on page load
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetchTreeView()
        const treeData: TreeNode[] = res.Data || []
        const flat: TreeNode[] = flattenTree(treeData)

        // Group nodes (IsFolder=true) as category groups, others as categories
        const groupNodes = treeData.filter((n) => n.IsFolder)
        const leafNodes: TreeNode[] = []
        const collectLeaves = (nodes: TreeNode[]) =>
          nodes.forEach((n) => {
            if (!n.IsFolder) leafNodes.push(n)
            if (n.children) collectLeaves(n.children)
          })
        collectLeaves(treeData)

        const groupOptions: CategoryOption[] = groupNodes.map((n) => ({
          id: n.id,
          text: n.text,
          code: n.code,
          icon: n.icon,
          IsFolder: n.IsFolder,
          children: n.children,
        }))

        const catOptions: CategoryOption[] = [...flat.filter((n) => !n.IsFolder), ...leafNodes]
          .map((n) => ({
            id: n.id,
            text: n.text,
            code: n.code,
            icon: n.icon,
            IsFolder: n.IsFolder,
            children: n.children,
          }))

        setSelCategoryGroup(groupOptions)
        setCategory(catOptions)

        formStructure.setFieldsValue({
          categoryGroup: groupOptions[0]?.id ?? undefined,
        })
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load tree'
        message.error(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const valueSelected = (value: string) => {
    formStructure.setFieldsValue({ categoryGroup: value, category: undefined })
    const selected = selCategoryGroup.find((g) => g.id === value)
    if (selected?.children) {
      const childLeaves: CategoryOption[] = selected.children
        .filter((c) => !c.IsFolder)
        .map((c) => ({ id: c.id, text: c.text, code: c.code, icon: c.icon, IsFolder: c.IsFolder }))
      setCategory(childLeaves)
    } else {
      const leafCategories = category.filter((c) => c.code === selected?.code)
      setCategory(leafCategories)
    }
  }

  const handleSearch = () => {
    fetchData()
  }

  const resetForm = () => {
    formStructure.resetFields()
    dynamicFormStructure.resetFields()
    setFetchedData([])
    setColumns([])
    setItems([])
    setSearchableQuestions([])
    setCategory([])
    setSelCategoryGroup([])
  }

  const fetchData = async () => {
    const values = formStructure.getFieldsValue()
    setLoading(true)
    try {
      const res = await fetchTreeView({
        parentGUID: values.parentGUID,
        approveType: Number(values.approveType) || 0,
        formID: Number(values.formID) || 0,
      })

      const treeData: TreeNode[] = res.Data || []
      const flat: TreeNode[] = flattenTree(treeData)
      const rows: TreeDataItem[] = flat as unknown as TreeDataItem[]
      setFetchedData(rows)

      // Accordion sections = top-level group names
      const sectionNames = treeData.map((t) => t.text)
      setItems(sectionNames)

      // Placeholder dynamic questions — customize when API provides metadata
      setSearchableQuestions([])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const tableColumns = [
    ...(columns.length
      ? columns.map((c) => ({
          title: (c.title as string) || (c.header as string),
          dataIndex: c.dataIndex || c.key,
          key: c.key,
          render: c.render,
        }))
      : [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Text', dataIndex: 'text', key: 'text' },
          { title: 'Code', dataIndex: 'code', key: 'code' },
          {
            title: 'Is Folder',
            dataIndex: 'IsFolder',
            key: 'IsFolder',
            render: (v: boolean) => (v ? 'Yes' : 'No'),
          },
        ]),
  ] as any[]

  const getSearchAbleQuestion = (): SearchableQuestion[] => searchableQuestions

  return (
    <div className="p-6">
      <Tabs activeKey={location.pathname} onChange={navigate} items={tabs} className="mb-4" />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Form form={formStructure} layout="vertical" requiredMark={false}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-64">
              <label className="mb-1 block text-sm font-bold text-slate-700">Category Group</label>
              <AppSelect
                placeholder="Select category group"
                options={selCategoryGroup.map((o) => ({ value: o.id, label: o.text }))}
                onChange={(val) => valueSelected(val as string)}
                showSearch
                allowClear
              />
            </div>

            <div className="w-64">
              <label className="mb-1 block text-sm font-bold text-slate-700">Category</label>
              <AppSelect
                placeholder="Select category"
                options={category.map((o) => ({ value: o.id, label: o.text }))}
                onChange={(val) => formStructure.setFieldsValue({ category: val })}
                showSearch
                allowClear
              />
            </div>

            <div className="w-64">
              <label className="mb-1 block text-sm font-bold text-slate-700">Parent GUID</label>
              <Form.Item name="parentGUID" noStyle>
                <AppSearchInput
                  placeholder="Enter Parent GUID"
                  value={formStructure.getFieldValue('parentGUID') ?? ''}
                  onChange={(val) => formStructure.setFieldsValue({ parentGUID: val })}
                  onPressEnter={handleSearch}
                />
              </Form.Item>
            </div>
          </div>
        </Form>

        <div className="mt-4 flex items-end gap-4">
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetForm}>
            Clear
          </Button>
          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            className="ml-auto"
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}
            onClick={() => setMapDrawerOpen(true)}
          >
            View Map
          </Button>
        </div>
      </div>

      {getSearchAbleQuestion().length > 0 && (
        <div className="mb-4 space-y-2">
          {items.map((item, index) => (
            <details key={index} className="border rounded p-3">
              <summary className="cursor-pointer font-medium">{item}</summary>
              <Form form={dynamicFormStructure} layout="horizontal" className="mt-3">
                <div className="row">
                  {getSearchAbleQuestion().map((sq) => (
                    <div className="col-lg-3" key={sq.DbColumnName}>
                      <label className="mb-1 block text-sm font-medium text-slate-700" title={sq.LabelName}>
                        {sq.DbColumnName}
                      </label>
                      {sq.InputType === 'select' || sq.InputType === 'multi-select' ? (
                        <AppSelect
                          placeholder="Select"
                          options={(sq.SelectOptions || []).map((o: SelectOptionItem) => ({
                            value: o.OptionValue,
                            label: o.DispName,
                          }))}
                          onChange={(val) => dynamicFormStructure.setFieldsValue({ [sq.DbColumnName]: val })}
                        />
                      ) : (
                        <AppSearchInput
                          placeholder="Enter value"
                          value={dynamicFormStructure.getFieldValue(sq.DbColumnName) ?? ''}
                          onChange={(val) => dynamicFormStructure.setFieldsValue({ [sq.DbColumnName]: val })}
                          onPressEnter={handleSearch}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Form>
            </details>
          ))}
        </div>
      )}

      <AppTable<TreeDataItem>
        columns={tableColumns}
        dataSource={fetchedData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
      />

      <AppDrawer
        open={mapDrawerOpen}
        onClose={() => setMapDrawerOpen(false)}
        title="Map View"
        width={1000}
      >
        <div style={{ height: '600px' }}>
          <AppMapView
            height="560px"
            markers={fetchedData
              .filter((d) => d.Latitude && d.Longitude)
              .map((d) => ({
                position: [Number(d.Latitude), Number(d.Longitude)] as [number, number],
                label: (d.text as string) || '',
              }))}
          />
        </div>
      </AppDrawer>
    </div>
  )
}

export default FormData
