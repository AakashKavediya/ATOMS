import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Bell, Sun, Moon, ChevronDown, Settings, LogOut, UserCircle } from 'lucide-react';
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice';
import { selectUser } from '../../store/slices/authSlice';
import useAuth from '../../hooks/useAuth';

export default function Header({ title = 'Dashboard', subtitle = '' }) {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const { logout } = useAuth();
  const isDark = theme === 'dark';

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Theme classes
  const headerClass = isDark ? 'bg-[#1C1C1E]/85 border-[#2C2C2E]' : 'bg-white/85 border-gray-200/70';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const iconBtn = isDark ? 'text-[#8E8E93] hover:bg-[#2C2C2E] hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';
  const searchBg = isDark
    ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white placeholder-[#636366]'
    : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-400';
  const dropdown = isDark
    ? 'bg-[#1C1C1E] border-[#2C2C2E] shadow-2xl shadow-black/60'
    : 'bg-white border-gray-100 shadow-2xl shadow-black/10';
  const itemHover = isDark ? 'hover:bg-[#2C2C2E]' : 'hover:bg-gray-50';
  const divider = isDark ? 'border-[#2C2C2E]' : 'border-gray-100';

  const notifications = [
    { id: 1, title: 'Welcome to ATOMS', desc: 'Your account is ready', time: 'just now', color: 'bg-amber-500' },
  ];

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 h-[64px] border-b backdrop-blur-2xl ${headerClass}`}>
      {/* Left: Title */}
      <div className="min-w-0 flex-shrink-0">
        <h1 className={`text-base sm:text-lg font-bold tracking-tight leading-tight truncate ${textMain}`}>{title}</h1>
        {subtitle && <p className={`text-[11px] mt-0.5 truncate ${textMuted}`}>{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-auto">
        <div className="relative w-full">
          <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
          <input
            type="text"
            placeholder="Search anything..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-[13px] outline-none border transition-all focus:ring-2 focus:ring-amber-500/40 ${searchBg}`}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        {/* Mobile search */}
        <button className={`md:hidden p-2 rounded-xl transition-colors ${iconBtn}`}><Search size={18} /></button>

        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className={`relative p-2 rounded-xl transition-all ${iconBtn}`}
        >
          <div className="relative w-[18px] h-[18px]">
            <Sun size={18} className={`absolute inset-0 transition-all duration-500 ${
              isDark ? 'opacity-100 rotate-0 text-amber-400' : 'opacity-0 -rotate-90'
            }`} />
            <Moon size={18} className={`absolute inset-0 transition-all duration-500 ${
              isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
            }`} />
          </div>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className={`relative p-2 rounded-xl transition-colors ${iconBtn}`}
          >
            <Bell size={18} />
            <span className={`absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center ring-2 ${
              isDark ? 'ring-[#1C1C1E]' : 'ring-white'
            }`}>
              {notifications.length}
            </span>
          </button>
          {notifOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl border overflow-hidden ${dropdown}`}>
              <div className={`px-4 py-3 border-b ${divider}`}>
                <h3 className={`text-sm font-bold ${textMain}`}>Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b ${divider} ${itemHover}`}>
                    <div className={`mt-1 w-2 h-2 rounded-full ${n.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${textMain}`}>{n.title}</p>
                      <p className={`text-[11px] mt-0.5 ${textMuted}`}>{n.desc}</p>
                      <p className={`text-[10px] mt-1 ${textMuted}`}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-colors ${iconBtn}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className={`text-xs font-semibold ${textMain}`}>{user?.name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={12} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${textMuted}`} />
            </div>
          </button>
          {userMenuOpen && (
            <div className={`absolute right-0 mt-2 w-64 rounded-2xl border overflow-hidden ${dropdown}`}>
              <div className={`flex items-center gap-3 p-4 border-b ${divider}`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${textMain}`}>{user?.name}</p>
                  <p className={`text-[11px] truncate ${textMuted}`}>{user?.email}</p>
                </div>
              </div>
              <div className="py-1">
                <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${itemHover} ${textMain}`}>
                  <UserCircle size={16} className={textMuted} />
                  <span className="font-medium">My Profile</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${itemHover} ${textMain}`}>
                  <Settings size={16} className={textMuted} />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
              <div className={`border-t p-1 ${divider}`}>
                <button
                  onClick={logout}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl ${
                    isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}