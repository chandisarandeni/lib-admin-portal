import React, { useState } from 'react'

const initialProfile = {
  firstName: 'Arafat',
  lastName: 'Rahman',
  email: 'arafat@example.com',
  phone: '123-456-7890',
  password: '',
  profileImage: null,
}

const Profile = () => {
  const [form, setForm] = useState(initialProfile)
  const [imagePreview, setImagePreview] = useState(null)
  const [message, setMessage] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, profileImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setMessage('Profile updated successfully!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="w-full p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-gray-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-5xl font-semibold">
                      {form.firstName[0]}
                    </span>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 text-center">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank if you don't want to change your password
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
                
                {message && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile