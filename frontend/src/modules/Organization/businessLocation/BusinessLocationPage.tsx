import { useMemo, useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import BusinessLocationForm from './components/BusinessLocationForm'
import toast from 'react-hot-toast'
import type { BusinessLocationRow } from '../../../types/admin/organization/businessLocation' 
import BusinessLocationTable from './components/BusinessLocationTable'
import Pagination from '../components/Pagination'
import { useBusinessLocations ,useDeleteBusinessLocation} from '@/hooks/admin/organization/useBusinessLocation'



const ROWS_PER_PAGE = 10
type ViewMode = 'list' | 'create' | 'edit'


function BusinessLocationPage() {
  const deleteMutation = useDeleteBusinessLocation()
  const [view, setView] = useState<ViewMode>('list')
const [selectedLocation, setSelectedLocation] =
  useState<BusinessLocationRow | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)


const {
  data: locations = [],
  //isLoading: locationsLoading,
} = useBusinessLocations()

const {
  data: businessLocations = [],
  //isLoading: isBusinessLocationsLoading,
  //isError: isBusinessLocationsError,
 // error: businessLocationsError,
} = useBusinessLocations();

console.log("🔥 Business Locations:", businessLocations);
  



  const filteredLocations = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return locations
    return locations.filter((loc) =>
      [loc.locationName, loc.code, loc.city, loc.state].some((field) =>
        field.toLowerCase().includes(term),
      ),
    )
  }, [locations, searchTerm])

  const totalPages = Math.ceil(filteredLocations.length / ROWS_PER_PAGE)
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const currentLocations = filteredLocations.slice(startIndex, startIndex + ROWS_PER_PAGE)

const handleCreate = () => {
  setSelectedLocation(null)
  setView('create')
}

  const handleEdit = (row: BusinessLocationRow) => {
  setSelectedLocation(row)
  setView('edit')
}
  

const handleDelete = async (
  row: BusinessLocationRow
) => {
  try {
    await deleteMutation.mutateAsync(row.id)

    toast.success(
      'Business location deleted successfully'
    )
  } catch (error) {
    console.error('Delete error:', error)

    toast.error(
      'Failed to delete business location'
    )
  }
}
  if (view === 'create') {
  return (
    <BusinessLocationForm
      onBack={() => setView('list')}
      onSaved={() => setView('list')}
    />
  )
}

if (view === 'edit' && selectedLocation) {
  return (
    <BusinessLocationForm
      location={selectedLocation}
      onBack={() => setView('list')}
      onSaved={() => setView('list')}
    />
  )
}
  // if (view === 'form') {
  //   return <BusinessLocationForm onBack={() => setView('list')} onSaved={() => setView('list')} />
  // }

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Business Locations</h2>
          <p className="page-subtitle">
            Manage your organization's physical sites and hubs across regions.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            
               onClick={
                handleCreate}
            className="flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(#093055,#043793)] px-4 text-sm font-medium text-white transition hover:opacity-95"
          >
            <Plus size={18} />
            Add Location
          </button>



          
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search location name, code or city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-[#043793] focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      <BusinessLocationTable
        locations={businessLocations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Footer / Pagination */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-500 sm:text-sm">
          Showing {currentLocations.length} of {filteredLocations.length} locations
        </p>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={startIndex + ROWS_PER_PAGE}
        totalItems={filteredLocations.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default BusinessLocationPage
