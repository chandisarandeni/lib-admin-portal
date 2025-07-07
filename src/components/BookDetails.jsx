import React from 'react'

const BookDetails = ({ isOpen, onClose, book }) => {
  if (!isOpen || !book) return null


  const formatDate = (dateString) => {
    if (!dateString) return 'Not available'
    console.log('Formatting date:', dateString)
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected:', dateString)
        return 'Invalid date'
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'active':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'Overdue':
      case 'overdue':
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'Returned':
      case 'returned':
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800'
      case 'Lost':
      case 'lost':
      case 'LOST':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) {
      console.log('No due date provided')
      return null
    }
    
    console.log('Raw due date:', dueDate)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0) // Reset time to start of day
    
    console.log('Today (normalized):', today)
    console.log('Due date (normalized):', due)
    
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    console.log('Difference in milliseconds:', diffTime)
    console.log('Days remaining calculated:', diffDays)
    
    return diffDays
  }

  const daysRemaining = getDaysRemaining(book.returnDate)

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Book Borrowing Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Book ID: #{book.bookId}</p>
              </div>
            </div>

            {/* Book & Borrower Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Book Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Title</label>
                    <p className="text-gray-900 font-medium">{book.bookName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Author</label>
                    <p className="text-gray-900">{book.author}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.returnStatus)}`}>
                      {book.returnStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Borrower Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrower Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{book.borrowerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{book.borrowerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Borrowing Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Timeline</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Issue Date</label>
                    <p className="text-gray-900">{formatDate(book.borrowingDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Due Date</label>
                    <p className="text-gray-900">{formatDate(book.returnDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Days Remaining</label>
                    {daysRemaining !== null ? (
                      <p className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
                         daysRemaining === 0 ? 'Due today' : 
                         `${daysRemaining} days remaining`}
                      </p>
                    ) : (
                      <p className="text-gray-500">No due date available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Renew Book
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Return Book
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails