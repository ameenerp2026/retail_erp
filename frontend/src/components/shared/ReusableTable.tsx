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
    <div className="bg-white w-full border-t border-slate-200">
      <div
        className="
          [&_.ant-table-thead_th]:bg-white!
          [&_.ant-table-thead_th]:text-slate-500
          [&_.ant-table-thead_th]:text-xs
          [&_.ant-table-thead_th]:font-medium
          [&_.ant-table-thead_th]:whitespace-nowrap
          [&_.ant-table-thead_th]:border-b
          [&_.ant-table-thead_th]:border-slate-200
          [&_.ant-table-thead_th]:before:hidden!
          [&_.ant-table-cell]:text-xs
          [&_.ant-table-cell]:px-3!
          [&_.ant-table-cell]:py-2.5!
          [&_.ant-table-cell]:align-middle
          [&_.ant-table-tbody_td]:border-b
          [&_.ant-table-tbody_td]:border-slate-100
          [&_.ant-table-tbody_tr:hover_td]:bg-slate-50!
          [&_.ant-pagination]:flex
          [&_.ant-pagination]:items-center
          [&_.ant-pagination]:px-4
          [&_.ant-pagination]:py-3.5
          [&_.ant-pagination-total-text]:text-xs
          [&_.ant-pagination-total-text]:text-slate-500
          [&_.ant-pagination-total-text]:mr-auto
          [&_.ant-pagination-item-active]:bg-[#155DFC]!
          [&_.ant-pagination-item-active]:border-[#155DFC]!
          [&_.ant-pagination-item-active_a]:text-white!
          [&_.ant-pagination-item]:rounded-md
          [&_.ant-pagination-prev_button]:rounded-md
          [&_.ant-pagination-next_button]:rounded-md
        "
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={rowKey}
          loading={loading}
          rowSelection={rowSelection}
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
                  className: "cursor-pointer",
                })
              : undefined
          }
        />
      </div>
    </div>
  );
}