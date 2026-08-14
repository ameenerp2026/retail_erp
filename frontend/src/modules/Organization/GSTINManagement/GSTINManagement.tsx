import { Plus, Search } from "lucide-react";
import { GSTIN_STAT_CARDS } from "@/config/gstinCardConfig";
import SimpleStatCard from "@/components/shared/SimpleStatCard";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getGSTINColumns } from "./components/GSTINColumns";
import GSTINModal from "./components/GSTINModal";
import { GSTINRecord } from "@/types/gstin";
import type { GstinFormData } from "@/components/forms/validate.schema";
import ReusableTable from "@/components/shared/ReusableTable";
//import { gstinService } from "@/services/gstinService";
import {
  useGSTINs,
  useCreateGSTIN,
} from "../../../hooks/admin/organization/useGSTIN";
export default function GSTINManagement() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: gstins = [] } = useGSTINs();
  const createGSTINMutation = useCreateGSTIN();
  function handleAddGSTIN(data: GstinFormData) {
    createGSTINMutation.mutate(data, {
      onSuccess: () => {
        toast.success("GSTIN added successfully");
      },

      onError: (error: any) => {
        console.error("Create GSTIN failed:", error);

        toast.error(error?.response?.data?.message || "Failed to add GSTIN");
      },
    });
  }

  const filteredRecords = useMemo(() => {
    if (!search) return gstins;
    return gstins.filter(
      (r: GSTINRecord) =>
        r.gstin.toLowerCase().includes(search.toLowerCase()) ||
        r.state.toLowerCase().includes(search.toLowerCase()) ||
        r.organizationUnit?.organizationUnit
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [search, gstins]);

  function handleReVerify(record: GSTINRecord) {
    console.log("Re-verify", record.gstin);
    //     // call API to re-verify
  }

  const columns = getGSTINColumns(handleReVerify);
  const totalGSTINs = gstins.length;

  //  const verifiedCount = gstins.filter(
  //     (item) => item.status === "Verified"
  //   ).length;

  //   const pendingCount = gstins.filter(
  //     (item) => item.status === "Pending"
  //   ).length;

  //   const failedCount = gstins.filter(
  //     (item) => item.status === "Failed"
  //   ).length;

  const statCards = [
    {
      ...GSTIN_STAT_CARDS[0],
      count: totalGSTINs,
    },
    {
      ...GSTIN_STAT_CARDS[1],
      count: 0,
      //count: verifiedCount,
    },
    // {
    //   ...GSTIN_STAT_CARDS[2],
    //   count: pendingCount,
    // },
    {
      ...GSTIN_STAT_CARDS[2],
      //count: failedCount,
      count: 0,
    },
  ];
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">GSTIN Management</h1>
          <p className="page-subtitle">
            GST registration, verification and compliance tracking
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 py-2.5 text-sm font-medium text-white"
        >
          <span>
            <Plus size={18} />
          </span>{" "}
          Add GSTIN
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {statCards.map((card) => (
          <SimpleStatCard
            key={card.id}
            count={card.count}
            label={card.label}
            textColor={card.textColor}
          />
        ))}
      </div>
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-4 max-w-md">
        <Search size={14} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search GSTIN, state, unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm outline-none flex-1 bg-transparent"
        />
      </div>
      {/* Table */}
      <ReusableTable columns={columns} data={filteredRecords} rowKey="id" />

      {/* Add GSTIN modal */}
      <GSTINModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddGSTIN}
      />
    </div>
  );
}
