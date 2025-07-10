import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditUserModal from '../components/EditUserModal'
import { AppContext } from '../context/AppContext'

// Example random members data
const members = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  address: `${123 + i} Main Street, City ${i + 1}`,
  books: Math.floor(Math.random() * 10) + 1,
  role: ['Student', 'Faculty', 'Staff'][i % 3],
  status: i % 4 === 0 ? 'Inactive' : 'Active'
}))

const AllUsers = () => {
  const [search, setSearch] = useState('')
  const [members, setMembers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 15
  const {fetchAllMembers} = useContext(AppContext)

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Filter users by name, role, or email
  const filteredUsers = members.filter(
    user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    const fetchMembers = async () => {
      const allMembers = await fetchAllMembers()
      setMembers(allMembers)
    }
    fetchMembers()
  }, [fetchAllMembers])

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
  const openEditModal = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Delete user:', user)
      // Handle user deletion logic here
    }
  }

  const navigate = useNavigate()

  return (
    <div className="relative">
      {/* Modal and blur background */}
      {isEditModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <EditUserModal
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              user={selectedUser}
              onSubmit={(updatedUser) => {
                console.log('Updated user:', updatedUser)
                // Handle user update logic here
              }}
            />
          </div>
        </>
      )}

      <div className={`p-6 ${isEditModalOpen ? 'pointer-events-none select-none blur-sm' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full md:w-64"
            />
            <button
              onClick={() => {navigate('/dashboard/add-user')}}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map(user => (
                <tr key={user.memberId}>
                  <td className="px-4 py-3 text-sm text-gray-900">#{user.memberId.toString().padStart(4, '0')}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0"></div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.address}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="border border-red-300 px-3 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No users found.</td>
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

export default AllUsers