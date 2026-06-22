import { useEffect, useMemo, useState } from "react"
import { Download, Plus, Search, X } from "lucide-react"
import OrgUnitTable from "../components/OrgUnitTable"
import Pagination from "../components/Pagination"
import { Modal } from '@/components/shared/Modal'
import { OrgUnitForm } from "../components/OrgUnitForm"
import { DeleteConfirmForm } from "../components/DeleteConfirmForm"
import { OrgUnitFormData } from "@/components/forms/validate.schema"
import toast from "react-hot-toast"

export interface OrgUnit extends OrgUnitFormData {
  id: string
  subtext: string
  status: 'Active' | 'Inactive'
}

const orgUnits: OrgUnit[] = [
  { id: 'ORG-001', name: 'HQ - Mumbai', subtext: 'RetailShop India', type: 'Head Office', group: 'retailshop-india', gstin: '27AABCS1429B1ZB', manager: 'Raj Kumar', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-002', name: 'Delhi North', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '07AABCS1429B1ZC', manager: 'Priya Sharma', status: 'Active', state: 'TN', address: 'Chennai' },
  { id: 'ORG-003', name: 'Bangalore Central', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '29AABCS1429B1ZD', manager: 'Arun Patel', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-004', name: 'Chennai South', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '33AABCS1429B1ZE', manager: 'Meena Joshi', status: 'Inactive', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-005', name: 'Hyderabad Central', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '36AABCS1429B1ZF', manager: 'Suresh Reddy', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-006', name: 'Pune West', subtext: 'RetailShop India', type: 'Regional Office', group: 'retailshop-india', gstin: '27AABCS1429B1ZG', manager: 'Anita Shah', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-007', name: 'Kolkata East', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '19AABCS1429B1ZH', manager: 'Bikash Roy', status: 'Inactive', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-008', name: 'HQ - Mumbai', subtext: 'RetailShop India', type: 'Head Office', group: 'retailshop-india', gstin: '27AABCS1429B1ZB', manager: 'Raj Kumar', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-009', name: 'Delhi North', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '07AABCS1429B1ZC', manager: 'Priya Sharma', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-010', name: 'Bangalore Central', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '29AABCS1429B1ZD', manager: 'Arun Patel', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-011', name: 'Chennai South', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '33AABCS1429B1ZE', manager: 'Meena Joshi', status: 'Inactive', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-012', name: 'Hyderabad Central', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '36AABCS1429B1ZF', manager: 'Suresh Reddy', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-013', name: 'Pune West', subtext: 'RetailShop India', type: 'Regional Office', group: 'retailshop-india', gstin: '27AABCS1429B1ZG', manager: 'Anita Shah', status: 'Active', state: 'KA', address: 'Bangalore' },
  { id: 'ORG-014', name: 'Kolkata East', subtext: 'RetailShop India', type: 'Branch', group: 'retailshop-india', gstin: '19AABCS1429B1ZH', manager: 'Bikash Roy', status: 'Inactive', state: 'KA', address: 'Bangalore' },
]

type StatusFilter = "all" | "Active" | "Inactive"

function OrganizationUnit() {
  const [units, setUnits] = useState<OrgUnit[]>(orgUnits)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [unitToDelete, setUnitToDelete] = useState<OrgUnit | null>(null)

  // Create/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<OrgUnitFormData | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesStatus = statusFilter === "all" || unit.status === statusFilter
      const term = searchTerm.toLowerCase().trim()
      const matchesSearch =!term || [
        unit.name,
        unit.gstin,
        unit.type,
        unit.manager,
        unit.group,
        unit.state
      ].some(field => field?.toLowerCase().includes(term))
      return matchesStatus && matchesSearch
    })
  }, [units, searchTerm, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredUnits.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentUnits = filteredUnits.slice(startIndex, startIndex + rowsPerPage)

  const handleAddClick = () => {
    setEditingUnit(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (row: OrgUnit) => {
    setEditingUnit(row)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUnit(null)
  }

  const handleSaveUnit = async (data: OrgUnitFormData) => {
    setLoading(true)
    const isEdit =!!data.id
    try {
      // TODO: API call
      if (isEdit) {
        setUnits(prev => prev.map(u => u.id === data.id? {...u,...data } : u))
      } else {
        setUnits(prev => [...prev, {...data, id: `ORG-${Date.now()}`, subtext: 'RetailShop India', status: 'Active' }])
      }
      toast.success(`Org unit ${isEdit? 'updated' : 'created'} successfully!`)
      setIsModalOpen(false)
      setEditingUnit(null)
    } catch (error) {
      toast.error(`Failed to ${isEdit? 'update' : 'create'} org unit`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (row: OrgUnit) => {
    setUnitToDelete(row)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!unitToDelete) return
    setLoading(true)
    try {
      // TODO: API call
      setUnits(prev => prev.filter(u => u.id!== unitToDelete.id))
      toast.success(`${unitToDelete.name} deleted successfully`)
      setDeleteModalOpen(false)
      setUnitToDelete(null)
    } catch (error) {
      toast.error('Failed to delete org unit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[24px] text-[#043793] font-bold">Org Unit</h2>
          <p className="text-[13px] text-[#94A3B8]">
            {filteredUnits.length} {filteredUnits.length === 1? 'unit' : 'units'} across all groups
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-lg bg-[linear-gradient(#F3F4F6,#E5E7EB)] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:bg-gray-300 transition border border-gray-300">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleAddClick}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Plus size={18} />
            {loading? 'Adding...' : 'Add Org Unit'}
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
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
          <OrgUnitTable
            units={currentUnits}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
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
    unitName={unitToDelete?.name || ''}
    loading={loading}
    onClose={() => setDeleteModalOpen(false)}
    onConfirm={handleConfirmDelete}
  />
      </Modal>
    </div>
  )
}

export default OrganizationUnit