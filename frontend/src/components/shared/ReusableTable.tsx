import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";

type ReusableTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string;
  loading?: boolean;
  rowSelection?: TableRowSelection<T>;
  onRowClick?: (record: T) => void;
};

export default function ReusableTable<T extends object>({
  columns,
  data,
  rowKey = "id",
  loading = false,
  rowSelection,
  onRowClick,
}: ReusableTableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden w-full">
      <div className="[&_.ant-table-thead_th]:text-slate-700
                      [&_.ant-table-thead_th]:text-xs
                      [&_.ant-table-thead_th]:font-semibold
                      [&_.ant-table-thead_th]:bg-[#F8FAFC]
                      [&_.ant-table-thead_th]:border-b
                      [&_.ant-table-thead_th]:border-slate-200
                      [&_.ant-table-thead_tr_th]:whitespace-nowrap 
                      [&_.ant-table-cell]:whitespace-nowrap
                      [&_.ant-table-cell]:text-xs
                      [&_.ant-table-cell]:py-3
                      [&_.ant-table-tbody_tr]:transition-colors
                      [&_.ant-table-tbody_tr]:border-b
                      [&_.ant-table-tbody_tr]:border-slate-100
                      [&_.ant-pagination]:flex
                      [&_.ant-pagination]:items-center
                      [&_.ant-pagination]:justify-between
                      [&_.ant-pagination]:px-4
                      [&_.ant-pagination]:py-3.5
                      [&_.ant-pagination-total-text]:text-xs
                      [&_.ant-pagination-total-text]:text-slate-500
                      [&_.ant-pagination-item-active]:bg-[#155DFC]
                      [&_.ant-pagination-item-active]:border-[#155DFC]
                      [&_.ant-pagination-item-active_a]:text-white!
                      [&_.ant-pagination-item]:rounded-md
                      [&_.ant-pagination-prev_button]:rounded-md
                      [&_.ant-pagination-next_button]:rounded-md
      ">
        <Table
          columns={columns}
          dataSource={data}
          rowKey={rowKey}
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: true }}
          style={{ width: "100%" }}
          pagination={{
            pageSize: 15,
            showTotal: (total, range) => `Showing ${range[0]}–${range[1]} of ${total} records`,
            showSizeChanger: false,
          }}
          onRow={
            onRowClick
              ? (record) => ({
                  onClick: () => onRowClick(record),
                  className: 'cursor-pointer hover:bg-slate-50/80 transition-colors',
                })
              : undefined
          }
        />
      </div>
    </div>
  )
}
