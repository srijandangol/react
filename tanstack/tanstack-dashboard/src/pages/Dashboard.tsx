import React, { useState } from 'react';
import { useUsers } from '../features/users/hooks/useUsers';
import { Input } from '../components/ui/Input';

export const Dashboard: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: usersData } = useUsers({
    page: 1,
    limit: 100,
    search,
  });

  const totalUsers = usersData?.total || 0;

  const filteredUsers =
    usersData?.users?.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    ).length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Filtered Users</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {filteredUsers}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Users</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {totalUsers}
          </p>
        </div>

      </div>
    </div>
  );
};