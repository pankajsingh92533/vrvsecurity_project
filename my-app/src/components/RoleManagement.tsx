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
    <div className="text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Roles</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
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
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th
                className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
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
                className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('permissions')}
              >
                <div className="flex items-center">
                  Permissions
                  {sortField === 'permissions' && (
                    sortDirection === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAndSortedRoles.map((role) => (
              <tr key={role.id} className="bg-gray-800 hover:bg-gray-700">
                <td className="py-4 px-4 text-sm text-gray-300">{role.name}</td>
                <td className="py-4 px-4 text-sm text-gray-300">
                  <div className="flex flex-wrap gap-2">
                    {(['create', 'read', 'update', 'delete'] as Permission[]).map((permission) => (
                      <button
                        key={permission}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          role.permissions.includes(permission)
                            ? 'bg-blue-800 text-blue-200'
                            : 'bg-gray-600 text-gray-300'
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
                    className="text-red-400 hover:text-red-300"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setIsAddRoleOpen(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Add New Role</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Role Name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
                <div className="mt-3 text-left">
                  <p className="text-sm font-medium text-gray-300">Permissions:</p>
                  {(['create', 'read', 'update', 'delete'] as Permission[]).map((permission) => (
                    <label key={permission} className="inline-flex items-center mt-2 mr-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600"
                        checked={newRole.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] })
                          } else {
                            setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== permission) })
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-300">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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

