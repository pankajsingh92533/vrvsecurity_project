'use client'

import { useState, useMemo } from 'react'
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from 'lucide-react'

type User = {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

const initialUsers: User[] = [
  { id: 1, name: 'Abhay Singh', email: 'abhay@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Pankaj Kumar', email: 'pankaj@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Rishi Raj', email: 'rishi@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Radhey', email: 'radhey@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Mudit Yadav', email: 'mudit@example.com', role: 'Viewer', status: 'Inactive' },
  
]

type SortField = 'name' | 'email' | 'role' | 'status'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: '', status: 'Active' })
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterRole, setFilterRole] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  const addUser = () => {
    const errors: { [key: string]: string } = {}

    if (!newUser.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!newUser.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Email is invalid'
    }

    if (!newUser.role) {
      errors.role = 'Role is required'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setUsers([...users, { ...newUser, id: users.length + 1 }])
    setNewUser({ name: '', email: '', role: '', status: 'Active' })
    setIsAddUserOpen(false)
    setFormErrors({})
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ))
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => 
        (filterRole === '' || user.role === filterRole) &&
        (filterStatus === '' || user.status === filterStatus) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [users, sortField, sortDirection, filterRole, filterStatus, searchTerm])

  return (
    <div className="text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Users</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsAddUserOpen(true)}
        >
          Add User
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select
          className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              {(['name', 'email', 'role', 'status'] as const).map((field) => (
                <th
                  key={field}
                  className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id} className="bg-gray-800 hover:bg-gray-700">
                <td className="py-4 px-4 text-sm text-gray-300">{user.name}</td>
                <td className="py-4 px-4 text-sm text-gray-300">{user.email}</td>
                <td className="py-4 px-4 text-sm text-gray-300">{user.role}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium">
                  <button
                    className="text-blue-400 hover:text-blue-300 mr-2"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setIsAddUserOpen(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Add New User</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className={`mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${formErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                <input
                  type="email"
                  className={`mt-3 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${formErrors.email ? 'border-red-500' : ''}`}
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                <select
                  className={`mt-3 block w-full rounded-md bg-gray-700 border-gray-600 text-white ${formErrors.role ? 'border-red-500' : ''}`}
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={addUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

