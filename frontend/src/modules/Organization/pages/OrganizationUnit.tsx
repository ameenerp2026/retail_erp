import { useEffect, useMemo, useState } from "react"
import { Download, Plus, Search, X } from "lucide-react"
import OrgUnitTable from "../components/OrgUnitTable"
import Pagination from "../components/Pagination"
import { Modal } from '@/components/shared/Modal'
import { OrgUnitForm } from "../components/OrgUnitForm"
import { DeleteConfirmForm } from "../components/DeleteConfirmForm"
import { OrgUnitFormData } from "@/components/forms/validate.schema"
import apiClient from '../../../services/apiClient'
import toast from "react-hot-toast"

export interface OrganizationUnit {
  id: number;
  organizationUnit: string;
  unitType: string;
  gstIn: string;
  manager: string;
  organizationGroupId: number;
  state: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;

  organizationGroup: {
    id: number;
    shortName: string;
  };
}


type StatusFilter = "all" | "Active" | "Inactive"

function OrganizationUnit() {
  const [units, setUnits] =  useState<OrganizationUnit[]>([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<OrganizationUnit | null>(null)
  

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<OrganizationUnit | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter
      const term = searchTerm.toLowerCase().trim()
      const matchesSearch =!term || [
        unit.organizationUnit,
        unit.gstIn,
        unit.unitType,
        unit.manager,
        unit.organizationGroup.shortName,
        unit.state,
         unit.state,
    unit.address
      ].some(field => field?.toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [units, searchTerm, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])
const fetchUnits = async () => {
    try {
    setLoading(true);

    const res = await apiClient.get("/api/organizationUnit/org-unit");

    setUnits(res.data.data);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch organization units");
  } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
  
  fetchUnits();
}, []);

  const totalPages = Math.ceil(filteredUnits.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentUnits = filteredUnits.slice(startIndex, startIndex + rowsPerPage)

  const handleAddClick = () => {
    setEditingUnit(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (row: OrganizationUnit) => {
    setEditingUnit(row)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUnit(null)
  }

  const handleSaveUnit = async (data: OrgUnitFormData) => {
    setLoading(true)
    const isEdit = editingUnit !== null;
    try {
      console.log('OrgUnitFormData',data)
      if (isEdit) {
        await apiClient.put(
    `/api/organizationUnit/org-unit/${editingUnit.id}`,
    data
  );
     toast.error('Failed to save')
    }
      
       else {
        await apiClient.post(
    "/api/organizationUnit/org-unit",
    data
  );
    }
      fetchUnits();
      toast.success(`Org unit ${isEdit? 'updated' : 'created'} successfully!`)
      setIsModalOpen(false)
      setEditingUnit(null)
    } catch (error) {
      toast.error(`Failed to ${isEdit? 'update' : 'create'} org unit`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (row: OrganizationUnit) => {
    console.log('deleteOrganizationUnit',OrganizationUnit)
    setUnitToDelete(row)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
     if (!unitToDelete) return;

  setLoading(true);

  try {
    await apiClient.delete(
      `/api/organizationUnit/org-unit/${unitToDelete.id}`
    );

    // Refresh table
    await fetchUnits();

    toast.success(
      `${unitToDelete.organizationUnit} deleted successfully`
    );

    setDeleteModalOpen(false);
    setUnitToDelete(null);
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete org unit");
  } finally {
    setLoading(false);
  }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h2 className="page-title">Org Unit</h2>
          <p className="page-subtitle">
            {filteredUnits.length} {filteredUnits.length === 1? 'unit' : 'units'} across all groups
          </p>
        </div>
        <div className="page-actions">
          <button className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 bg-[linear-gradient(#F3F4F6,#E5E7EB)] px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-300 sm:px-4">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleAddClick}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 sm:px-4"
          >
            <Plus size={18} />
            {loading? 'Adding...' : 'Add Org Unit'}
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search units, GSTIN,Manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["all", "Active", "Inactive"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                statusFilter === status
                ? "bg-[#043793] text-white border-[#043793]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status === "all"? "All" : status}
            </button>
          ))}
        </div>
      </div>

      {currentUnits.length === 0? (
        <div className="text-center py-12 text-gray-500">No org units match your filters</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <OrgUnitTable
              units={currentUnits}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              loading={loading}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startIndex={startIndex}
            endIndex={startIndex + rowsPerPage}
            totalItems={filteredUnits.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} maxWidth="2xl">
        <OrgUnitForm
          editData={editingUnit}
          loading={loading}
          onClose={handleCloseModal}
          onSave={handleSaveUnit}
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} maxWidth="md">
  <DeleteConfirmForm
    unitName={unitToDelete?.organizationUnit || ''}
    loading={loading}
    onClose={() => setDeleteModalOpen(false)}
    onConfirm={handleConfirmDelete}
  />
      </Modal>
    </div>
  )
}

export default OrganizationUnit