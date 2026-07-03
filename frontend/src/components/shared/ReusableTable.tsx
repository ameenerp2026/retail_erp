import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";




type ReusableTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string;
  loading?: boolean
};

export default function ReusableTable<T extends object>({
  columns,
  data,
  rowKey = "id",
  loading = false,
}: ReusableTableProps<T>) {
    return(
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className=" [&_.ant-table-thead_th]:text-[#6B7A99]
                             [&_.ant-table-thead_th]:text-xs
                             [&_.ant-table-thead_th]:font-semibold
                             [&_.ant-table-thead_th]:uppercase
                             [&_.ant-table-thead_th]:tracking-wide
                             [&_.ant-table-thead_th]:bg-white 
                             [&_.ant-table-thead_tr_th]:whitespace-nowrap 
                             [&_.ant-table-cell]:whitespace-nowrap
            ">
              <Table
                columns={columns}
                dataSource={data}
                rowKey={rowKey}
                loading={loading}
                scroll={{ x: true }}
                style={{ width: "100%" }}
                pagination={{
                    pageSize:10,
                     showTotal: (total) => `Showing ${total} results`,
                }}
              />
            </div>
        </div>
    )
}

