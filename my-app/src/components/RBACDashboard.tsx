'use client'

import { useState } from 'react'
import UserManagement from './UserManagement'
import RoleManagement from './RoleManagement'

export default function RBACDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="w-full max-w-4xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 p-6 bg-gray-700 text-white">RBAC Dashboard</h1>
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-4 px-6 text-lg font-medium ${
            activeTab === 'users' ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={`flex-1 py-4 px-6 text-lg font-medium ${
            activeTab === 'roles' ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab('roles')}
        >
          Role Management
        </button>
      </div>
      <div className="p-6">
        {activeTab === 'users' ? <UserManagement /> : <RoleManagement />}
      </div>
    </div>
  )
}

