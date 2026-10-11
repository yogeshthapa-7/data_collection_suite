import { Table } from 'antd'
import type { TableProps } from 'antd/es/table'
import type { ColumnsType } from 'antd/es/table'
import AppCard from './app-card'
import AppPagination from './app-pagination'

export interface AppTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ColumnsType<T>
  loading?: boolean
  emptyText?: string
  cardClassName?: string
  cardStyle?: React.CSSProperties
  toolbar?: React.ReactNode
  rowHoverClassName?: string
}

export interface ServerPaginationProps {
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
}

type CombinedProps<T> = AppTableProps<T> & Partial<ServerPaginationProps>

export default function AppTable<T>({
  columns,
  loading = false,
  emptyText = 'No data found',
  cardClassName = '',
  cardStyle,
  toolbar,
  rowHoverClassName = '',
  dataSource,
  ...rest
}: CombinedProps<T>) {
  const rowClassName = (_record: T, index: number) => {
    const base = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
    return rowHoverClassName ? `${base} ${rowHoverClassName}` : base
  }

  const {
    total,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [12, 24, 36, 48],
  } = rest

  const hasPagination = typeof total === 'number' && typeof onPageChange === 'function'

  return (
    <AppCard className={cardClassName} style={cardStyle}>
      {toolbar && <div className="mb-4">{toolbar}</div>}
      <div className="overflow-x-auto">
        <Table<T>
          className="app-table-highlight"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          locale={{ emptyText }}
          bordered={false}
          size="middle"
          rowClassName={rowClassName}
          {...(rest as TableProps<T>)}
        />
      </div>
      {hasPagination && (
        <AppPagination
          total={total!}
          currentPage={currentPage!}
          pageSize={pageSize!}
          onPageChange={onPageChange!}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </AppCard>
  )
}