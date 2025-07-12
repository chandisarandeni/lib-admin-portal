import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const BookDetails = ({ isOpen, onClose, book, onBookReturned }) => {
  const { updateBorrowings, fetchIssuedBooks } = useContext(AppContext)
  
  if (!isOpen || !book) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Borrowed':
        return 'bg-green-100 text-green-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      case 'Returned':
        return 'bg-blue-100 text-blue-800'
      case 'Available':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining(book.returnDate)

  // Get the image URL with better fallback logic
  const getImageUrl = () => {
    // Check various possible image property names
    const possibleImageProps = [
      book.imageUrl,
      book.coverImage, 
      book.image,
      book.bookImageUrl,
      book.cover,
      book.thumbnail,
      book.picture
    ];
    
    // Find the first non-empty image URL
    const imageUrl = possibleImageProps.find(url => url && url.trim() !== '');
    
    // If we have an image URL, make sure it's a valid URL
    if (imageUrl) {
      // If it's a relative path, you might need to prepend your base URL
      if (imageUrl.startsWith('/')) {
        return `http://localhost:8080${imageUrl}`;
      }
      // If it doesn't start with http/https, assume it needs the full path
      if (!imageUrl.startsWith('http')) {
        return `http://localhost:8080/api/v1/books/image/${imageUrl}`;
      }
      return imageUrl;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  console.log('Final image URL:', imageUrl, 'Book data:', book);

  // Handle return book functionality
  const handleReturnBook = async () => {
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

      // Show success toast
      toast.success(`Book ${book.bookId} returned successfully!`, {
        id: loadingToast
      })
      
      // Notify parent component to refresh data
      if (onBookReturned) {
        onBookReturned()
      }
      
      // Close the modal after successful return
      onClose()
      
      console.log(`Book ${book.bookId} returned successfully`)
    } catch (error) {
      console.error('Error returning book:', error)
      
      // Show error toast
      toast.error('Failed to return book. Please try again.', {
        id: loadingToast
      })
    }
  }

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
                <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-200">
                  {/* Debug: Log the image URLs */}
                  {console.log('Book image debug:', {
                    imageUrl: book.imageUrl,
                    coverImage: book.coverImage,
                    image: book.image,
                    bookName: book.bookName,
                    finalImageUrl: imageUrl
                  })}
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={book.bookName || 'Book cover'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        console.error('Trying alternative image sources...');
                        // If image fails to load, show the fallback
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src);
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center ${
                      imageUrl ? 'hidden' : 'flex'
                    }`}
                  >
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(book.returnStatus || book.availabilityStatus)}`}>
                      {book.returnStatus || book.availabilityStatus || 'Unknown'}
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
                    <label className="block text-sm font-medium text-gray-600">Return Date</label>
                    <p className="text-gray-900">{formatDate(book.returnDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Days Remaining</label>
                    <p className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
                       daysRemaining === 0 ? 'Due today' : 
                       `${daysRemaining} days remaining`}
                    </p>
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
            {book.returnStatus?.toLowerCase() === 'returned' ? (
              <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                Already Returned
              </span>
            ) : (
              <button 
                onClick={handleReturnBook}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Return Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails