import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiLogOut, FiBell, FiUser, FiX } from 'react-icons/fi';
import { APP_CONFIG } from '../../utils/constants';

export default function Navbar({ sidebarOpen, onToggleSidebar, onLogout }) {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-secondary-200 shadow-soft">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-primary-600">{APP_CONFIG.NAME}</h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-secondary-900">{user?.name}</p>
              <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-600 hover:text-danger"
            aria-label="Logout"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
