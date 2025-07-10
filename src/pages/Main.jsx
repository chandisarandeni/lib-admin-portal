import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditBookModal from '../components/EditBookModal'
import EditUserModal from '../components/EditUserModal'
import { AppContext } from '../context/AppContext'


const Main = () => {

  const navigate = useNavigate()
  const {fetchPopularBooks, books,fetchAllMembers} = useContext(AppContext)
  const [topChoices, setTopChoices] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchPopularBooks()
      .then(data => {
        setTopChoices(data)
      })
  }, [])

  useEffect(() => {
    fetchAllMembers()
    .then(data => {
      setMembers(data)
    })
  }, [])

  const statsData = [
    { title: 'Total Visitors', value: '1223', trend: '+12', color: 'red' },
    { title: 'Borrowed Books', value: '740', trend: '+25', color: 'red' },
    { title: 'Overdue Books', value: '22', trend: '+6', color: 'red' },
    { title: 'New Members', value: '60', trend: '+5', color: 'red' }
  ]

 



  

  const overdueBooks = [
    { id: 1, user: 'John Doe', book: 'React Guide', dueDate: '2023-06-15', fine: '$5.00' },
    { id: 2, user: 'Mike Johnson', book: 'CSS Mastery', dueDate: '2023-06-10', fine: '$8.50' },
    { id: 3, user: 'Sarah Wilson', book: 'HTML Basics', dueDate: '2023-06-12', fine: '$3.00' }
  ]

  const issuedBooks = [
    { id: 1, book: 'JavaScript Pro', user: 'Jane Smith', issueDate: '2023-06-20', returnDate: '2023-07-05' },
    { id: 2, book: 'React Guide', user: 'John Doe', issueDate: '2023-06-18', returnDate: '2023-07-03' },
    { id: 3, book: 'CSS Mastery', user: 'Mike Johnson', issueDate: '2023-06-15', returnDate: '2023-06-30' }
  ]

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Open modal with selected book
  const openEditModal = (book) => {
    setSelectedBook(book)
    setIsEditModalOpen(true)
  }

  // Close modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBook(null)
  }

  // Handle book update (you can update your books array here if needed)
  const handleEditBookSubmit = (updatedBook) => {
    // Example: update books array logic here if needed
    closeEditModal()
  }

  // Open user edit modal
  const openUserEditModal = (user) => {
    setSelectedUser(user)
    setIsUserEditModalOpen(true)
  }

  // Close user edit modal
  const closeUserEditModal = () => {
    setIsUserEditModalOpen(false)
    setSelectedUser(null)
  }

  // Handle user update (you can update your users array here if needed)
  const handleEditUserSubmit = (updatedUser) => {
    // Example: update users array logic here if needed
    closeUserEditModal()
  }

  return (
    <div className={`p-5 bg-gray-50 min-h-screen relative ${isEditModalOpen ? 'overflow-hidden' : ''}`}>
      {/* Only blur, no color overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditBookModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            book={selectedBook}
            onSubmit={handleEditBookSubmit}
          />
        </div>
      )}
      {isUserEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EditUserModal
            isOpen={isUserEditModalOpen}
            onClose={closeUserEditModal}
            user={selectedUser}
            onSubmit={handleEditUserSubmit}
          />
        </div>
      )}

      {/* Main content */}
      <div className={isEditModalOpen ? 'pointer-events-none select-none blur-sm' : ''}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Hello, <span className="text-[#8E552C]">Arafat!</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Jan 12, 2023 | Thursday, 11:00 AM</p>
          </div>
          <div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
              </div>
              <div>
                <span className="bg-[#8E552C] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Users and Books Lists */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">
          {/* Users List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Members List</h3>
              <div className="flex gap-2">
                <button onClick={() => {navigate('/dashboard/add-user')}} className="bg-[#B67242] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#8E552C] transition-colors">
                  Add New Member
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.slice(0, 4).map(user => (
                    <tr key={user.memberId}>
                      <td className="px-4 py-3 text-sm text-gray-900">#{user.memberId.toString().padStart(4, '0')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0"></div>
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <button onClick={() => openUserEditModal(user)} className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Books List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Books List</h3>
              <div className="flex gap-2">
                <button onClick={() => {navigate('/dashboard/add-books')}} className="bg-[#B67242] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#8E552C] transition-colors">
                  Add New Book
                </button>
                <button onClick={() => {navigate('/dashboard/all-books')}} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.slice(0, 4).map(book => (
                    <tr key={book.bookId}>
                      <td className="px-4 py-3 text-sm text-gray-900">#{book.bookId.toString().padStart(4, '0')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{book.bookName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{book.author}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          book.availabilityStatus === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : book.availabilityStatus === 'Borrowed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availabilityStatus}
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
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Choices Section */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Top Choices</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {topChoices.slice(0, 6).map((book, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-32 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  <img src={book.imageUrl} alt={book.bookName} className="w-full h-full object-cover rounded-lg" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">{book.bookName}</h4>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Overdue Books */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Overdue Book List</h3>
                <button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/dashboard/overdue-books')}
                >
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overdueBooks.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">#{item.id.toString().padStart(4, '0')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.user}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">#{(item.id + 100).toString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.book}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">Various</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.dueDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-800">
                          Overdue
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 font-semibold">{item.fine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - Books Issued & Statistics */}
          <div className="space-y-5">
            {/* Books Issued */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Books Issued</h3>
              </div>
              <div className="p-5 space-y-4">
                {issuedBooks.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800">{item.book}</h4>
                      <p className="text-xs text-gray-500">Issued to: {item.user}</p>
                      <p className="text-xs text-gray-500">Due: {item.returnDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Chart */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Visitors & Borrowers Statistics</h3>
              </div>
              <div className="p-5">
                <div className="h-40 flex items-end gap-2 mb-5">
                  {[20, 45, 35, 60, 40, 55, 30, 65, 25, 50, 35, 40].map((height, index) => (
                    <div 
                      key={index} 
                      className={`flex-1 rounded-t ${index % 2 === 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    <span className="text-gray-600">Visitors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded"></span>
                    <span className="text-gray-600">Borrowers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Main