import React, { useState } from 'react'
import EditBookModal from '../components/EditBookModal' // Make sure this path is correct

// Example random books data
const initialBooks = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  title: `Book Title ${i + 1}`,
  author: `Author ${i + 1}`,
  category: ['Technology', 'Fiction', 'Science'][i % 3],
  status: i % 4 === 0 ? 'Borrowed' : (i % 5 === 0 ? 'Overdue' : 'Available')
}))

const AllBooks = () => {
  const [search, setSearch] = useState('')
  const [books] = useState(initialBooks)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 15

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  // Filter books by title, author, or category
  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getPaginationNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Modal handlers
  const openEditModal = (book) => {
    setSelectedBook(book)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBook(null)
  }

  return (
    <div className="relative">
      {/* Modal and blur background */}
      {isEditModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <EditBookModal
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              book={selectedBook}
              // onSubmit={...} // Add if you want to handle submit
            />
          </div>
        </>
      )}

      <div className={`p-6 ${isEditModalOpen ? 'pointer-events-none select-none blur-sm' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">All Books</h2>
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-64"
          />
        </div>

        {/* Results info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBooks.map(book => (
                <tr key={book.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">#{book.id.toString().padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.category}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      book.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : book.status === 'Borrowed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => openEditModal(book)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {currentBooks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {getPaginationNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBooks