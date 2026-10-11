import { useSelector } from 'react-redux';
import {
  BookOpen, Clock, RefreshCw, Calendar, ChevronDown, Bell,
} from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import { selectUser } from '../../store/slices/authSlice';
import {
  teacherStats,
  teacherTimetableToday,
  hodNotifications,
} from '../../lib/mockData';

const ICONS = { BookOpen, Clock, RefreshCw, Calendar };

export default function TeacherDashboardPage() {
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';

  const colorMap = {
    amber: { text: 'text-amber-500', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
    blue: { text: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
    purple: { text: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
    green: { text: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
  };

  return (
    <div className="space-y-6">

      {/* ============ STAT CARDS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {teacherStats.map((stat, i) => {
          const Icon = ICONS[stat.icon];
          const c = colorMap[stat.color];
          return (
            <div
              key={i}
              className={`p-5 rounded-3xl border flex flex-col gap-3 transition-transform hover:scale-[1.02] duration-200 ${cardClass}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-xs font-semibold leading-tight ${textMuted}`}>{stat.title}</h3>
                <div className={`p-2 rounded-xl ${isDark ? 'bg-[#2C2C2E]' : c.bg} ${c.text}`}>
                  {Icon && <Icon size={16} />}
                </div>
              </div>
              <div className={`text-3xl font-bold tracking-tight ${textMain}`}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* ============ BOTTOM GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Timetable */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${cardClass}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-semibold tracking-tight ${textMain}`}>Today's Timetable</h2>
            <button className={`text-xs font-medium ${textMuted} hover:text-amber-500 transition-colors`}>
              View week →
            </button>
          </div>

          <div className="space-y-2.5">
            {teacherTimetableToday.map((item) => (
              <div
                key={item.id}
                className={`relative flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl border transition-colors ${
                  item.isOngoing
                    ? isDark
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-amber-50/50 border-amber-100'
                    : isDark
                      ? 'bg-[#2C2C2E]/40 border-[#2C2C2E] hover:border-[#3A3A3C]'
                      : 'bg-gray-50/50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${item.accentColor}`} />

                <div className="pl-3 flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${textMain}`}>{item.subject}</h4>
                  <p className={`text-xs mt-0.5 truncate ${textMuted}`}>{item.class}</p>
                </div>

                {item.time && (
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-medium ${textMuted}`}>{item.time}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${
                      item.status === 'Ongoing'
                        ? isDark ? 'text-amber-400' : 'text-amber-600'
                        : textMuted
                    }`}>
                      {item.status}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className={`p-6 rounded-3xl border flex flex-col ${cardClass}`}>
          <div className="flex items-center gap-2 mb-5">
            <div className={`p-2 rounded-full ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
              <Bell size={16} />
            </div>
            <h2 className={`text-base font-semibold tracking-tight ${textMain}`}>Recent Notifications</h2>
          </div>

          <div className="space-y-3">
            {hodNotifications.slice(0, 2).map((notif) => (
              <div
                key={notif.id}
                className={`relative flex items-start gap-3 px-3 py-3 rounded-2xl transition-colors ${
                  isDark ? 'hover:bg-[#2C2C2E]/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-orange-400" />
                <div className="pl-2.5 min-w-0 flex-1">
                  <p className={`text-xs font-bold ${textMain}`}>Leave request submitted</p>
                  <p className={`text-[11px] mt-1 leading-relaxed ${textMuted}`}>
                    {notif.teacher} requested {notif.type} for {notif.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}