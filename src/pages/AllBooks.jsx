import React, { useContext, useState, useEffect } from 'react'
import EditBookModal from '../components/EditBookModal' // Make sure this path is correct
import { AppContext } from '../context/AppContext'

const AllBooks = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 10
  const context = useContext(AppContext)
  const [localBooks, setLocalBooks] = useState([])
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  
  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Fetch all books once when component mounts
  useEffect(() => {
    if (context?.fetchAllBooks) {
      context.fetchAllBooks().then(data => {
        if (data) {
          setLocalBooks(data)
        }
      })
    }
  }, [context]) // Depend on the entire context
  
  // Safety check for context
  if (!context) {
    return <div className="p-6">Loading...</div>
  }

  // Filter books by title, author, or category
  const filteredBooks = (localBooks || []).filter(
    book =>
      (book.title || book.bookName || '').toLowerCase().includes(search.toLowerCase()) ||
      (book.author || book.authorName || '').toLowerCase().includes(search.toLowerCase()) ||
      (book.category || book.genre || '').toLowerCase().includes(search.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
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
                <tr key={book.bookId}>
                  <td className="px-4 py-3">
                    <div className="w-12 h-16 bg-gray-100 rounded border overflow-hidden">
                      {book.imageUrl || book.image ? (
                        <img
                          src={book.imageUrl || book.image}
                          alt={book.title || book.bookName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{ display: book.coverImage || book.image ? 'none' : 'flex' }}>
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">#{book.bookId.toString().padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      
                      <span>{book.title || book.bookName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.author || book.authorName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{book.category || book.genre}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      book.availabilityStatus === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : book.availabilityStatus === 'Borrowed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.availabilityStatus || 'Available'}
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
                  <td colSpan={7} className="text-center py-8 text-gray-400">No books found.</td>
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