'use client'

import { useState, useMemo } from 'react'
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from 'lucide-react'

type Permission = 'create' | 'read' | 'update' | 'delete'

type Role = {
  id: number
  name: string
  permissions: Permission[]
}

const initialRoles: Role[] = [
  { id: 1, name: 'Admin', permissions: ['create', 'read', 'update', 'delete'] },
  { id: 2, name: 'Editor', permissions: ['read', 'update'] },
  { id: 3, name: 'Viewer', permissions: ['read'] },
  { id: 4, name: 'Manager', permissions: ['read', 'update', 'delete'] },
  { id: 5, name: 'Contributor', permissions: ['create', 'read'] },
]

type SortField = 'name' | 'permissions'

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({ name: '', permissions: [] })
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterPermission, setFilterPermission] = useState<Permission | ''>('')

  const addRole = () => {
    setRoles([...roles, { ...newRole, id: roles.length + 1 }])
    setNewRole({ name: '', permissions: [] })
    setIsAddRoleOpen(false)
  }

  const deleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id))
  }

  const togglePermission = (roleId: number, permission: Permission) => {
    setRoles(roles.map(role => 
      role.id === roleId
        ? { 
            ...role, 
            permissions: role.permissions.includes(permission)
              ? role.permissions.filter(p => p !== permission)
              : [...role.permissions, permission]
          }
        : role
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

  const filteredAndSortedRoles = useMemo(() => {
    return roles
      .filter(role => 
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterPermission === '' || role.permissions.includes(filterPermission))
      )
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else {
          return sortDirection === 'asc' 
            ? a.permissions.length - b.permissions.length
            : b.permissions.length - a.permissions.length
        }
      })
  }, [roles, sortField, sortDirection, searchTerm, filterPermission])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Roles</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsAddRoleOpen(true)}
        >
          Add Role
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search roles..."
            className="pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="border rounded-md px-4 py-2"
          value={filterPermission}
          onChange={(e) => setFilterPermission(e.target.value as Permission | '')}
        >
          <option value="">All Permissions</option>
          <option value="create">Create</option>
          <option value="read">Read</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Role Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('permissions')}
              >
                <div className="flex items-center">
                  Permissions
                  {sortField === 'permissions' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedRoles.map((role) => (
              <tr key={role.id}>
                <td className="py-4 px-4 text-sm text-gray-900">{role.name}</td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {(['create', 'read', 'update', 'delete'] as Permission[]).map((permission) => (
                      <button
                        key={permission}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          role.permissions.includes(permission)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => togglePermission(role.id, permission)}
                      >
                        {permission}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-medium">
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => deleteRole(role.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddRoleOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setIsAddRoleOpen(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Role</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Role Name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <div className="mt-3 text-left">
                  <p className="text-sm font-medium text-gray-700">Permissions:</p>
                  {(['create', 'read', 'update', 'delete'] as Permission[]).map((permission) => (
                    <label key={permission} className="inline-flex items-center mt-2 mr-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={newRole.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] })
                          } else {
                            setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== permission) })
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={addRole}
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

