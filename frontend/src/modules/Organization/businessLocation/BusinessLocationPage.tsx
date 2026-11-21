import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Filter, Download } from "lucide-react";
import BusinessLocationForm from "./components/BusinessLocationForm";
import BusinessLocationFilter from "./components/BusinessLocationFilter";
import toast from "react-hot-toast";
import type { BusinessLocationRow } from "../../../types/admin/organization/businessLocation";
import BusinessLocationTable from "./components/BusinessLocationTable";
import {
  BUSINESS_LOCATION_QUERY_KEY,
  useBusinessLocations,
} from "@/hooks/admin/organization/useBusinessLocation";
import { exportToPDF, ExportColumn } from "@/utils/exportData";
import { useQueryClient } from "@tanstack/react-query";
import { deleteBusinessLocation } from "@/services/admin/organization/businessLocation.service";
type ViewMode = "list" | "create" | "edit";

const businessLocationColumns: ExportColumn<BusinessLocationRow>[] = [
  { header: "Location Name", accessor: (l) => l.locationName },
  { header: "Code", accessor: (l) => l.code || `LOC-${String(l.id).padStart(3, "0")}` },
  {
    header: "Address",
    accessor: (l) =>
      [l.addressLine1, l.addressLine2].filter(Boolean).join(", "),
  },
  { header: "City", accessor: (l) => l.city },
  { header: "State", accessor: (l) => l.state },
  { header: "Status", accessor: (l) => l.status },
];

function BusinessLocationPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get("action");
  const editIdParam = searchParams.get("id");

  const [localView, setLocalView] = useState<ViewMode>("list");
  const [selectedLocation, setSelectedLocation] =
    useState<BusinessLocationRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");

  const {
    data: locations = [],
    isLoading,
    error,
  } = useBusinessLocations();

  const view: ViewMode =
    actionParam === "create" ? "create" : actionParam === "edit" ? "edit" : localView;

  const locationToEdit = useMemo(() => {
    if (actionParam === "edit" && editIdParam) {
      return (
        locations.find((l: BusinessLocationRow) => String(l.id) === editIdParam) ||
        selectedLocation
      );
    }
    return selectedLocation;
  }, [actionParam, editIdParam, locations, selectedLocation]);

  // Extract available states for filter
  const availableStates = useMemo(() => {
    const statesSet = new Set<string>();
    locations.forEach((loc: BusinessLocationRow) => {
      if (loc.state) statesSet.add(loc.state);
    });
    return Array.from(statesSet).sort();
  }, [locations]);

  const filteredLocations = useMemo(() => {
    let result = locations;

    // Search query filter
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      result = result.filter((loc: BusinessLocationRow) =>
        [loc.locationName, loc.code, loc.city, loc.state, loc.addressLine1].some(
          (field) => field?.toLowerCase().includes(term)
        )
      );
    }

    // Status filter
    if (selectedStatus !== "ALL") {
      result = result.filter(
        (loc: BusinessLocationRow) =>
          loc.status?.toUpperCase() === selectedStatus
      );
    }

    // State filter
    if (selectedState !== "ALL") {
      result = result.filter(
        (loc: BusinessLocationRow) =>
          loc.state?.toLowerCase() === selectedState.toLowerCase()
      );
    }

    return result;
  }, [locations, searchTerm, selectedStatus, selectedState]);

  const currentLocations = useMemo(() => {
    if (currentPage === 1) {
      return filteredLocations.slice(0, 5);
    }
    return filteredLocations.slice(5, 12);
  }, [filteredLocations, currentPage]);

  const totalPages = filteredLocations.length > 5 ? 2 : 1;

  const handleCreate = () => {
    setSelectedLocation(null);
    setSearchParams({ action: "create" });
    setLocalView("create");
  };

  const handleEdit = (row: BusinessLocationRow) => {
    setSelectedLocation(row);
    setSearchParams({ action: "edit", id: String(row.id) });
    setLocalView("edit");
  };

  const handleBack = () => {
    setSelectedLocation(null);
    setSearchParams({});
    setLocalView("list");
  };

  const handleDelete = async (row: BusinessLocationRow) => {
    try {
      await deleteBusinessLocation(row.id);
      await queryClient.invalidateQueries({
        queryKey: BUSINESS_LOCATION_QUERY_KEY,
      });
      toast.success("Business location deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete business location");
    }
  };

  if (view === "create") {
    return (
      <BusinessLocationForm
        onBack={handleBack}
        onSaved={handleBack}
      />
    );
  }

  if (view === "edit" && locationToEdit) {
    return (
      <BusinessLocationForm
        location={locationToEdit}
        onBack={handleBack}
        onSaved={handleBack}
      />
    );
  }

  const hasActiveFilters = selectedStatus !== "ALL" || selectedState !== "ALL";

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Business Locations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your organization's physical sites and hubs across regions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCreate}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#093055] px-5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#072440] cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Box */}
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search location name, code or city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#043793] focus:ring-1 focus:ring-[#043793]"
            />
          </div>

          {/* Filters Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition cursor-pointer ${
                isFilterOpen || hasActiveFilters
                  ? "border-[#043793] bg-blue-50/30 text-[#043793]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} className={hasActiveFilters ? "text-[#043793]" : "text-slate-500"} />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#043793] text-[10px] font-bold text-white">
                  {(selectedStatus !== "ALL" ? 1 : 0) + (selectedState !== "ALL" ? 1 : 0)}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <BusinessLocationFilter
                selectedStatus={selectedStatus}
                onChangeStatus={(st) => {
                  setSelectedStatus(st);
                  setCurrentPage(1);
                }}
                selectedState={selectedState}
                onChangeState={(st) => {
                  setSelectedState(st);
                  setCurrentPage(1);
                }}
                availableStates={availableStates}
                onReset={() => {
                  setSelectedStatus("ALL");
                  setSelectedState("ALL");
                  setCurrentPage(1);
                }}
                onClose={() => setIsFilterOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={() =>
            exportToPDF(filteredLocations, businessLocationColumns, {
              filename: "business-locations.pdf",
              title: "Business Locations",
              orientation: "landscape",
            })
          }
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
        >
          <Download size={16} className="text-slate-500" />
          Export
        </button>
      </div>

      {/* Table & Pagination Card */}
      <BusinessLocationTable
        locations={currentLocations}
        totalCount={filteredLocations.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        error={error instanceof Error ? error.message : undefined}
      />
    </div>
  );
}

export default BusinessLocationPage;
