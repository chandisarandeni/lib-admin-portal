import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const AddBooks = () => {
  const navigate = useNavigate()
  const { addBooks } = useContext(AppContext)
  
  
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    isbn: '',
    category: '',
    genre: '',
    availabilityStatus: 'Available',
    description: '',
    dateOfPublication: '',
    publisher: '',
    language: 'English',
    imageUrl: '',
    quantity: 1,
    ratings: 0,
    numberOfViewers: 0,
    numberOfReaders: 0
  })

  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }))
        return
      }

      setCoverImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      
      // Clear any previous error
      setErrors(prev => ({
        ...prev,
        image: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.bookName.trim()) newErrors.bookName = 'Book name is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.genre) newErrors.genre = 'Genre is required'
    if (formData.quantity && formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }
    if (formData.ratings && (formData.ratings < 0 || formData.ratings > 5)) {
      newErrors.ratings = 'Rating must be between 0 and 5'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Prepare the book data according to your API structure
      const bookData = {
        bookName: formData.bookName,
        author: formData.author,
        publisher: formData.publisher || '',
        dateOfPublication: formData.dateOfPublication || new Date().toISOString().split('T')[0],
        isbn: formData.isbn,
        language: formData.language,
        category: formData.category,
        genre: formData.genre,
        description: formData.description || '',
        imageUrl: formData.imageUrl || '',
        quantity: parseInt(formData.quantity),
        numberOfViewers: 0,
        numberOfReaders: 0,
        ratings: parseFloat(formData.ratings),
        ratingsUpdatedBy: new Date().toISOString().split('T')[0],
        availabilityStatus: formData.availabilityStatus
      }

      // Call the addBooks function from context
      const result = await addBooks(bookData)
      
      console.log('Book added successfully:', result)
      alert('Book added successfully!')
      
      // Reset form
      setFormData({
        bookName: '',
        author: '',
        isbn: '',
        category: '',
        genre: '',
        availabilityStatus: 'Available',
        description: '',
        dateOfPublication: '',
        publisher: '',
        language: 'English',
        imageUrl: '',
        quantity: 1,
        ratings: 0,
        numberOfViewers: 0,
        numberOfReaders: 0
      })
      
      // Clear image
      setCoverImage(null)
      setImagePreview(null)
      
      // Navigate back to dashboard or all books page
      navigate('/dashboard/all-books')
      
    } catch (error) {
      console.error('Error adding book:', error)
      alert('Error adding book. Please try again.')
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setImagePreview(null)
    // Clear file input
    const fileInput = document.getElementById('coverImage')
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Add New Book</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Book Cover Upload */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Book Cover</h2>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Book cover preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg className="mx-auto w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image selected</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Book Cover
                  </label>
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="coverImage"
                    className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose Image
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Book Name */}
                <div className="md:col-span-2">
                  <label htmlFor="bookName" className="block text-sm font-medium text-gray-700 mb-2">
                    Book Name *
                  </label>
                  <input
                    type="text"
                    id="bookName"
                    name="bookName"
                    value={formData.bookName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.bookName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter book name"
                  />
                  {errors.bookName && <p className="mt-1 text-sm text-red-600">{errors.bookName}</p>}
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                </div>

                {/* ISBN */}
                <div>
                  <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.isbn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter ISBN number"
                  />
                  {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Education">Education</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Genre</option>
                    <option value="Classic">Classic</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Biography">Biography</option>
                    <option value="Memoir">Memoir</option>
                    <option value="Travel">Travel</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
                </div>

                {/* Availability Status */}
                <div>
                  <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    id="availabilityStatus"
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="Available">Available</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Under Maintenance</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity"
                  />
                  {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Publisher */}
                <div>
                  <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter publisher name"
                  />
                </div>

                {/* Date of Publication */}
                <div>
                  <label htmlFor="dateOfPublication" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Publication
                  </label>
                  <input
                    type="date"
                    id="dateOfPublication"
                    name="dateOfPublication"
                    value={formData.dateOfPublication}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    placeholder="Enter image URL"
                  />
                </div>

                {/* Language */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Russian">Russian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Initial Rating */}
                <div>
                  <label htmlFor="ratings" className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Rating (0-5)
                  </label>
                  <input
                    type="number"
                    id="ratings"
                    name="ratings"
                    value={formData.ratings}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.ratings ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter rating (0-5)"
                  />
                  {errors.ratings && <p className="mt-1 text-sm text-red-600">{errors.ratings}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical"
                    placeholder="Enter book description..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBooks