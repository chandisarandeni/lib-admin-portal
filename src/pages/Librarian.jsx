import React, { useState, useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../context/AppContext'

const Librarian = () => {
  const { addLibrarian,librarians, editLibrarian, deleteLibrarian } = useContext(AppContext)

  // Sample librarian data - you can replace this with actual data from your API
  

  // Modal and editing states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedLibrarian, setSelectedLibrarian] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [addFormData, setAddFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [addErrors, setAddErrors] = useState({})
  const [isAddingLibrarian, setIsAddingLibrarian] = useState(false)

  // Search and pagination
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const librariansPerPage = 10

  // Filter librarians by search
  const filteredLibrarians = librarians.filter(librarian =>
    librarian.name.toLowerCase().includes(search.toLowerCase()) ||
    librarian.email.toLowerCase().includes(search.toLowerCase()) ||
    librarian.librarianId?.toString().toLowerCase().includes(search.toLowerCase())
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
    setEditFormData({ 
      ...librarian,
      phone: librarian.phoneNumber // Convert phoneNumber to phone for form handling
    })
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedLibrarian(null)
    setEditFormData({})
    setErrors({})
  }

  // Function to generate random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const openAddModal = () => {
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      nic: '',
      address: '',
      joinDate: '',
      shift: 'Morning',
      experience: '',
      password: generateRandomPassword()
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
    if (!editFormData.address?.trim()) newErrors.address = 'Address is required'
    
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
    if (!addFormData.nic?.trim()) newErrors.nic = 'NIC is required'
    if (!addFormData.address?.trim()) newErrors.address = 'Address is required'
    
    // Email validation
    if (addFormData.email && !/\S+@\S+\.\S+/.test(addFormData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    // Check if email already exists
    if (addFormData.email && librarians.some(lib => lib.email === addFormData.email)) {
      newErrors.email = 'Email already exists'
    }
    
    // NIC validation (basic length check)
    if (addFormData.nic && addFormData.nic.length < 10) {
      newErrors.nic = 'NIC must be at least 10 characters'
    }
    
    setAddErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Prepare updated data for API - convert phone back to phoneNumber
      const updatedData = {
        name: editFormData.name,
        email: editFormData.email,
        phoneNumber: editFormData.phone, // Backend expects 'phoneNumber' not 'phone'
        address: editFormData.address,
        status: editFormData.status,
        shift: editFormData.shift,
        experience: editFormData.experience,
        joinDate: editFormData.joinDate
      }

      // Debug: Log the data being sent to API
      console.log('Updating librarian with ID:', selectedLibrarian.librarianId)
      console.log('Update data:', updatedData)

      // Call the API to update librarian
      const result = await editLibrarian(selectedLibrarian.librarianId, updatedData)

      // Debug: Log the response from API
      console.log('API response:', result)
      
      if (result) {
        toast.success('Librarian details updated successfully!')
        closeEditModal()
        // Note: The AppContext should handle updating the librarians list
      } else {
        toast.error('Failed to update librarian. Please try again.')
      }
    } catch (error) {
      console.error('Error updating librarian:', error)
      toast.error('Error updating librarian. Please try again.')
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateAddForm()) {
      return
    }

    setIsAddingLibrarian(true)

    try {
      // Prepare librarian data for API (employeeId will be auto-generated by backend)
      const newLibrarianData = {
        name: addFormData.name,
        email: addFormData.email,
        phoneNumber: addFormData.phone, // Backend expects 'phoneNumber' not 'phone'
        nic: addFormData.nic,
        address: addFormData.address,
        shift: addFormData.shift || 'Morning',
        experience: addFormData.experience || '',
        joinDate: addFormData.joinDate || '',
        password: addFormData.password, // Include the generated password
        status: 'Active', // Default status
        qualification: '' // Default empty qualification
      }

      // Debug: Log the data being sent to API
      console.log('Sending librarian data to API:', newLibrarianData)

      // Call the API to add librarian
      const result = await addLibrarian(newLibrarianData)
      
      // Debug: Log the response from API
      console.log('API response:', result)
      
      if (result) {
        toast.success('New librarian added successfully!')
        closeAddModal()
        // Note: The AppContext should handle updating the librarians list
      } else {
        toast.error('Failed to add librarian. Please try again.')
      }
    } catch (error) {
      console.error('Error adding librarian:', error)
      toast.error('Error adding librarian. Please try again.')
    } finally {
      setIsAddingLibrarian(false)
    }
  }

  const handleDeleteLibrarian = async (librarianId) => {
    if (window.confirm('Are you sure you want to delete this librarian? This action cannot be undone.')) {
      try {
        // Debug: Log the ID being sent to API
        console.log('Deleting librarian with ID:', librarianId)

        // Call the API to delete librarian
        const result = await deleteLibrarian(librarianId)
        
        // Debug: Log the response from API
        console.log('Delete API response:', result)
        
        // For DELETE operations, success might return null, undefined, or true
        // Check if the operation didn't explicitly fail
        if (result !== false) {
          toast.success('Librarian deleted successfully!')
          // Note: The AppContext should handle updating the librarians list
        } else {
          toast.error('Failed to delete librarian. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting librarian:', error)
        toast.error('Error deleting librarian. Please try again.')
      }
    }
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

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full address"
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
                        disabled={isAddingLibrarian}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          addErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {addErrors.name && <p className="mt-1 text-sm text-red-600">{addErrors.name}</p>}
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

                    {/* NIC */}
                    <div>
                      <label htmlFor="add-nic" className="block text-sm font-medium text-gray-700 mb-1">
                        NIC *
                      </label>
                      <input
                        type="text"
                        id="add-nic"
                        name="nic"
                        value={addFormData.nic || ''}
                        onChange={handleAddInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.nic ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter NIC number"
                      />
                      {addErrors.nic && <p className="mt-1 text-sm text-red-600">{addErrors.nic}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label htmlFor="add-address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        id="add-address"
                        name="address"
                        value={addFormData.address || ''}
                        onChange={handleAddInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          addErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full address"
                      />
                      {addErrors.address && <p className="mt-1 text-sm text-red-600">{addErrors.address}</p>}
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

                    {/* Auto-generated Password */}
                    <div className="md:col-span-2">
                      <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Generated Password
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="add-password"
                          name="password"
                          value={addFormData.password || ''}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                          placeholder="Auto-generated password"
                        />
                        <button
                          type="button"
                          onClick={() => setAddFormData(prev => ({ ...prev, password: generateRandomPassword() }))}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Regenerate
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">This password will be used for the librarian's initial login</p>
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
                      disabled={isAddingLibrarian}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAddingLibrarian ? 'Adding...' : 'Add Librarian'}
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
              placeholder="Search by name, email, or librarian ID..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Librarian ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLibrarians.map(librarian => (
                <tr key={librarian.librarianId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{librarian.librarianId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{librarian.name}</div>
                      <div className="text-gray-500 text-xs">{librarian.qualification}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>
                      <div>{librarian.email}</div>
                      <div className="text-gray-500 text-xs">{librarian.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{librarian.shift}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{librarian.experience}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        className="border border-gray-300 px-3 py-1 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => openEditModal(librarian)}
                      >
                        Edit
                      </button>
                      <button
                        className="border border-red-300 px-3 py-1 rounded text-xs text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDeleteLibrarian(librarian.librarianId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentLibrarians.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No librarians found.</td>
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