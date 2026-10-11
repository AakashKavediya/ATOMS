import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronDown,
  User,
  Calendar,
  MapPin,
  Clock,
  Check,
  X,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import { substituteRequests as initialRequests } from '../../lib/mockData';

const MONTH_OPTIONS = ['August', 'September', 'October', 'November'];

// ==========================================
// Main page
// ==========================================
export default function SubstitutionsPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [requests, setRequests] = useState(initialRequests);
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';

  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Accepted' } : r))
    );
  };

  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  };

  const handleViewTimetable = () => {
    alert('Navigate to full timetable view');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Month selector */}
      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-medium transition-colors ${
              isDark
                ? 'bg-[#1C1C1E] border-[#2C2C2E] text-white hover:bg-[#2C2C2E]'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{selectedMonth}</span>
            <ChevronDown size={14} className={`transition-transform ${showMonthDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showMonthDropdown && (
            <div className={`absolute right-0 mt-2 w-40 rounded-2xl border shadow-xl overflow-hidden z-20 ${
              isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100'
            }`}>
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    m === selectedMonth
                      ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : isDark ? 'text-white hover:bg-[#2C2C2E]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of cards */}
      {requests.length === 0 ? (
        <div className={`text-center py-24 ${textMuted}`}>
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-base font-medium">No substitution requests</p>
          <p className="text-sm mt-1">You're all caught up</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => (
            <SubstitutionCard
              key={req.id}
              req={req}
              isDark={isDark}
              textMain={textMain}
              textMuted={textMuted}
              onAccept={() => handleAccept(req.id)}
              onReject={() => handleReject(req.id)}
              onViewTimetable={handleViewTimetable}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// Substitution card
// ==========================================
function SubstitutionCard({
  req,
  isDark,
  textMain,
  textMuted,
  onAccept,
  onReject,
  onViewTimetable,
}) {

  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';

  const statusStyles = {
    Pending: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-100 text-yellow-700',
    Accepted: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    Rejected: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
  };
  const statusClass = statusStyles[req.status] || statusStyles.Pending;
  const isActionable = req.status === 'Pending';

  return (
    <div className={`p-5 rounded-3xl border flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg ${cardClass}`}>

      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        {req.requestId ? (
          <span className={`text-[11px] font-mono font-semibold ${textMuted}`}>
            {req.requestId}
          </span>
        ) : <span />}
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusClass}`}>
          {req.status}
        </span>
      </div>

      {/* Subject */}
      <h3 className={`text-base font-bold mb-4 ${textMain}`}>{req.subject}</h3>

      {/* Details */}
      <div className="space-y-2.5 mb-4">
        <DetailRow icon={<User size={14} />} text={req.teacher} isDark={isDark} />
        <DetailRow icon={<Calendar size={14} />} text={`${req.day} • ${req.classInfo}`} isDark={isDark} />
        <DetailRow icon={<MapPin size={14} />} text={req.room} isDark={isDark} />
        <DetailRow icon={<Clock size={14} />} text={req.time} isDark={isDark} />
      </div>

      {/* Remark */}
      {req.remark && (
        <div className={`px-3 py-2.5 rounded-xl mb-4 ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-50'}`}>
          <p className={`text-[11px] ${textMuted}`}>{req.remark}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={onAccept}
          disabled={!isActionable}
          className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
            isActionable
              ? 'text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-md shadow-amber-500/30'
              : isDark
                ? 'bg-[#2C2C2E] text-[#636366] cursor-not-allowed'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Check size={12} className="inline mr-1" strokeWidth={3} />
          Accept
        </button>

        <button
          onClick={onReject}
          disabled={!isActionable}
          className={`flex-1 px-3 py-2 rounded-full text-xs font-bold border transition-all active:scale-95 ${
            isActionable
              ? isDark
                ? 'border-[#3A3A3C] text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              : isDark
                ? 'border-[#2C2C2E] text-[#636366] cursor-not-allowed'
                : 'border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <X size={12} className="inline mr-1" strokeWidth={3} />
          Reject
        </button>

        <button
          onClick={onViewTimetable}
          className={`px-2 py-2 rounded-full text-xs font-semibold transition-colors ${
            isDark
              ? 'text-[#8E8E93] hover:text-white hover:bg-[#3A3A3C]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="View Timetable"
        >
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}

// ==========================================
// Small helper: Detail row
// ==========================================
function DetailRow({ icon, text, isDark }) {
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  return (
    <div className="flex items-center gap-2.5">
      <span className={`flex-shrink-0 ${textMuted}`}>{icon}</span>
      <span className={`text-xs ${textMuted}`}>{text}</span>
    </div>
  );
}