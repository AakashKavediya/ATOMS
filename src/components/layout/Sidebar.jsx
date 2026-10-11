import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  BarChart3,
  Clock,
  RefreshCw,
  FilePlus,
  UserCircle,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { selectSidebarCollapsed, toggleSidebar, toggleTheme, selectTheme } from '../../store/slices/uiSlice';
import { selectUser } from '../../store/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../lib/constants';
import { Sun, Moon } from 'lucide-react';

// ==========================================
// Role-based navigation config
// ==========================================
const NAV_CONFIG = {
  HOD: [
    { label: 'Main', items: [
      { name: 'Dashboard', href: '/hod', icon: LayoutDashboard },
      { name: 'Timetable', href: '/hod/timetable', icon: CalendarDays },
    ]},
    { label: 'Department', items: [
      { name: 'Faculty', href: '/hod/faculty', icon: Users },
      { name: 'Leave Management', href: '/hod/leave', icon: FileText, badge: 4 },
      { name: 'Analytics', href: '/hod/analytics', icon: BarChart3 },
    ]},
  ],
  TEACHER: [
    { label: 'Main', items: [
      { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
      { name: 'Timetable', href: '/teacher/timetable', icon: CalendarDays },
    ]},
    { label: 'Leave', items: [
      { name: 'Apply Leave', href: '/teacher/apply-leave', icon: FilePlus },
      { name: 'Leave History', href: '/teacher/leave-history', icon: FileText },
    ]},
    { label: 'Classes', items: [
      { name: 'Substitutions', href: '/teacher/substitutions', icon: RefreshCw, badge: 4 },
      { name: 'My Profile', href: '/teacher/profile', icon: UserCircle },
    ]},
  ],
  STUDENT: [
    { label: 'Main', items: [
      { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { name: 'Timetable', href: '/student/timetable', icon: CalendarDays },
    ]},
    { label: 'Academics', items: [
      { name: 'Attendance', href: '/student/attendance', icon: FileText },
      { name: 'My Profile', href: '/student/profile', icon: UserCircle },
    ]},
  ],
};

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const { logout } = useAuth();

  const isDark = theme === 'dark';
  const sections = NAV_CONFIG[user?.role] || [];

  const isActive = (href) => {
    if (href === '/hod' || href === '/teacher' || href === '/student') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // ============ Theme classes ============
  const sidebarClass = isDark
    ? 'bg-[#1C1C1E]/95 border-[#2C2C2E]'
    : 'bg-white/95 border-gray-200/70';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const textSection = isDark ? 'text-[#636366]' : 'text-[#A1A1A6]';
  const hover = isDark ? 'hover:bg-[#2C2C2E]' : 'hover:bg-gray-100';
  const active = isDark
    ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400'
    : 'bg-gradient-to-r from-amber-50 to-transparent text-amber-700';
  const divider = isDark ? 'border-[#2C2C2E]' : 'border-gray-200/70';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col border-r backdrop-blur-2xl transition-all duration-300 ease-in-out ${sidebarClass} ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        } ${
          mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ============ Brand ============ */}
        <div className={`flex items-center justify-between px-4 py-5 flex-shrink-0 ${
          collapsed ? 'lg:px-3 lg:justify-center' : ''
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl flex-shrink-0 shadow-lg shadow-amber-500/20 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <GraduationCap size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className={`text-base font-bold tracking-tight leading-none truncate ${textMain}`}>ATOMS</h1>
                <p className={`text-[10px] uppercase tracking-[0.15em] font-semibold mt-1 truncate ${textMuted}`}>
                  {user?.role ? `${user.role} Portal` : 'Portal'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className={`lg:hidden p-1.5 rounded-lg transition-colors ${hover} ${textMuted}`}
          >
            <X size={18} />
          </button>
        </div>

        {/* ============ Navigation ============ */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx}>
              {!collapsed && (
                <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] ${textSection}`}>
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const activeState = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                        activeState ? active : `${textMuted} hover:${textMain} ${hover}`
                      } ${collapsed ? 'lg:justify-center' : ''}`}
                      title={collapsed ? item.name : ''}
                    >
                      {activeState && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-500" />
                      )}
                      <Icon size={18} className="flex-shrink-0" strokeWidth={activeState ? 2.5 : 2} />
                      {!collapsed && (
                        <span className="text-[13px] font-semibold truncate flex-1">{item.name}</span>
                      )}
                      {item.badge && !collapsed && (
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          activeState
                            ? 'bg-amber-500 text-white'
                            : isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.badge && collapsed && (
                        <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ${
                          isDark ? 'ring-[#1C1C1E]' : 'ring-white'
                        }`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ============ Bottom actions ============ */}
        <div className={`border-t px-3 py-3 space-y-1 flex-shrink-0 ${divider}`}>
          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${textMuted} ${hover} ${
              collapsed ? 'lg:justify-center' : ''
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && (
              <span className="text-[13px] font-semibold">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>

        {/* ============ User card ============ */}
        <div className={`border-t p-3 flex-shrink-0 ${divider}`}>
          <div className={`group flex items-center gap-3 p-2 rounded-xl transition-colors ${hover} ${
            collapsed ? 'lg:justify-center' : ''
          }`}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ${
                isDark ? 'ring-[#1C1C1E]' : 'ring-white'
              }`} />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${textMain}`}>{user?.name || 'User'}</p>
                <p className={`text-[10px] truncate ${textMuted}`}>{user?.role || ''}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className={`p-1.5 rounded-lg transition-colors ${textMuted} hover:text-rose-500 hover:bg-rose-500/10`}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ============ Floating collapse toggle (desktop) ============ */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className={`hidden lg:flex items-center justify-center fixed top-[88px] z-50 w-7 h-7 rounded-full border shadow-md transition-all duration-300 hover:scale-110 ${
          collapsed ? 'left-[56px]' : 'left-[244px]'
        } ${
          isDark
            ? 'bg-[#1C1C1E] border-[#2C2C2E] text-[#8E8E93] hover:text-amber-400'
            : 'bg-white border-gray-200 text-gray-500 hover:text-amber-600'
        }`}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </>
  );
}