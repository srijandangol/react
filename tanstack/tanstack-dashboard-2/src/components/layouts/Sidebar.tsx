/**
 * Sidebar Component - Side navigation
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarLink {
  label: string;
  href: string;
  icon: string;
}

const links: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "Products", href: "/products", icon: "📦" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white h-full p-4">
      <h2 className='text-lg font-bold mb-6'>Menu</h2>
      <nav>
        {links.map((link, index) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              index === 0 ? "mb-6" : ""
            } ${
              location.pathname === link.href
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <span className='text-xl'>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
