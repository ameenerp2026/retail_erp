interface PaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium ${
              currentPage === page
               ? 'bg-[#0A2472] text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ›
        </button>
      </div>
    </div>
  )
}