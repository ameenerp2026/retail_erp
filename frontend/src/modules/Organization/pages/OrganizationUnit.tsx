import { useState } from "react"
import { Download, Plus, Search } from "lucide-react"
import OrgUnitTable from "../components/OrgUnitTable"
import Pagination from "../components/Pagination"
import OrgUnitModal from "../components/OrgUnitModal"
import { OrgUnitFormData } from "@/components/forms/validate.schema"
import DeleteConfirmModal from "../components/DeleteConfirmModal"
import toast from "react-hot-toast"

export interface OrgUnit extends OrgUnitFormData {
  id: string
  subtext: string
  status: 'Active' | 'Inactive'
}


const orgUnits : OrgUnit[]= [
  { id: 'ORG-001', name: 'HQ - Mumbai', subtext: 'RetailShop India', type: 'Head Office',group: 'retailshop-india',  gstin: '27AABCS1429B1ZB', manager: 'Raj Kumar', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-002', name: 'Delhi North', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '07AABCS1429B1ZC', manager: 'Priya Sharma', status: 'Active','state':'TN','address':'Chennai'  },
  { id: 'ORG-003', name: 'Bangalore Central', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '29AABCS1429B1ZD', manager: 'Arun Patel', status: 'Active','state':'KA','address':'Bangalore'},
  { id: 'ORG-004', name: 'Chennai South', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '33AABCS1429B1ZE', manager: 'Meena Joshi', status: 'Inactive','state':'KA','address':'Bangalore' },
  { id: 'ORG-005', name: 'Hyderabad Central', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '36AABCS1429B1ZF', manager: 'Suresh Reddy', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-006', name: 'Pune West', subtext: 'RetailShop India', type: 'Regional Office',group: 'retailshop-india',  gstin: '27AABCS1429B1ZG', manager: 'Anita Shah', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-007', name: 'Kolkata East', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '19AABCS1429B1ZH', manager: 'Bikash Roy', status: 'Inactive','state':'KA','address':'Bangalore' },
   { id: 'ORG-008', name: 'HQ - Mumbai', subtext: 'RetailShop India', type: 'Head Office',group: 'retailshop-india',  gstin: '27AABCS1429B1ZB', manager: 'Raj Kumar', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-009', name: 'Delhi North', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '07AABCS1429B1ZC', manager: 'Priya Sharma', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-010', name: 'Bangalore Central', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '29AABCS1429B1ZD', manager: 'Arun Patel', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-011', name: 'Chennai South', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '33AABCS1429B1ZE', manager: 'Meena Joshi', status: 'Inactive','state':'KA','address':'Bangalore' },
  { id: 'ORG-012', name: 'Hyderabad Central', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '36AABCS1429B1ZF', manager: 'Suresh Reddy', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-013', name: 'Pune West', subtext: 'RetailShop India', type: 'Regional Office',group: 'retailshop-india',  gstin: '27AABCS1429B1ZG', manager: 'Anita Shah', status: 'Active','state':'KA','address':'Bangalore' },
  { id: 'ORG-014', name: 'Kolkata East', subtext: 'RetailShop India', type: 'Branch',group: 'retailshop-india',  gstin: '19AABCS1429B1ZH', manager: 'Bikash Roy', status: 'Inactive','state':'KA','address':'Bangalore' },
]


function OrganizationUnit() {
  //delete org unit
const [units, setUnits] = useState<OrgUnit[]>(orgUnits)
const [deleteModalOpen, setDeleteModalOpen] = useState(false)
const [unitToDelete, setUnitToDelete] = useState<OrgUnit | null>(null)

const [currentPage, setCurrentPage] = useState(1)
const [rowsPerPage] = useState(10)
const totalPages = Math.ceil(units.length / rowsPerPage)
const startIndex = (currentPage - 1) * rowsPerPage
const endIndex = startIndex + rowsPerPage
const currentUnits = units.slice(startIndex, endIndex)
//add org unit 
const [isModalOpen, setIsModalOpen] = useState(false)
const [editingUnit, setEditingUnit] = useState<OrgUnitFormData | null>(null)
const [loading, setLoading] = useState(false)

 const handleAddClick = () => {
    setEditingUnit(null)
    setIsModalOpen(true) // Opens modal
  }
  //Edit org unit
  const handleEditClick = (row: OrgUnit) => {
    setEditingUnit(row) // Save the clicked row
    setIsModalOpen(true) // Open modal on this page
  }
  const handleCloseModal = () => {
    setIsModalOpen(false) // Closes modal
    setEditingUnit(null)
  }
  
  const handleSaveUnit = async (data: OrgUnitFormData) => {
    setLoading(true)
    const isEdit = !!data.id
    try {
      // const url = isEdit ? `/api/org-units/${data.id}` : '/api/org-units'
      // const method = isEdit ? 'PUT' : 'POST'
      //TODO : replace with API call here
      //  const res = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // if (!res.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} org unit`)
      toast.success(`Org unit ${isEdit ? 'updated' : 'created'} successfully!`)
      setIsModalOpen(false)
      setEditingUnit(null)
      // TODO: refresh your table data here
      
    } catch (error) {
      // Error toast
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} org unit`)
    } finally {
      setLoading(false)
    }
  }
  //delete org handler
  const handleDeleteClick = (row: OrgUnit) => {
    setUnitToDelete(row)
    setDeleteModalOpen(true)
  }
  const handleConfirmDelete = async () => {
    if (!unitToDelete) return
    setLoading(true)
    try {
      // TODO: API call
      // await fetch(`/api/org-units/${unitToDelete.id}`, { method: 'DELETE' })
      
      setUnits(prev => prev.filter(u => u.id !== unitToDelete.id))
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
          <h2 className="text-[24px] text-[#043793] font-bold">
            Org Unit
          </h2>
          <p className="text-[13px] text-[#94A3B8]">{units.length} {units.length === 1? 'unit' : 'units'} across all groups</p>
        </div>
        <div className="flex gap-3">
          <button className="h-10 px-4 rounded-lg bg-[linear-gradient(#F3F4F6,#E5E7EB)] text-gray-700 flex items-center gap-1.5 text-sm font-medium hover:bg-gray-300 transition border border-gray-300">
            <Download size={16} />
            Export
          </button>
          <button onClick={handleAddClick} disabled={loading} className="h-10 px-4 rounded-xl bg-[linear-gradient(#093055,#043793)] text-white flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
            <Plus size={18} />
            {loading ? 'Adding...' : 'Add Org Unit'}
          </button>
          <OrgUnitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUnit}
        editData={editingUnit}
        loading={loading}
      />
        </div>
      </div>
      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search units, GSTIN..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 h-8 rounded-md bg-[linear-gradient(#093055,#043793)] text-white text-sm font-medium">
            All
          </button>
          <button className="px-4 h-8 rounded-md border border-gray-300 bg-white text-[oklch(0.7_0.03_257.01)] text-sm font-medium hover:bg-gray-50">
            Active
          </button>
          <button className="px-4 h-8 rounded-md border border-gray-300 bg-white text-[oklch(0.7_0.03_257.01)] text-sm font-medium hover:bg-gray-50">
            Inactive
          </button>
        </div>
      </div>
      {/* Table */}
     <OrgUnitTable units={currentUnits} onEdit={handleEditClick} onDelete={handleDeleteClick} loading={loading} />
     {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        unitName={unitToDelete?.name || ''}
        loading={loading} />
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={units.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default OrganizationUnit