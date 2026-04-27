import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="flex justify-between items-center h-16 px-6 md:px-8">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <span className="text-2xl">📊</span>
          Dashboard
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6 justify-end">

          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>

          <Link to="/users" className="hover:text-blue-200 transition">
            Users
          </Link>

          <Link to="/products" className="hover:text-blue-200 transition">
            Products
          </Link>

          <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition">
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};