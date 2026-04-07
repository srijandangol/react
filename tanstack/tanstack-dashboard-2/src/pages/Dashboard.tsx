// DashboardStats.tsx
import React from 'react';
import { useUsers } from '../features/users/hooks/useUsers';

export const Dashboard: React.FC = () => {
  const { data: usersData } = useUsers({ page: 1, limit: 10000 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 text-sm font-medium">Total Users</p>
        <p className="text-3xl font-bold text-blue-600 mt-2">
          {usersData?.total || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 text-sm font-medium">Active Users</p>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {usersData?.users?.filter((u) => u.status === 'active').length || 0}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 text-sm font-medium">Admins</p>
        <p className="text-3xl font-bold text-purple-600 mt-2">
          {usersData?.users?.filter((u) => u.role === 'admin').length || 0}
        </p>
      </div>
    </div>
  );
};