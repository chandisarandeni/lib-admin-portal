import React, { useState } from 'react'

const IssueBook = ({ isOpen, onClose }) => {
  const [bookSearch, setBookSearch] = useState('')
  const [selectedBook, setSelectedBook] = useState(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')

  // Mock data for available books
  const availableBooks = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227", available: 3 },
    { id: 2, title: "Dune", author: "Frank Herbert", isbn: "978-0441172719", available: 2 },
    { id: 3, title: "Foundation", author: "Isaac Asimov", isbn: "978-0553293357", available: 1 },
    { id: 4, title: "Neuromancer", author: "William Gibson", isbn: "978-0441569595", available: 2 },
    { id: 5, title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", isbn: "978-0441478125", available: 1 }
  ]

  // Mock data for members
  const members = [
    { id: 1, name: "John Smith", email: "john.smith@email.com", membershipId: "LIB001", phone: "+1234567890" },
    { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", membershipId: "LIB002", phone: "+1234567891" },
    { id: 3, name: "Mike Davis", email: "mike.davis@email.com", membershipId: "LIB003", phone: "+1234567892" },
    { id: 4, name: "Emily Brown", email: "emily.b@email.com", membershipId: "LIB004", phone: "+1234567893" },
    { id: 5, name: "Alex Wilson", email: "alex.wilson@email.com", membershipId: "LIB005", phone: "+1234567894" }
  ]

  // Filter books based on search
  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
    book.id.toString().includes(bookSearch.toLowerCase()) ||
    book.isbn.toLowerCase().includes(bookSearch.toLowerCase())
  )

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.membershipId.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  // Calculate due date (14 days from issue date)
  const calculateDueDate = (issueDate) => {
    const date = new Date(issueDate)
    date.setDate(date.getDate() + 14)
    return date.toISOString().split('T')[0]
  }

  // Handle issue date change
  const handleIssueDateChange = (e) => {
    const newIssueDate = e.target.value
    setIssueDate(newIssueDate)
    setDueDate(calculateDueDate(newIssueDate))
  }

  // Handle member selection
  const handleMemberSelect = (member) => {
    setSelectedMember(member)
    setMemberSearch(member.name)
  }

  // Handle book selection
  const handleBookSelect = (book) => {
    setSelectedBook(book)
    setBookSearch(book.title)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedBook || !selectedMember || !issueDate || !dueDate) {
      alert('Please fill in all required fields')
      return
    }

    // Here you would typically make an API call to issue the book
    console.log('Issuing book:', {
      bookId: selectedBook.id,
      memberId: selectedMember.id,
      issueDate,
      dueDate
    })

    alert('Book issued successfully!')
    handleReset()
    onClose()
  }

  // Reset form
  const handleReset = () => {
    setBookSearch('')
    setSelectedBook(null)
    setMemberSearch('')
    setSelectedMember(null)
    setIssueDate(new Date().toISOString().split('T')[0])
    setDueDate('')
  }

  if (!isOpen) return null

  // Set initial due date if not set
  if (!dueDate && issueDate) {
    setDueDate(calculateDueDate(issueDate))
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Issue Book</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Book Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Selection</h3>
                
                {/* Book Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Book <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by book ID, title, author, or ISBN..."
                      value={bookSearch}
                      onChange={(e) => {
                        setBookSearch(e.target.value)
                        setSelectedBook(null)
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Book Search Results */}
                {bookSearch && !selectedBook && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map(book => (
                        <div
                          key={book.id}
                          onClick={() => handleBookSelect(book)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-600">by {book.author}</div>
                          <div className="text-sm text-gray-600">ID: {book.id} | ISBN: {book.isbn}</div>
                          <div className="text-sm text-green-600 font-medium">Available: {book.available} copies</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">No books found</div>
                    )}
                  </div>
                )}

                {/* Selected Book Details */}
                {selectedBook && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Selected Book</h4>
                    <p className="text-gray-700"><strong>Title:</strong> {selectedBook.title}</p>
                    <p className="text-gray-700"><strong>Author:</strong> {selectedBook.author}</p>
                    <p className="text-gray-700"><strong>ID:</strong> {selectedBook.id}</p>
                    <p className="text-gray-700"><strong>ISBN:</strong> {selectedBook.isbn}</p>
                    <p className="text-green-600 font-medium"><strong>Available copies:</strong> {selectedBook.available}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBook(null)
                        setBookSearch('')
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Book
                    </button>
                  </div>
                )}
              </div>

              {/* Issue & Due Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={handleIssueDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Member Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Selection</h3>
                
                {/* Member Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Member <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by name, ID, or email..."
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value)
                        setSelectedMember(null)
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Member Search Results */}
                {memberSearch && !selectedMember && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => (
                        <div
                          key={member.id}
                          onClick={() => handleMemberSelect(member)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-600">ID: {member.membershipId}</div>
                          <div className="text-sm text-gray-600">{member.email}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">No members found</div>
                    )}
                  </div>
                )}

                {/* Selected Member Details */}
                {selectedMember && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Selected Member</h4>
                    <p className="text-gray-700"><strong>Name:</strong> {selectedMember.name}</p>
                    <p className="text-gray-700"><strong>ID:</strong> {selectedMember.membershipId}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {selectedMember.email}</p>
                    <p className="text-gray-700"><strong>Phone:</strong> {selectedMember.phone}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMember(null)
                        setMemberSearch('')
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Member
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Issue Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IssueBook