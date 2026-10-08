import { Table, type TableProps } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'

export interface UiTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  rowKey: string | ((record: T) => string)
  pagination?: {
    current: number
    pageSize: number
    total: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number) => string
  }
  onChange?: (pagination: TablePaginationConfig) => void
  scroll?: { x?: number }
}

const UiTable = <T,>({
  columns,
  dataSource,
  rowKey,
  pagination,
  onChange,
  scroll = { x: 800 },
  ...rest
}: UiTableProps<T>) => {
  return (
    <Table<T>
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
      onChange={onChange}
      scroll={scroll}
      {...rest}
    />
  )
}

export default UiTable
