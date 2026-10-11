import { useSelector } from 'react-redux';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';

// ==========================================
// Mock attendance data
// ==========================================
const SUBJECT_ATTENDANCE = [
  { subject: 'Data Structures', code: 'CS301', attended: 42, total: 48, percent: 87.5 },
  { subject: 'DBMS', code: 'CS302', attended: 38, total: 45, percent: 84.4 },
  { subject: 'Compiler Design', code: 'CS701', attended: 41, total: 44, percent: 93.2 },
  { subject: 'Computer Networks', code: 'CS702', attended: 34, total: 44, percent: 77.3 },
  { subject: 'Operating Systems', code: 'CS303', attended: 45, total: 48, percent: 93.8 },
  { subject: 'Software Engineering', code: 'CS304', attended: 40, total: 46, percent: 87.0 },
];

export default function AttendancePage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';

  // Overall stats
  const totalAttended = SUBJECT_ATTENDANCE.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = SUBJECT_ATTENDANCE.reduce((sum, s) => sum + s.total, 0);
  const overallPercent = ((totalAttended / totalClasses) * 100).toFixed(1);
  const atRisk = SUBJECT_ATTENDANCE.filter((s) => s.percent < 80);

  const getBarColor = (percent) => {
    if (percent >= 85) return 'bg-green-500';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ============ OVERALL STAT CARD ============ */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Overall Attendance</p>
              <p className={`text-4xl font-bold tracking-tight mt-1 ${textMain}`}>{overallPercent}%</p>
              <p className={`text-xs mt-1 ${textMuted}`}>
                {totalAttended} attended out of {totalClasses} classes
              </p>
            </div>
          </div>

          {/* At-risk warning */}
          {atRisk.length > 0 && (
            <div className={`flex items-start gap-2 p-3 rounded-xl max-w-xs ${
              isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'
            }`}>
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-[11px] font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  {atRisk.length} subject{atRisk.length > 1 ? 's' : ''} below 80%
                </p>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-red-300/70' : 'text-red-600/80'}`}>
                  Attend more classes to stay above the threshold.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ SUBJECT-WISE ============ */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <h2 className={`text-base font-bold mb-5 ${textMain}`}>Subject-wise Attendance</h2>

        <div className="space-y-5">
          {SUBJECT_ATTENDANCE.map((s) => (
            <div key={s.code}>
              <div className="flex items-center justify-between mb-2">
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${textMain}`}>{s.subject}</p>
                  <p className={`text-[11px] ${textMuted}`}>{s.code}</p>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <p className={`text-sm font-bold ${
                    s.percent >= 85 ? 'text-green-500'
                    : s.percent >= 75 ? 'text-amber-500'
                    : 'text-red-500'
                  }`}>
                    {s.percent.toFixed(1)}%
                  </p>
                  <p className={`text-[10px] ${textMuted}`}>
                    {s.attended} / {s.total}
                  </p>
                </div>
              </div>

              <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100'}`}>
                <div
                  className={`h-full ${getBarColor(s.percent)} rounded-full transition-all duration-700`}
                  style={{ width: `${s.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}