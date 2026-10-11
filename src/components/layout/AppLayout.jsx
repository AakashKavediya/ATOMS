import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { selectSidebarCollapsed, selectTheme, loadUIPrefs } from '../../store/slices/uiSlice';

export default function AppLayout({ title, subtitle }) {
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);
  const theme = useSelector(selectTheme);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(loadUIPrefs());
  }, [dispatch]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#000000]' : 'bg-[#F2F2F7]'}`}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className={`pt-[60px] lg:pt-0 transition-all duration-300 ${
        collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      }`}>
        <Header title={title} subtitle={subtitle} />

        {/* Mobile menu button — floats top-left */}
        <button
          onClick={() => setMobileOpen(true)}
          className={`lg:hidden fixed top-3 left-4 z-40 p-2 rounded-xl ${
            isDark ? 'bg-[#1C1C1E] text-white' : 'bg-white text-gray-800 shadow'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}