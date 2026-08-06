import { useMemo, useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import BusinessLocationForm from './components/BusinessLocationForm'
import BusinessLocationTable, {
  type BusinessLocationRow,
} from './components/BusinessLocationTable'
import Pagination from '../components/Pagination'

const MOCK_LOCATIONS: BusinessLocationRow[] = [
  {
    id: 1,
    locationName: 'Mumbai Head Office',
    code: 'MHO-001',
    address: '12th Floor, World Trade Centre, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    status: 'Active',
  },
  {
    id: 2,
    locationName: 'Delhi NCR Branch',
    code: 'DNB-012',
    address: 'Suite 405, Connaught Place, Inner Circle',
    city: 'New Delhi',
    state: 'Delhi',
    status: 'Active',
  },
  {
    id: 3,
    locationName: 'Bangalore Tech Park',
    code: 'BLR-TECH',
    address: 'Plot 42, Electronic City Phase II',
    city: 'Bangalore',
    state: 'Karnataka',
    status: 'Active',
  },
  {
    id: 4,
    locationName: 'Chennai Warehouse',
    code: 'MAA-WH',
    address: 'Block G, Ambattur Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    status: 'Inactive',
  },
  {
    id: 5,
    locationName: 'Hyderabad Sales Office',
    code: 'HYD-SO',
    address: 'Lvl 4, My Home Twitza, HITECH City',
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'Active',
  },
]

const ROWS_PER_PAGE = 10

function BusinessLocationPage() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [locations] = useState<BusinessLocationRow[]>(MOCK_LOCATIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

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

  const handleEdit = (row: BusinessLocationRow) => {
    console.log('edit', row)
    setView('form')
  }

  const handleDelete = (row: BusinessLocationRow) => {
    console.log('delete', row)
  }

  if (view === 'form') {
    return <BusinessLocationForm onBack={() => setView('list')} onSaved={() => setView('list')} />
  }

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
            onClick={() => setView('form')}
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
        locations={currentLocations}
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
