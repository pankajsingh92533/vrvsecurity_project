'use client'

import { useState } from 'react'
import UserManagement from '@/components/UserManagement'
import RoleManagement from '@/components/RoleManagement'

export default function RBACDashboard() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 p-6 bg-blue-600 text-white">RBAC Dashboard</h1>
      <div className="flex border-b">
        <button
          className={`flex-1 py-4 px-6 text-lg font-medium ${
            activeTab === 'users' ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
        
          className={`flex-1 py-4 px-6 text-lg font-medium ${
            activeTab === 'roles' ? 'bg-blue-100 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'
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

