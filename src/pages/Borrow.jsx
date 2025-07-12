import React, { useContext, useEffect, useState } from 'react'
import BookDetails from '../components/BookDetails'
import IssueBook from '../components/IssueBook'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Borrow = () => {
  const [search, setSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [recentPage, setRecentPage] = useState(1)
  const [overduePage, setOverduePage] = useState(1)
  const itemsPerPage = 5

  // Mock data for issued books (you can replace this with actual data from your API)
  const [issuedBooks, setIssuedBooks] = useState([])

  const {fetchIssuedBooks, books, allBooks, members, updateBorrowings, fetchAllBooks, fetchAllMembers} = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return // Prevent multiple simultaneous calls
      
      setIsLoading(true)
      try {
        // First ensure we have books and members data
        if ((!allBooks || allBooks.length === 0) || (!members || members.length === 0)) {
          await Promise.all([
            fetchAllBooks(),
            fetchAllMembers()
          ])
        }
        
        // Then fetch issued books
        const issuedBooksData = await fetchIssuedBooks()
        setIssuedBooks(issuedBooksData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on component mount to prevent infinite re-renders

  // Helper function to get book details by bookId
  const getBookDetails = (bookId) => {
    // Safety check for books array
    if (!books || books.length === 0) {
      return {
        bookName: 'Unknown Book',
        author: 'Unknown Author'
      }
    }
    
    const book = books.find(book => book.bookId === bookId)
    return book ? {
      bookName: book.bookName || 'Unknown Book',
      author: book.author || 'Unknown Author'
    } : {
      bookName: 'Unknown Book',
      author: 'Unknown Author'
    }
  }

  // Filter issued books based on search
  const filteredIssuedBooks = issuedBooks.filter(book => {
    const bookDetails = getBookDetails(book.bookId)
    return (
      (book.id && book.id.toString().includes(search)) ||
      (bookDetails.bookName && bookDetails.bookName.toString().includes(search)) ||
      (bookDetails.author && bookDetails.author.toString().includes(search)) ||
      (book.memberId && book.memberId.toString().includes(search)) ||
      (book.borrowerName && book.borrowerName.toString().includes(search))
    )
  })

  // Pagination for main table
  const totalPages = Math.ceil(filteredIssuedBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedIssuedBooks = filteredIssuedBooks.slice(startIndex, startIndex + itemsPerPage)

  // Get recently borrowed books (last 7 days) - show newly borrowed books
  const allRecentlyBorrowed = issuedBooks
    .filter(book => {
      // Use borrowingDate (which is the issue date in your main table)
      const issueDate = new Date(book.borrowingDate)
      const today = new Date()
      const diffTime = Math.abs(today - issueDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7 // Books issued in last 7 days
    })
    .sort((a, b) => new Date(b.borrowingDate) - new Date(a.borrowingDate)) // Sort by most recent first

  // Pagination for recently borrowed
  const recentTotalPages = Math.ceil(allRecentlyBorrowed.length / itemsPerPage)
  const recentStartIndex = (recentPage - 1) * itemsPerPage
  const recentlyBorrowed = allRecentlyBorrowed.slice(recentStartIndex, recentStartIndex + itemsPerPage)

  // Get all overdue books - filter books where return date has passed AND book is not returned
  const allOverdueBooks = issuedBooks.filter(book => {
    // Check if book has a return date
    if (!book.returnDate) {
      return false
    }
    
    // Check if book is already returned - exclude returned books from overdue list
    if (book.returnStatus && book.returnStatus.toLowerCase() === 'returned') {
      return false
    }
    
    // Check if return date has passed
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(book.returnDate)
    dueDate.setHours(0, 0, 0, 0)
    
    const isOverdue = dueDate < today
    
    // Debug log to see what's happening
    console.log(`Book ${book.bookId} Overdue Check:`, {
      returnDate: book.returnDate,
      returnStatus: book.returnStatus,
      today: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      isOverdue: isOverdue,
      isReturned: book.returnStatus?.toLowerCase() === 'returned'
    })
    
    return isOverdue
  })

  // Pagination for overdue books
  const overdueTotalPages = Math.ceil(allOverdueBooks.length / itemsPerPage)
  const overdueStartIndex = (overduePage - 1) * itemsPerPage
  const overdueBooks = allOverdueBooks.slice(overdueStartIndex, overdueStartIndex + itemsPerPage)

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'active':
      case 'borrowed':
      case 'issued':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'returned':
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'available':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleViewDetails = (book) => {
    // Get book details from the catalog and merge with issued book data
    const bookDetails = getBookDetails(book.bookId)
    const enhancedBook = {
      ...book,
      ...bookDetails
    }
    setSelectedBook(enhancedBook)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBook(null)
  }

  const handleOpenIssueModal = () => {
    setIsIssueModalOpen(true)
  }

  const handleCloseIssueModal = () => {
    setIsIssueModalOpen(false)
  }

  // Handle when a book is returned from the BookDetails modal
  const handleBookReturned = async () => {
    try {
      // Refresh the issued books data to reflect the change
      const updatedIssuedBooks = await fetchIssuedBooks()
      setIssuedBooks(updatedIssuedBooks)
    } catch (error) {
      console.error('Error refreshing issued books:', error)
    }
  }

  // Handle when a book is issued from the IssueBook modal
  const handleBookIssued = async () => {
    try {
      // Refresh the issued books data to reflect the new issue
      const updatedIssuedBooks = await fetchIssuedBooks()
      setIssuedBooks(updatedIssuedBooks)
      // Don't show success toast here - it's already shown in IssueBook component
    } catch (error) {
      console.error('Error refreshing issued books:', error)
      toast.error('Book issued but failed to refresh data. Please refresh the page.')
    }
  }

  // Handle return book functionality
  const handleReturnBook = async (book) => {
    // Show loading toast
    const loadingToast = toast.loading('Returning book...')
    
    try {
      // Create updated borrowing object with all existing fields but change status to "Returned"
      const updatedBorrowing = {
        ...book,
        returnStatus: "Returned",
        // Keep all other fields unchanged
        id: book.borrowingId,
        bookId: book.bookId,
        memberId: book.memberId,
        borrowerName: book.borrowerName,
        borrowerEmail: book.borrowerEmail,
        borrowingDate: book.borrowingDate,
        returnDate: book.returnDate
      }

      // Call updateBorrowings function with borrowing object and ID
      await updateBorrowings(updatedBorrowing, book.borrowingId)

      // Refresh the issued books data to reflect the change
      const updatedIssuedBooks = await fetchIssuedBooks()
      setIssuedBooks(updatedIssuedBooks)
      
      // Show success toast
      toast.success(`Book ${book.bookId} returned successfully!`, {
        id: loadingToast
      })
      
      console.log(`Book ${book.bookId} returned successfully`)
    } catch (error) {
      console.error('Error returning book:', error)
      
      // Show error toast
      toast.error('Failed to return book. Please try again.', {
        id: loadingToast
      })
    }
  }

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }

    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm border rounded ${
                page === currentPage
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Search and Issue Book Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Borrowing Management</h1>
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by book name, author, member ID, or borrower..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
        <button 
          onClick={handleOpenIssueModal}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Issue Book
        </button>
      </div>

      {/* Main Table - All Issued Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Issued Books ({filteredIssuedBooks.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedIssuedBooks.map(book => {
                const bookDetails = getBookDetails(book.bookId)
                return (
                <tr key={book.bookId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-lg">#{book.bookId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{bookDetails.bookName}</div>
                      <div className="text-sm text-gray-500">by {bookDetails.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-600">{book.memberId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{book.borrowerName}</div>
                      <div className="text-sm text-gray-500">{book.borrowerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(book.borrowingDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(book.returnDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.returnStatus)}`}>
                      {book.returnStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {book.returnStatus?.toLowerCase() === 'returned' ? (
                        <span className="text-gray-400 font-medium">Returned</span>
                      ) : (
                        <button 
                          onClick={() => handleReturnBook(book)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Return
                        </button>
                      )}
                      <button className="text-green-600 hover:text-green-800 font-medium">Renew</button>
                      <button 
                        onClick={() => handleViewDetails(book)}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
                )
              })}
              {paginatedIssuedBooks.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">No issued books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Borrowed Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recently Borrowed ({allRecentlyBorrowed.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentlyBorrowed.map(book => {
                  const bookDetails = getBookDetails(book.bookId)
                  return (
                  <tr key={`recent-${book.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{bookDetails.bookName}</div>
                      <div className="text-xs text-gray-500">{bookDetails.author}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.borrowerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(book.borrowingDate)}</td>
                  </tr>
                  )
                })}
                {recentlyBorrowed.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400 text-sm">No recent borrowings.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={recentPage}
            totalPages={recentTotalPages}
            onPageChange={setRecentPage}
          />
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-red-600">Overdue Books ({allOverdueBooks.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Borrower</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueBooks.map(book => {
                  const bookDetails = getBookDetails(book.bookId)
                  return (
                  <tr key={`overdue-${book.id}`} className="hover:bg-red-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{bookDetails.bookName}</div>
                      <div className="text-xs text-gray-500">{bookDetails.author}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.borrowerName}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{formatDate(book.returnDate)}</td>
                  </tr>
                  )
                })}
                {overdueBooks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400 text-sm">No overdue books.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={overduePage}
            totalPages={overdueTotalPages}
            onPageChange={setOverduePage}
          />
        </div>
      </div>

      {/* BookDetails Modal */}
      <BookDetails 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
        onBookReturned={handleBookReturned}
      />

      {/* IssueBook Modal */}
      <IssueBook 
        isOpen={isIssueModalOpen}
        onClose={handleCloseIssueModal}
        books={allBooks || books} // Pass all books (use allBooks if available, fallback to books)
        members={members} // Pass all members/users
        onBookIssued={handleBookIssued} // Callback to refresh data after issuing
      />
    </div>
  )
}

export default Borrow