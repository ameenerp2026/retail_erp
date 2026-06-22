import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";




type ReusableTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string;
};

export default function ReusableTable<T extends object>({
  columns,
  data,
  rowKey = "id",
}: ReusableTableProps<T>) {
    return(
        <div className="bg-white rounded-2xl shadow-sm border border-slate overflow-hidden">
            <Table
            columns={columns}
            dataSource={data}
            rowKey={rowKey}
            pagination={{
                pageSize:10,
                 showTotal: (total) => `Showing ${total} results`,
            }}
            />

            
        </div>
    )
}

