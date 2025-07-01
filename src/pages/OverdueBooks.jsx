import React, { useState } from 'react'

// Example random overdue books data
const initialOverdueBooks = Array.from({ length: 37 }).map((_, i) => ({
  id: i + 1,
  user: `User ${((i % 10) + 1)}`,
  book: `Book Title ${((i % 12) + 1)}`,
  dueDate: `2025-06-${(i % 28 + 1).toString().padStart(2, '0')}`,
  fine: `$${(Math.random() * 10 + 1).toFixed(2)}`
}))

const ROWS_PER_PAGE = 15

const OverdueBooks = () => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(initialOverdueBooks.length / ROWS_PER_PAGE)
  const paginatedBooks = initialOverdueBooks.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  )

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Overdue Book List</h2>
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
              {paginatedBooks.map(item => (
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
              {paginatedBooks.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">No overdue books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="inline-flex -space-x-px">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-l-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border-t border-b border-gray-300 text-gray-700 bg-white hover:bg-gray-100 ${
                  page === i + 1 ? 'font-bold bg-blue-100 border-blue-400' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-r-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default OverdueBooks