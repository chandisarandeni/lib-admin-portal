import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Librarian = () => {
  const context = useContext(AppContext)
  
  // Sample librarian data - you can replace this with actual data from your API
  const [librarians, setLibrarians] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@library.com',
      phone: '+1 (555) 123-4567',
      employeeId: 'LIB001',
      department: 'Reference',
      joinDate: '2020-03-15',
      status: 'Active',
      shift: 'Morning',
      experience: '4 years',
      qualification: 'Masters in Library Science'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@library.com',
      phone: '+1 (555) 234-5678',
      employeeId: 'LIB002',
      department: 'Technical Services',
      joinDate: '2019-07-22',
      status: 'Active',
      shift: 'Evening',
      experience: '5 years',
      qualification: 'Bachelor in Information Science'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@library.com',
      phone: '+1 (555) 345-6789',
      employeeId: 'LIB003',
      department: 'Children\'s Section',
      joinDate: '2021-01-10',
      status: 'Active',
      shift: 'Morning',
      experience: '3 years',
      qualification: 'Masters in Education'
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david.thompson@library.com',
      phone: '+1 (555) 456-7890',
      employeeId: 'LIB004',
      department: 'Administration',
      joinDate: '2018-05-30',
      status: 'On Leave',
      shift: 'Full Time',
      experience: '6 years',
      qualification: 'MBA in Management'
    }
  ])

  // Modal and editing states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedLibrarian, setSelectedLibrarian] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [addFormData, setAddFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [addErrors, setAddErrors] = useState({})

  // Search and pagination
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const librariansPerPage = 10

  // Filter librarians by search
  const filteredLibrarians = librarians.filter(librarian =>
    librarian.name.toLowerCase().includes(search.toLowerCase()) ||
    librarian.email.toLowerCase().includes(search.toLowerCase()) ||
    librarian.employeeId.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredLibrarians.length / librariansPerPage)
  const startIndex = (currentPage - 1) * librariansPerPage
  const endIndex = startIndex + librariansPerPage
  const currentLibrarians = filteredLibrarians.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Modal handlers
  const openEditModal = (librarian) => {
    setSelectedLibrarian(librarian)
    setEditFormData({ ...librarian })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedLibrarian(null)
    setEditFormData({})
    setErrors({})
  }

  const openAddModal = () => {
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      joinDate: '',
      status: 'Active',
      shift: 'Morning',
      experience: '',
      qualification: ''
    })
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAddFormData({})
    setAddErrors({})
  }

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (addErrors[name]) {
      setAddErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!editFormData.name?.trim()) newErrors.name = 'Name is required'
    if (!editFormData.email?.trim()) newErrors.email = 'Email is required'
    if (!editFormData.phone?.trim()) newErrors.phone = 'Phone is required'
    if (!editFormData.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required'
    
    // Email validation
    if (editFormData.email && !/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAddForm = () => {
    const newErrors = {}
    
    if (!addFormData.name?.trim()) newErrors.name = 'Name is required'
    if (!addFormData.email?.trim()) newErrors.email = 'Email is required'
    if (!addFormData.phone?.trim()) newErrors.phone = 'Phone is required'
    if (!addFormData.employeeId?.trim()) newErrors.employeeId = 'Employee ID is required'
    
    // Email validation
    if (addFormData.email && !/\S+@\S+\.\S+/.test(addFormData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    // Check if employee ID already exists
    if (addFormData.employeeId && librarians.some(lib => lib.employeeId === addFormData.employeeId)) {
      newErrors.employeeId = 'Employee ID already exists'
    }
    
    // Check if email already exists
    if (addFormData.email && librarians.some(lib => lib.email === addFormData.email)) {
      newErrors.email = 'Email already exists'
    }
    
    setAddErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Update librarian in the list
    setLibrarians(prev => 
      prev.map(lib => 
        lib.id === selectedLibrarian.id 
          ? { ...editFormData }
          : lib
      )
    )

    alert('Librarian details updated successfully!')
    closeEditModal()
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    
    if (!validateAddForm()) {
      return
    }

    // Generate new ID
    const newId = Math.max(...librarians.map(lib => lib.id)) + 1

    // Add new librarian to the list
    const newLibrarian = {
      ...addFormData,
      id: newId
    }

    setLibrarians(prev => [...prev, newLibrarian])

    alert('New librarian added successfully!')
    closeAddModal()
  }

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

  // Safety check for context
  if (!context) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="relative">
      {/* Edit Modal and blur background */}
      {isEditModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Edit Librarian Details</h2>
                  <button
                    onClick={closeEditModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Employee ID */}
                    <div>
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={editFormData.employeeId || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.employeeId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter employee ID"
                      />
                      {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={editFormData.status || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Shift */}
                    <div>
                      <label htmlFor="shift" className="block text-sm font-medium text-gray-700 mb-1">
                        Shift
                      </label>
                      <select
                        id="shift"
                        name="shift"
                        value={editFormData.shift || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                        <option value="Full Time">Full Time</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={editFormData.experience || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    {/* Join Date */}
                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Join Date
                      </label>
                      <input
                        type="date"
                        id="joinDate"
                        name="joinDate"
                        value={editFormData.joinDate || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>

                    {/* Qualification */}
                    <div className="md:col-span-2">
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={editFormData.qualification || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="e.g., Masters in Library Science"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Update Details
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Modal and blur background */}
      {isAddModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Add New Librarian</h2>
                  <button
                    onClick={closeAddModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="add-name"
                        name="name"
                        value={addFormData.name || ''}
                        onChange={handleAddInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {addErrors.name && <p className="mt-1 text-sm text-red-600">{addErrors.name}</p>}
                    </div>

                    {/* Employee ID */}
                    <div>
                      <label htmlFor="add-employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        id="add-employeeId"
                        name="employeeId"
                        value={addFormData.employeeId || ''}
                        onChange={handleAddInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.employeeId ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter employee ID"
                      />
                      {addErrors.employeeId && <p className="mt-1 text-sm text-red-600">{addErrors.employeeId}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="add-email"
                        name="email"
                        value={addFormData.email || ''}
                        onChange={handleAddInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {addErrors.email && <p className="mt-1 text-sm text-red-600">{addErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="add-phone"
                        name="phone"
                        value={addFormData.phone || ''}
                        onChange={handleAddInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter phone number"
                      />
                      {addErrors.phone && <p className="mt-1 text-sm text-red-600">{addErrors.phone}</p>}
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="add-status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="add-status"
                        name="status"
                        value={addFormData.status || 'Active'}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Shift */}
                    <div>
                      <label htmlFor="add-shift" className="block text-sm font-medium text-gray-700 mb-1">
                        Shift
                      </label>
                      <select
                        id="add-shift"
                        name="shift"
                        value={addFormData.shift || 'Morning'}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                        <option value="Full Time">Full Time</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label htmlFor="add-experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        id="add-experience"
                        name="experience"
                        value={addFormData.experience || ''}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    {/* Join Date */}
                    <div>
                      <label htmlFor="add-joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Join Date
                      </label>
                      <input
                        type="date"
                        id="add-joinDate"
                        name="joinDate"
                        value={addFormData.joinDate || ''}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      />
                    </div>

                    {/* Qualification */}
                    <div className="md:col-span-2">
                      <label htmlFor="add-qualification" className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        id="add-qualification"
                        name="qualification"
                        value={addFormData.qualification || ''}
                        onChange={handleAddInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="e.g., Masters in Library Science"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Add Librarian
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`p-6 ${isEditModalOpen || isAddModalOpen ? 'pointer-events-none select-none blur-sm' : ''}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Librarian Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full sm:w-80"
            />
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              Add Librarian
            </button>
          </div>
        </div>

        {/* Results info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredLibrarians.length)} of {filteredLibrarians.length} librarians
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLibrarians.map(librarian => (
                <tr key={librarian.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{librarian.employeeId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{librarian.name}</div>
                      <div className="text-gray-500 text-xs">{librarian.qualification}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div>{librarian.email}</div>
                      <div className="text-gray-500 text-xs">{librarian.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{librarian.shift}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{librarian.experience}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      librarian.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : librarian.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {librarian.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                      onClick={() => openEditModal(librarian)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {currentLibrarians.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">No librarians found.</td>
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

export default Librarian