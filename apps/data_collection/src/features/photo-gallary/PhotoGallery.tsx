import { useEffect, useState } from 'react'
import { Form, message, Spin, Typography } from 'antd'
import { AppInput, AppSelect, AppDrawer, Button, AppTable, AppNepaliDatePicker } from '@data-collection-suite/ui'
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import { useOutletContext } from 'react-router-dom'
import type { CategoryWorkspaceContext } from '@/features/category-detail/types/categoryDetail'
import { AppMapView } from '@/shared/components/AppMapView'
import { fetchData, fetchAllCollectors } from '@/features/photo-gallary/services/photoGallery.service'
import type { PhotoGalleryItem, SearchableQuestion, SelectOptionItem } from '@/features/photo-gallary/types/photoGallery'

const STATUS_OPTIONS = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Approved Only' },
  { value: 2, label: 'Rejected Only' },
  { value: 3, label: 'Pending Only' },
]

const PhotoGallery = () => {
  const [form] = Form.useForm()
  const [dynamicForm] = Form.useForm()
  const [allData, setAllData] = useState<PhotoGalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [collectors, setCollectors] = useState<{ value: number; label: string }[]>([])
  const [searchableQuestions, setSearchableQuestions] = useState<SearchableQuestion[]>([])
  const [accordionItems, setAccordionItems] = useState<string[]>([])
  const [mapDrawerOpen, setMapDrawerOpen] = useState(false)
  const { categoryId } = useOutletContext<CategoryWorkspaceContext>()
  const [currentItem, setCurrentItem] = useState<PhotoGalleryItem | null>(null)

  useEffect(() => {
    fetchCollectors()
  }, [])

  const fetchCollectors = async () => {
    try {
      const data = await fetchAllCollectors(categoryId)
      setCollectors(data)
    } catch {
      message.error('Failed to load collectors')
    }
  }

  const fetchData = async () => {
  const values = form.getFieldsValue()
  let UserId = +values.UserID || 0
  let filterData = { ...values, UserID: UserId }
  let dynamicFilterData = {}

  setLoading(true)
  try {
    const res = await fetchData(categoryId, filterData, dynamicFilterData)
    if (res.Success) {
      const categoryFormInfo = res.Data.CategoryFormInfo || []
      const cameraQuestions = categoryFormInfo.filter((q: any) => q.InputType === 'camera' || q.InputType === 'docs')
      let parsedData = JSON.parse(res.Data.Datas)
      
      const processedData = parsedData.map((item: any) => {
        item.CameraImages = []
        cameraQuestions.forEach((q: any) => {
          const fieldName = q.DbColumnName
          if (item[fieldName] && item[fieldName].trim() !== '') {
            let path = item[fieldName].trim()
            if (!path.startsWith('http://') && !path.startsWith('https://')) {
              if (path.startsWith('/')) path = path.substring(1)
              item[fieldName] = base_url + path
            }
            item.CameraImages.push(item[fieldName])
          }
        })
        return item
      })
      
      setAllData(processedData)
      setCategoriesInfo(categoryFormInfo)
    }
  } catch (err) {
    message.error('Failed to fetch data')
  } finally {
    setLoading(false)
  }
}

  const handleSearch = () => {
    fetchData()
  }

  const renderImage = (item: PhotoGalleryItem) => {
    const images = item.CameraImages || []
    if (images.length === 0 && !item.Photo) {
      return <img src="/assets/images/image-not-found-scaled.png" className="img-fluid fixed-image" alt="No Photo" loading="lazy" />
    }
    if (images.length === 1) {
      return <img src={images[0] || 'assets/images/image-not-found-scaled.png'} className="img-fluid fixed-image single-image" alt="Photo" loading="lazy" />
    }
    return (
      <div className="image-grid">
        {images.slice(0, 20).map((img, i) => (
          <img key={i} src={img || 'assets/images/image-not-found-scaled.png'} className="img-fluid fixed-image" alt="img" loading="lazy" />
        ))}
      </div>
    )
  }

  const tableColumns = [
    { title: 'Collector', dataIndex: 'CreatedByUsername', key: 'CreatedByUsername' },
    { title: 'Owner Name', dataIndex: 'Fullname', key: 'Fullname' },
    { title: 'PAN/VAT', dataIndex: 'PAN_VAT', key: 'PAN_VAT' },
    { title: 'Mobile', dataIndex: 'MobileNo', key: 'MobileNo' },
    { title: 'Address', dataIndex: 'Tole', key: 'Tole' },
    { title: 'Waste Type', dataIndex: 'WasteTypeName', key: 'WasteTypeName' },
    { title: 'Collected Date', dataIndex: 'CreatedDate', key: 'CreatedDate' },
    { title: 'Approved By', dataIndex: 'ApprovedByUsername', key: 'ApprovedByUsername' },
    { title: 'Fee', dataIndex: 'Fee', key: 'Fee' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Form form={form} layout="vertical" requiredMark={false}>
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-3">
              <Form.Item name="FormID" label="Form ID">
                <AppInput placeholder="Enter Form ID" />
              </Form.Item>
            </div>

            <div className="col-span-3">
              <Form.Item name="ApproveType" label="Status">
                <AppSelect placeholder="Select status" options={STATUS_OPTIONS} />
              </Form.Item>
            </div>

            <div className="col-span-4">
              <fieldset className="rounded-lg border border-slate-200 px-3 pb-2 pt-0.5">
                <legend className="px-1 text-xs font-medium text-slate-600">Entry Date</legend>
                <div className="grid grid-cols-2 gap-2">
                  <Form.Item name="DateFrom" className="!mb-0">
                    <AppNepaliDatePicker placeholder="From Date" returnEnglishDate style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="DateTo" className="!mb-0">
                    <AppNepaliDatePicker placeholder="To Date" returnEnglishDate style={{ width: '100%' }} />
                  </Form.Item>
                </div>
              </fieldset>
            </div>

            <div className="col-span-2">
              <Form.Item name="UserID" label="Select Collector">
                <AppSelect placeholder="Select collector" options={collectors.map((c) => ({ value: c.id, label: c.text }))}showSearch allowClear />
              </Form.Item>
            </div>
          </div>
        </Form>

        {searchableQuestions.length > 0 && (
          <div className="mt-4 space-y-4">
            {accordionItems.map((item, index) => (
              <details key={index} className="border rounded p-3">
                <summary className="cursor-pointer font-medium">{item}</summary>
                <Form form={dynamicForm} layout="horizontal" className="mt-3">
                  <div className="grid grid-cols-4 gap-4">
                    {searchableQuestions.map((sq) => (
                      <div key={sq.DbColumnName} className="col-span-1">
                        <label className="mb-1 block text-sm font-medium" title={sq.LabelName}>
                          {sq.DbColumnName}
                        </label>
                        {sq.InputType === 'select' || sq.InputType === 'multi-select' ? (
                          <AppSelect
                            placeholder="Select"
                            options={(sq.SelectOptions || []).map((opt: SelectOptionItem) => ({
                              value: opt.OptionValue,
                              label: opt.DispName,
                            }))}
                          />
                        ) : (
                          <AppInput placeholder="Enter value" />
                        )}
                      </div>
                    ))}
                  </div>
                </Form>
              </details>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
          {allData.length > 0 && (
            <Button icon={<span>📥</span>} onClick={() => message.info('Download All feature coming soon')}>
              Download All (Zip)
            </Button>
          )}
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allData.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCurrentItem(item)}
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {renderImage(item)}
              </div>
              <div className="p-2">
                <Typography.Text strong className="block truncate">
                  {item.CompanyName || 'N/A'}
                </Typography.Text>
              </div>
            </div>
          ))}
        </div>

        {allData.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-400">
            No Data Available
          </div>
        )}
      </Spin>

      <AppDrawer
        open={!!currentItem}
        onClose={() => setCurrentItem(null)}
        title="Image Details"
        width={1200}
      >
        {currentItem && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              {currentItem.CameraImages && currentItem.CameraImages.length > 0 ? (
                <div className="space-y-4">
                  {currentItem.CameraImages.map((img: string, i: number) => (
                    <img
                      key={i}
                      src={img || 'assets/images/image-not-found-scaled.png'}
                      className="img-fluid w-full"
                      alt={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={currentItem.Photo && currentItem.Photo.trim() !== '' ? currentItem.Photo : 'assets/images/image-not-found-scaled.png'}
                  className="img-fluid w-full"
                  alt="Photo"
                />
              )}
            </div>
            <div>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Collector</th>
                    <td>{currentItem.CreatedByUsername || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Owner Name</th>
                    <td>{currentItem.Fullname || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>PAN/VAT</th>
                    <td>{currentItem.PAN_VAT || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{currentItem.MobileNo || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Landline No</th>
                    <td>{currentItem.LandlineNo || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{currentItem.Tole || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{currentItem.Email || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Waste Type</th>
                    <td>{currentItem.WasteTypeName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Collected Date</th>
                    <td>{currentItem.CreatedDate || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>
                      {currentItem.CurLoc ? (
                        <a href={`https://www.google.com/maps?q=${currentItem.CurLoc}`} target="_blank" rel="noopener noreferrer">
                          {currentItem.CurLoc}
                        </a>
                      ) : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th>Approved By</th>
                    <td>{currentItem.ApprovedByUsername || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Approval Date</th>
                    <td>{currentItem.ApprovedDate ? new Date(currentItem.ApprovedDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fee</th>
                    <td>{currentItem.Fee || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Remarks</th>
                    <td>{currentItem.Remarks || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AppDrawer>
    </div>
  )
}

export default PhotoGallery