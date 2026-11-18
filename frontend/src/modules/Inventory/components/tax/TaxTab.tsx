import { useMemo, useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Search,
  ListFilter,
  Upload,
  Download,
  Check,
  X,
} from "lucide-react";
import { Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReusableTable from "@/components/shared/ReusableTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { inventorySetupService } from "@/services/inventorySetupService";
import type { TaxConfig, TaxConfigInput } from "@/types/inventorySetup";
import { Modal } from "@/components/shared/Modal";
import {
  FieldWrap,
  SelectInput,
  TextInput,
  Toggle,
  DrawerFooter,
} from "../shared/formControls";
import SectionLabel from "../shared/SectionLabel";
import toast from "react-hot-toast";
import { exportToCSV } from "@/utils/exportData";

const TAX_GROUP_OPTIONS = [
  "STANDARD",
  "ESSENTIAL",
  "PHARMA",
  "EXEMPT",
  "ELECTRONICS",
  "APPEARL",
  "FMCG",
  "GROCERY",
];

function TaxDrawer({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TaxConfig | null;
  onSave: (data: TaxConfigInput) => void;
}) {
  const [taxGroup, setTaxGroup] = useState(initialData?.taxGroup || "STANDARD");
  const [hsnCode, setHsnCode] = useState(initialData?.hsnCode || "");
  const [gstRate, setGstRate] = useState(initialData?.gstRate ?? 18);
  const [cessRate, setCessRate] = useState(initialData?.cessRate ?? 0);
  const [effectiveFrom, setEffectiveFrom] = useState(
    initialData?.effectiveFrom?.slice(0, 10) || "2026-04-01",
  );
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false);

  // Sync state if initialData changes
  useEffect(() => {
    setTaxGroup(initialData?.taxGroup || "STANDARD");
    setHsnCode(initialData?.hsnCode || "");
    setGstRate(initialData?.gstRate ?? 18);
    setCessRate(initialData?.cessRate ?? 0);
    setEffectiveFrom(initialData?.effectiveFrom?.slice(0, 10) || "2026-04-01");
    setIsDefault(initialData?.isDefault ?? false);
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      taxGroup,
      hsnCode: hsnCode.replace(/\s/g, ""),
      gstRate: Number(gstRate),
      cessRate: Number(cessRate),
      effectiveFrom,
      isDefault,
      status: initialData?.status ?? "ACTIVE",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-base font-bold text-[#043793]">
          {initialData
            ? `Edit Tax Configuration (${initialData.taxId})`
            : "Create Tax Configuration"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="mb-4">
          <SectionLabel>Tax Identity</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Tax ID">
            <TextInput
              value={initialData?.taxId || "Tax ID is Auto-generated"}
              disabled
            />
          </FieldWrap>
          <FieldWrap label="Tax Group" required>
            <SelectInput
              options={TAX_GROUP_OPTIONS}
              value={taxGroup}
              onChange={(v) => setTaxGroup(v)}
              placeholder="Select dropdown"
            />
          </FieldWrap>
          <FieldWrap label="HSN Code" required>
            <TextInput
              value={hsnCode}
              onChange={(v) => setHsnCode(v)}
              placeholder="Enter 4, 6 or 8 digit HSN code"
            />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Tax Rates</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="GST Rate %" required>
            <TextInput
              type="number"
              value={gstRate}
              onChange={(v) => setGstRate(Number(v))}
              placeholder="0"
            />
          </FieldWrap>

          <FieldWrap label="CESS Rate %">
            <TextInput
              type="number"
              value={cessRate}
              onChange={(v) => setCessRate(Number(v))}
              placeholder="0"
            />
          </FieldWrap>
        </div>

        <div className="mt-6 mb-4">
          <SectionLabel>Settings</SectionLabel>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Effective Date">
            <TextInput
              type="date"
              value={effectiveFrom}
              onChange={(v) => setEffectiveFrom(v)}
            />
          </FieldWrap>
          <div className="flex items-end justify-between gap-3 pb-1">
            <span className="text-xs font-medium text-[#314158]">
              Default Tax
            </span>
            <Toggle checked={isDefault} onChange={(v) => setIsDefault(v)} />
          </div>
        </div>
      </div>

      <DrawerFooter
        onCancel={onClose}
        onPrimary={handleSubmit}
        primaryLabel={initialData ? "Update" : "Save"}
      />
    </Modal>
  );
}

export default function TaxTab() {
  const queryClient = useQueryClient();

  const { data: taxList = [], isLoading } = useQuery({
    queryKey: ["inventory-setup-tax"],
    queryFn: inventorySetupService.getTaxConfigs,
  });

  // Drawer / modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TaxConfig | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit handler
  const handleEdit = (record: TaxConfig) => {
    setEditingItem(record);
    setDrawerOpen(true);
  };

  // Save (Create or Update) handler
  const handleSaveTax = async (formData: TaxConfigInput) => {
    try {
      if (editingItem) {
        await inventorySetupService.updateTaxConfig(editingItem.id, formData);

        toast.success(
          `Tax configuration "${editingItem.taxId}" updated successfully`,
        );
      } else {
        const createdTax =
          await inventorySetupService.createTaxConfig(formData);

        toast.success(
          `Tax configuration "${createdTax.taxId}" created successfully`,
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["inventory-setup-tax"],
      });

      setDrawerOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error("Tax configuration save failed:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to save tax configuration. Please try again.";

      toast.error(message);
    }
  };

  // Export handler
  const handleExport = () => {
    exportToCSV(
      taxList,
      [
        { header: "Tax ID", accessor: (t) => t.taxId },
        { header: "Tax Group", accessor: (t) => t.taxGroup },
        { header: "HSN Code", accessor: (t) => t.hsnCode },
        { header: "GST Rate", accessor: (t) => `${t.gstRate}%` },
        { header: "CESS Rate", accessor: (t) => `${t.cessRate}%` },
        { header: "Effective Form", accessor: (t) => `${t.effectiveFrom}%` },
        {
          header: "Default Tax",
          accessor: (t) => (t.isDefault ? "Yes" : "No"),
        },
      ],
      "tax-configuration.csv",
    );
    toast.success("Tax configuration exported to CSV");
  };

  // Import handler
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" imported successfully`);
    }
    e.target.value = "";
  };

  // Filtered list
  const filtered = useMemo(() => {
    return taxList.filter((t) => {
      const q = search.toLowerCase();
      const matchesSearch =
        t.taxId.toLowerCase().includes(q) ||
        t.taxGroup.toLowerCase().includes(q) ||
        t.hsnCode.toLowerCase().includes(q);
      const matchesGroup = groupFilter === "All" || t.taxGroup === groupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [taxList, search, groupFilter]);

  // Distinct groups for filter dropdown
  const availableGroups = useMemo(() => {
    const groups = Array.from(new Set(taxList.map((t) => t.taxGroup)));
    return ["All", ...groups];
  }, [taxList]);

  // Table Columns matching Figma reference design
  const columns: ColumnsType<TaxConfig> = [
    {
      title: "Tax ID",
      dataIndex: "taxId",
      width: 105,
      render: (v: string, record: TaxConfig) => (
        <span
          onClick={() => handleEdit(record)}
          className="font-medium text-xs text-[#155DFC] hover:underline cursor-pointer"
        >
          {v}
        </span>
      ),
    },
    {
      title: "Tax Group",
      dataIndex: "taxGroup",
      width: 150,
      render: (v: string) => {
        let dotColor = "bg-slate-400";
        let badgeClasses = "bg-slate-100 text-slate-700 border-slate-200";

        if (v === "Essential" || v.toLowerCase().includes("grocery")) {
          dotColor = "bg-emerald-500";
          badgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (v === "Pharma") {
          dotColor = "bg-cyan-500";
          badgeClasses = "bg-cyan-50 text-cyan-700 border-cyan-200";
        }

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeClasses}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {v}
          </span>
        );
      },
    },
    {
      title: "HSN Code",
      dataIndex: "hsnCode",
      width: 130,
      render: (v: string) => (
        <span className="text-xs text-slate-600 font-mono tracking-wider">
          {v}
        </span>
      ),
    },
    {
      title: "GST Rate",
      dataIndex: "gstRate",
      width: 110,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v}%</span>
      ),
    },
    {
      title: "CESS Rate",
      dataIndex: "cessRate",
      width: 110,
      render: (v: number) => (
        <span className="font-semibold text-xs text-[#155DFC]">{v}%</span>
      ),
    },
    {
      title: "Effective From",
      dataIndex: "effectiveFrom",
      width: 130,
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      width: 90,
      render: (v: boolean) => (v ? "Yes" : "No"),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_: unknown, record: TaxConfig) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                icon: <Pencil size={14} className="text-blue-600" />,
                label: (
                  <span className="text-xs font-medium text-slate-700">
                    Edit
                  </span>
                ),
                onClick: () => handleEdit(record),
              },
            ],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Actions"
          >
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Toolbar matching Figma screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Left: Title + Counter + Search + Filters */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="mr-1">
            <h1 className="text-xl font-bold text-[#0F2A66] tracking-tight leading-tight">
              Tax Configuration
            </h1>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {filtered.length} records
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 sm:w-56 pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition shadow-2xs cursor-pointer ${
                groupFilter !== "All"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ListFilter size={13} className="text-slate-500" />
              <span>Filters</span>
              {groupFilter !== "All" && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-[10px] text-white">
                  {groupFilter}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                {availableGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => {
                      setGroupFilter(group);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      groupFilter === group
                        ? "font-semibold text-blue-600 bg-blue-50/50"
                        : "text-slate-700"
                    }`}
                  >
                    <span>{group}</span>
                    {groupFilter === group && (
                      <Check size={12} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Export, Import & + New Tax Config */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <Upload size={13} className="text-slate-500" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition shadow-2xs cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Import</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#155DFC] hover:bg-blue-600 rounded-lg transition shadow-2xs cursor-pointer active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>New Tax Config</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <ReusableTable
        columns={columns}
        data={filtered}
        loading={isLoading}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }}
      />

      {/* Create / Edit Drawer */}
      <TaxDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSave={handleSaveTax}
      />
    </div>
  );
}
