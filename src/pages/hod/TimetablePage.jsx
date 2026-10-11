import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, CalendarDays } from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import TimetableGrid from '../../components/hod/TimetableGrid';

const YEAR_OPTIONS = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

export default function TimetablePage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [selectedYear, setSelectedYear] = useState('Second Year');
  const [open, setOpen] = useState(false);

  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';

  return (
    <div className="space-y-6">

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
            <h2 className={`text-base font-bold ${textMain}`}>Weekly Schedule</h2>
          </div>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Showing timetable for <span className="font-semibold">{selectedYear}</span>
          </p>
        </div>

        {/* Year selector */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <span>{selectedYear}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-xl overflow-hidden z-20 ${
              isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100'
            }`}>
              {YEAR_OPTIONS.map((year) => (
                <button
                  key={year}
                  onClick={() => { setSelectedYear(year); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    year === selectedYear
                      ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : isDark ? 'text-white hover:bg-[#2C2C2E]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <TimetableGrid />
    </div>
  );
}