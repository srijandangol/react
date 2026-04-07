/**
 * React Router configuration
 */

import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Products } from '../pages/Products';
import { Navbar } from '../components/layouts/Navbar';
import { Sidebar } from '../components/layouts/Sidebar';
import { UsersPage } from '../pages/Users';
import { Dashboard } from '../pages/Dashboard';

// Layout component
const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/products',
        element: <Products />,
      },
    ],
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
