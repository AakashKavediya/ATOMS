import { useSelector, useDispatch } from 'react-redux';
import {
  BookOpen,
  Clock,
  RefreshCw,
  UserCheck,
  Bell,
  CheckCircle,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { selectTheme } from '../../store/slices/uiSlice';
import {
  hodStats,
  hodLeaveTrends,
  hodNotifications,
  hodWorkHours,
} from '../../lib/mockData';

// ---------- Icon mapper ----------
const ICONS = {
  BookOpen,
  Clock,
  RefreshCw,
  UserCheck,
};

export default function HODDashboardPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  // Theme classes
  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  const divider = isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100';

  const handleApproval = (id, action) => {
    alert(`${action} for request ${id}`);
  };

  const colorMap = {
    amber: { text: 'text-amber-500', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
    blue: { text: 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
    purple: { text: 'text-purple-500', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
    green: { text: 'text-green-500', bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
  };

  return (
    <div className="space-y-6">

      {/* ============ ROW 1: STAT CARDS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hodStats.map((stat, i) => {
          const Icon = ICONS[stat.icon];
          const c = colorMap[stat.color];
          return (
            <div
              key={i}
              className={`p-5 rounded-3xl border flex items-center justify-between transition-transform hover:scale-[1.02] duration-200 ${cardClass}`}
            >
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-1 ${textMuted}`}>
                  {stat.title}
                </h3>
                <div className={`text-3xl font-bold tracking-tight ${textMain}`}>{stat.value}</div>
              </div>
              <div className={`p-3 rounded-2xl ${c.bg} ${c.text}`}>
                {Icon && <Icon size={20} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ ROW 2: CHART + NOTIFICATIONS ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border ${cardClass}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-lg font-semibold tracking-tight ${textMain}`}>
              Leave Requests per Month
            </h2>
            <button className="text-sm text-amber-500 font-medium hover:text-amber-600 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hodLeaveTrends} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2C2C2E' : '#E5E5EA'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E8E93', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? 'rgba(28,28,30,0.95)' : 'rgba(255,255,255,0.95)',
                    color: isDark ? '#fff' : '#000',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#FF9F0A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FF9F0A', strokeWidth: 2, stroke: isDark ? '#1C1C1E' : '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications */}
        <div className={`p-6 rounded-3xl border flex flex-col ${cardClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-full ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
              <Bell size={18} />
            </div>
            <h2 className={`text-lg font-semibold tracking-tight ${textMain}`}>Leave Requests</h2>
          </div>
          <ul className="space-y-3 overflow-y-auto flex-1 pr-2">
            {hodNotifications.map((req) => (
              <li
                key={req.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  isDark ? 'bg-[#2C2C2E] border-[#3A3A3C]' : 'bg-white border-gray-100'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {req.teacher.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${textMain}`}>
                    <span className="font-semibold">{req.teacher}</span> • {req.type}
                  </p>
                  <span className={`text-xs ${textMuted}`}>{req.date}</span>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleApproval(req.id, 'approve')}
                    className={`p-1.5 rounded-full ${
                      isDark ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleApproval(req.id, 'reject')}
                    className={`p-1.5 rounded-full ${
                      isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============ ROW 3: WORK HOURS ============ */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className={`p-2 rounded-full ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Clock size={18} />
          </div>
          <h2 className={`text-lg font-semibold tracking-tight ${textMain}`}>
            Teacher Work Hours vs Total Work Hours
          </h2>
        </div>
        <div className="space-y-6">
          {hodWorkHours.map((t) => {
            const pct = (t.hoursDone / t.totalHours) * 100;
            let color = 'bg-green-500';
            if (pct < 80) color = 'bg-amber-500';
            if (pct < 50) color = 'bg-red-500';
            return (
              <div key={t.teacher} className="flex flex-col gap-2">
                <div className={`flex justify-between text-sm font-medium ${textMain}`}>
                  <span>{t.teacher}</span>
                  <span className={textMuted}>{t.hoursDone} / {t.totalHours} hrs</span>
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100'}`}>
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}