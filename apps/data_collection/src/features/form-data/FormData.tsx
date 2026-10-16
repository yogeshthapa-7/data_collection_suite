import { useEffect, useState } from 'react'
import { Form, message } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ReloadOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { AppSearchInput, AppTable, Button, AppDrawer, AppSelect } from '@data-collection-suite/ui'
import { fetchTreeData } from '@/features/form-data/services/FormData.service'
import type { CustomResponse } from '@/features/form-data/services/FormData.service'
import { getCategoryGroupSelectList } from '@/features/setup-pages/category-group/services/category-group.service'
import { getCategorySelectList } from '@/features/setup-pages/category/services/category.service'
import type { CategoryOption } from '@/features/setup-pages/category-group/services/category-group.service'
import type { CategorySelectItem } from '@/features/setup-pages/category/services/category.service'
import type {
  SearchableQuestion,
  SelectOptionItem,
  TreeDataItem,
} from '@/features/form-data/types/form-data'
import { AppMapView, type MapMarker } from '@/shared/components/AppMapView'

const FormData = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [formStructure] = Form.useForm()
  const [dynamicFormStructure] = Form.useForm()
  const [formId] = useState(0)

  const [selCategoryGroup, setSelCategoryGroup] = useState<CategoryOption[]>([])
  const [category, setCategory] = useState<CategoryOption[]>([])
  const [fetchedData, setFetchedData] = useState<TreeDataItem[]>([])
  const [columns, setColumns] = useState<Record<string, unknown>[]>([])
  const [items, setItems] = useState<string[]>([])
  const [searchableQuestions, setSearchableQuestions] = useState<SearchableQuestion[]>([])
  const [loading, setLoading] = useState(false)

  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)

  useEffect(() => {
    const loadSelectLists = async () => {
      const [groupList, catList] = await Promise.all([
        getCategoryGroupSelectList(),
        getCategorySelectList(),
      ])
      setSelCategoryGroup(groupList)
      setCategory(catList)
    }
    loadSelectLists()
  }, [])

  const getSearchAbleQuestion = (): SearchableQuestion[] => searchableQuestions

  const fetchData = async (page?: number) => {
    const values = formStructure.getFieldsValue()
    setLoading(true)
    try {
      const res: CustomResponse<{ data: TreeDataItem[]; columns?: Record<string, unknown>[] }> =
        await fetchTreeData({
          id: Number(values.category || values.categoryGroup),
          usrGrpCode: '',
          page: { row: 20, skip: page ? (page - 1) * 20 : 0 },
          filterData: {
            ParentGUID: values.parentGUID,
            ApproveType: values.approveType,
            FormID: values.categoryGroup,
          },
          dynamicFilterData: dynamicFormStructure.getFieldsValue(),
        })

      const data = res.data
      const rows: TreeDataItem[] = (Array.isArray(data?.data) ? data.data : []) as TreeDataItem[]
      setFetchedData(rows)

      if (data?.columns) {
        setColumns(data.columns as Record<string, unknown>[])
      }

      // Build accordion items and searchable questions from dynamic form metadata
      const sq: SearchableQuestion[] = data?.searchableQuestions || []
      setSearchableQuestions(sq)
      const accItems: string[] = data?.accordionItems || []
      setItems(accItems)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data'
      message.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    formStructure.resetFields()
    dynamicFormStructure.resetFields()
    setFetchedData([])
    setColumns([])
    setItems([])
    setSearchableQuestions([])
  }

  const handleSearch = () => {
    formStructure.validateFields().then(() => fetchData(1))
  }

  const mapMarkers: MapMarker[] = fetchedData.map((d) => ({
    position: [Number(d.Latitude), Number(d.Longitude)] as [number, number],
    label: (d.Name as string) || (d.Title as string) || '',
  }))

  const tableColumns = [
    ...(columns.length
      ? columns.map((c) => ({
          title: c.title || c.header,
          dataIndex: c.dataIndex || c.key,
          key: c.key,
          render: c.render,
        }))
      : [{ title: '', dataIndex: '', key: '' }]),
  ]

  return (
    <div className="p-6">

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Form form={formStructure} layout="vertical" requiredMark={false}>
        <div className="flex flex-wrap items-end gap-4">
          {formId === 0 && (
            <>
              <div className="w-64">
                <label className="mb-1 block text-sm font-bold text-slate-700">Category Group</label>
                <AppSelect
                  placeholder="Select category group"
                  value={formStructure.getFieldValue('categoryGroup') ?? undefined}
                  options={selCategoryGroup.map((o) => ({ value: o.id, label: o.text }))}
                  onChange={(val) => formStructure.setFieldsValue({ categoryGroup: val })}
                  showSearch
                  allowClear
                />
              </div>

              <div className="w-64">
                <label className="mb-1 block text-sm font-bold text-slate-700">Category</label>
                <AppSelect
                  placeholder="Select category"
                  value={formStructure.getFieldValue('category') ?? undefined}
                  options={category.map((o) => ({ value: String(o.CategoryID), label: o.CategoryName }))}
                  onChange={(val) => formStructure.setFieldsValue({ category: val })}
                  showSearch
                  allowClear
                />
              </div>

              <div className="w-64">
                <label className="mb-1 block text-sm font-bold text-slate-700">Parent GUID</label>
                <AppSearchInput
                  placeholder="Enter Parent GUID"
                  value={formStructure.getFieldValue('parentGUID') ?? ''}
                  onChange={(val) => formStructure.setFieldsValue({ parentGUID: val })}
                  onPressEnter={handleSearch}
                />
              </div>
            </>
          )}
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
        </Form>
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
                          onChange={(val) =>
                            dynamicFormStructure.setFieldsValue({ [sq.DbColumnName]: val })
                          }
                        />
                      ) : (
                        <AppSearchInput
                          placeholder="Enter value"
                          value={dynamicFormStructure.getFieldValue(sq.DbColumnName) ?? ''}
                          onChange={(val) =>
                            dynamicFormStructure.setFieldsValue({ [sq.DbColumnName]: val })
                          }
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
        destroyOnClose
      >
        <div style={{ height: '600px' }}>
          <AppMapView height="560px" markers={mapMarkers} />
        </div>
      </AppDrawer>
    </div>
  )
}

export default FormData
