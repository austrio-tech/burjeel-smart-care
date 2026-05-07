import { useAuth } from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiBell,
  FiCheck,
  FiBarChart2,
  FiMessageSquare,
  FiCalendar,
  FiUserPlus,
  FiSettings,
  FiShield,
} from 'react-icons/fi';

const navItems = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { label: 'Patients', path: '/admin/patients', icon: FiUsers },
    { label: 'Doctors', path: '/admin/doctors', icon: FiUserPlus },
    { label: 'Reminders', path: '/admin/reminders', icon: FiBell },
    { label: 'Attendance', path: '/admin/attendance', icon: FiCheck },
    { label: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FiShield },
    { label: 'Chat', path: '/admin/chat', icon: FiMessageSquare },
    { label: 'Settings', path: '/settings', icon: FiSettings },
  ],
  patient: [
    { label: 'Dashboard', path: '/patient/dashboard', icon: FiHome },
    { label: 'Doctors', path: '/patient/doctors', icon: FiUserPlus },
    { label: 'Appointments', path: '/patient/appointments', icon: FiCalendar },
    { label: 'Messages', path: '/patient/chat', icon: FiMessageSquare },
    { label: 'Settings', path: '/settings', icon: FiSettings },
  ],
  doctor: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { label: 'Patients', path: '/admin/patients', icon: FiUsers },
    { label: 'Reminders', path: '/admin/reminders', icon: FiBell },
    { label: 'Attendance', path: '/admin/attendance', icon: FiCheck },
    { label: 'Reports', path: '/admin/reports', icon: FiBarChart2 },
    { label: 'Chat', path: '/admin/chat', icon: FiMessageSquare },
    { label: 'Settings', path: '/settings', icon: FiSettings },
  ],
  it_staff: [
    { label: 'Dashboard', path: '/it/dashboard', icon: FiHome },
    { label: 'System', path: '/it/system', icon: FiBarChart2 },
    { label: 'Messages', path: '/it/chat', icon: FiMessageSquare },
    { label: 'Settings', path: '/settings', icon: FiSettings },
  ],
};

export default function Sidebar({ onLogout }) {
  const { user } = useAuth();
  const userNavItems = navItems[user?.role] || [];

  return (
    <div className="flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-secondary-800">
        <h2 className="text-2xl font-bold text-white">Smart Care</h2>
        <p className="text-xs text-secondary-400 mt-1">Patient Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
                  }
                `
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-secondary-800">
        <div className="bg-secondary-800 rounded-lg p-4 text-center">
          <p className="text-xs text-secondary-400 mb-3">Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}</p>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
