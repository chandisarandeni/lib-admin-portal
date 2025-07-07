import React, { useState } from 'react'
import BookDetails from '../components/BookDetails'
import IssueBook from '../components/IssueBook'

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
  const issuedBooks = [
    {
      id: 1,
      bookName: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowerName: "John Doe",
      borrowerEmail: "john@example.com",
      memberId: "LIB001",
      issueDate: "2025-07-02",
      dueDate: "2025-07-15",
      status: "Active"
    },
    {
      id: 2,
      bookName: "To Kill a Mockingbird",
      author: "Harper Lee",
      borrowerName: "Jane Smith",
      borrowerEmail: "jane@example.com",
      memberId: "LIB002",
      issueDate: "2025-06-20",
      dueDate: "2025-07-20",
      status: "Active"
    },
    {
      id: 3,
      bookName: "1984",
      author: "George Orwell",
      borrowerName: "Bob Johnson",
      borrowerEmail: "bob@example.com",
      memberId: "LIB003",
      issueDate: "2025-05-10",
      dueDate: "2025-06-10",
      status: "Overdue"
    },
    {
      id: 4,
      bookName: "Pride and Prejudice",
      author: "Jane Austen",
      borrowerName: "Alice Brown",
      borrowerEmail: "alice@example.com",
      memberId: "LIB004",
      issueDate: "2025-07-01",
      dueDate: "2025-08-01",
      status: "Active"
    },
    {
      id: 5,
      bookName: "The Catcher in the Rye",
      author: "J.D. Salinger",
      borrowerName: "Charlie Wilson",
      borrowerEmail: "charlie@example.com",
      memberId: "LIB005",
      issueDate: "2025-05-01",
      dueDate: "2025-06-01",
      status: "Overdue"
    }
    ,
    {
      id: 6,
      bookName: "The Catcher in the Rye",
      author: "J.D. Salinger",
      borrowerName: "Charlie Wilson",
      borrowerEmail: "charlie@example.com",
      memberId: "LIB005",
      issueDate: "2025-05-01",
      dueDate: "2025-06-01",
      status: "Overdue"
    },
    {
      id: 7,
      bookName: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowerName: "John Doe",
      borrowerEmail: "john@example.com",
      memberId: "LIB001",
      issueDate: "2025-06-25",
      dueDate: "2025-07-15",
      status: "Active"
    },
    {
      id: 8,
      bookName: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowerName: "John Doe",
      borrowerEmail: "john@example.com",
      memberId: "LIB001",
      issueDate: "2025-06-15",
      dueDate: "2025-07-15",
      status: "Active"
    },
    {
      id: 9,
      bookName: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowerName: "John Doe",
      borrowerEmail: "john@example.com",
      memberId: "LIB001",
      issueDate: "2025-06-10",
      dueDate: "2025-07-15",
      status: "Active"
    },
    {
      id: 10,
      bookName: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      borrowerName: "John Doe",
      borrowerEmail: "john@example.com",
      memberId: "LIB001",
      issueDate: "2025-05-28",
      dueDate: "2025-07-15",
      status: "Active"
    },
  ]

  // Filter issued books based on search
  const filteredIssuedBooks = issuedBooks.filter(book =>
    book.bookName.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.borrowerName.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination for main table
  const totalPages = Math.ceil(filteredIssuedBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedIssuedBooks = filteredIssuedBooks.slice(startIndex, startIndex + itemsPerPage)

  // Get recently borrowed books (last 7 days) - increased to show more items
  const allRecentlyBorrowed = issuedBooks
    .filter(book => {
      const issueDate = new Date(book.issueDate)
      const today = new Date()
      const diffTime = Math.abs(today - issueDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    })

  // Pagination for recently borrowed
  const recentTotalPages = Math.ceil(allRecentlyBorrowed.length / itemsPerPage)
  const recentStartIndex = (recentPage - 1) * itemsPerPage
  const recentlyBorrowed = allRecentlyBorrowed.slice(recentStartIndex, recentStartIndex + itemsPerPage)

  // Get all overdue books
  const allOverdueBooks = issuedBooks.filter(book => book.status === "Overdue")

  // Pagination for overdue books
  const overdueTotalPages = Math.ceil(allOverdueBooks.length / itemsPerPage)
  const overdueStartIndex = (overduePage - 1) * itemsPerPage
  const overdueBooks = allOverdueBooks.slice(overdueStartIndex, overdueStartIndex + itemsPerPage)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
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

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, label }) => {
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
              placeholder="Search by book title, author, or borrower..."
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
              {paginatedIssuedBooks.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-lg">#{book.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{book.bookName}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
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
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(book.issueDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(book.dueDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Return</button>
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
              ))}
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
                {recentlyBorrowed.map(book => (
                  <tr key={`recent-${book.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{book.bookName}</div>
                      <div className="text-xs text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.borrowerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(book.issueDate)}</td>
                  </tr>
                ))}
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
                {overdueBooks.map(book => (
                  <tr key={`overdue-${book.id}`} className="hover:bg-red-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 text-sm">{book.bookName}</div>
                      <div className="text-xs text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{book.borrowerName}</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">{formatDate(book.dueDate)}</td>
                  </tr>
                ))}
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
      />

      {/* IssueBook Modal */}
      <IssueBook 
        isOpen={isIssueModalOpen}
        onClose={handleCloseIssueModal}
      />
    </div>
  )
}

export default Borrow