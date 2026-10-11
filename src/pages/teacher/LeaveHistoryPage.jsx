import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronDown,
  Search,
  Eye,
  FileText,
  X,
  Calendar,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  BookOpen,
} from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import {
  teacherLeaveHistory as initialHistory,
  availableTeachers,
} from '../../lib/mockData';

const FILTER_TABS = ['All', 'Pending', 'Approved', 'Rejected'];
const MONTH_OPTIONS = ['August', 'September', 'October', 'November'];

// ==========================================
// Main page
// ==========================================
export default function LeaveHistoryPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [substitutes, setSubstitutes] = useState({});

  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';

  // Filter
  const filtered = initialHistory.filter((item) => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch =
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openDetail = (leave) => {
    setSelectedLeave(leave);
    const preload = {};
    leave.affectedLectures?.forEach((l) => {
      if (l.assignedTo) {
        const teacher = availableTeachers.find((t) => t.name === l.assignedTo);
        if (teacher) preload[l.id] = teacher.id;
      }
    });
    setSubstitutes(preload);
  };

  const closeDetail = () => {
    setSelectedLeave(null);
    setSubstitutes({});
  };

  const assignSubstitute = (lectureId, teacherId) => {
    setSubstitutes((prev) => ({ ...prev, [lectureId]: teacherId }));
  };

  const sendSubstitutionRequest = (lectureId) => {
    const teacherId = substitutes[lectureId];
    if (!teacherId) {
      alert('Please select a teacher first.');
      return;
    }
    const teacher = availableTeachers.find((t) => t.id === teacherId);
    alert(`Request sent to ${teacher.name}!`);
  };

  const sendAllRequests = () => {
    if (!selectedLeave) return;
    const missing = selectedLeave.affectedLectures.filter(
      (l) => !substitutes[l.id] && !l.assignedTo
    );
    if (missing.length > 0) {
      alert(`Please select a teacher for all ${missing.length} remaining lecture(s).`);
      return;
    }
    alert('All substitution requests sent!');
    closeDetail();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

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

      {/* Main card */}
      <div className={`rounded-3xl border transition-colors ${cardClass}`}>

        {/* Tabs + search */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 border-b ${
          isDark ? 'border-[#2C2C2E]' : 'border-gray-100'
        }`}>
          <div className={`flex items-center gap-1 p-1 rounded-2xl w-full md:w-auto ${
            isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100'
          }`}>
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#1C1C1E] text-white shadow-sm'
                        : 'bg-white text-gray-800 shadow-sm'
                      : textMuted
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className={`w-full pl-9 pr-4 py-2.5 rounded-2xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/40 ${
                isDark
                  ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white placeholder-[#636366]'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">

            {/* Header */}
            <div className={`grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1.5fr_80px] gap-4 px-6 py-4 text-[11px] font-bold uppercase tracking-widest ${
              isDark
                ? 'text-[#8E8E93] border-b border-[#2C2C2E]'
                : 'text-gray-400 border-b border-gray-100'
            }`}>
              <span>Date</span>
              <span>Leave Type</span>
              <span>Duration</span>
              <span>Status</span>
              <span>HOD Remarks</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div className={`py-16 text-center ${textMuted}`}>
                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No leave records found</p>
              </div>
            ) : (
              filtered.map((item, idx) => (
                <LeaveRow
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  textMain={textMain}
                  textMuted={textMuted}
                  isLast={idx === filtered.length - 1}
                  onView={() => openDetail(item)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedLeave && (
        <LeaveDetailModal
          leave={selectedLeave}
          isDark={isDark}
          onClose={closeDetail}
          substitutes={substitutes}
          onAssign={assignSubstitute}
          onSendRequest={sendSubstitutionRequest}
          onSendAll={sendAllRequests}
          availableTeachers={availableTeachers}
        />
      )}
    </div>
  );
}

// ==========================================
// Leave row
// ==========================================
function LeaveRow({ item, isDark, textMain, textMuted, isLast, onView }) {

  const statusStyles = {
    Pending: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-yellow-100 text-yellow-700',
    Approved: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
    Rejected: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
  };
  const statusClass = statusStyles[item.status] || statusStyles.Pending;

  return (
    <div
      className={`grid grid-cols-[1.2fr_1.2fr_0.8fr_0.8fr_1.5fr_80px] gap-4 px-6 py-4 items-center transition-colors ${
        !isLast
          ? isDark
            ? 'border-b border-[#2C2C2E]'
            : 'border-b border-gray-100'
          : ''
      } ${isDark ? 'hover:bg-[#2C2C2E]/40' : 'hover:bg-gray-50/60'}`}
    >
      <span className={`text-sm ${textMain}`}>{item.date}</span>
      <span className={`text-sm ${textMain}`}>{item.type}</span>
      <span className={`text-sm ${textMuted}`}>{item.duration}</span>
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold w-fit ${statusClass}`}>
        {item.status}
      </span>
      <span className={`text-sm truncate ${textMuted}`}>{item.remarks}</span>
      <button
        onClick={onView}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
          isDark
            ? 'border-[#3A3A3C] text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Eye size={12} />
        View
      </button>
    </div>
  );
}

// ==========================================
// Detail modal (with substitute assignment)
// ==========================================
function LeaveDetailModal({
  leave,
  isDark,
  onClose,
  substitutes,
  onAssign,
  onSendRequest,
  onSendAll,
  availableTeachers,
}) {
  // Guard: return early if no leave selected
  if (!leave) return null;

  const modalClass = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  const divider = isDark ? 'border-[#2C2C2E]' : 'border-gray-100';
  const selectBg = isDark
    ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white'
    : 'bg-white border-gray-200 text-gray-800';

  const affectedLectures = leave.affectedLectures || [];
  const needsSubstitute = leave.status !== 'Rejected' && affectedLectures.length > 0;
  const isPending = leave.status === 'Pending';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-2xl max-h-[95vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden ${modalClass}`}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${divider}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h2 className={`text-base font-bold tracking-tight truncate ${textMain}`}>Leave Request</h2>
              <p className={`text-[11px] truncate ${textMuted}`}>{leave.date} • {leave.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={<Calendar size={14} />} label="Date" value={leave.date} isDark={isDark} />
            <InfoItem icon={<Clock size={14} />} label="Duration" value={leave.duration} isDark={isDark} />
            <InfoItem
              icon={<AlertCircle size={14} />}
              label="Status"
              value={leave.status}
              isDark={isDark}
              valueClass={
                leave.status === 'Approved' ? 'text-green-500' :
                leave.status === 'Rejected' ? 'text-red-500' :
                'text-amber-500'
              }
            />
            <InfoItem icon={<BookOpen size={14} />} label="Leave Type" value={leave.type} isDark={isDark} />
          </div>

          {/* HOD remarks */}
          {leave.remarks && (
            <div className={`p-3 rounded-xl ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-50'}`}>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${textMuted}`}>HOD Remarks</p>
              <p className={`text-sm ${textMain}`}>{leave.remarks}</p>
            </div>
          )}

          {/* Substitution section */}
          {needsSubstitute && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <Users size={14} />
                </div>
                <h3 className={`text-sm font-bold uppercase tracking-widest ${textMain}`}>Substitute Assignment</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isDark ? 'bg-[#2C2C2E] text-[#8E8E93]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {affectedLectures.length} lecture{affectedLectures.length > 1 ? 's' : ''}
                </span>
              </div>

              <p className={`text-xs mb-4 ${textMuted}`}>
                {isPending
                  ? 'Since your leave is pending, you can pre-assign substitutes. Requests will be sent after HOD approval.'
                  : 'Assign a substitute teacher for each affected lecture.'}
              </p>

              <div className="space-y-3">
                {affectedLectures.map((lecture) => {
                  const isConfirmed = !!lecture.assignedTo;
                  return (
                    <div
                      key={lecture.id}
                      className={`p-4 rounded-2xl border ${
                        isDark ? 'bg-[#2C2C2E]/40 border-[#2C2C2E]' : 'bg-gray-50/60 border-gray-100'
                      }`}
                    >
                      <div className="mb-3">
                        <h4 className={`text-sm font-bold ${textMain}`}>{lecture.subject}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
                            <Calendar size={10} /> {lecture.class}
                          </span>
                          <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
                            <Clock size={10} /> {lecture.time}
                          </span>
                          <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
                            <MapPin size={10} /> {lecture.room}
                          </span>
                        </div>
                      </div>

                      {isConfirmed ? (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                          isDark ? 'bg-green-500/10' : 'bg-green-50'
                        }`}>
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className={`text-xs font-semibold ${textMain}`}>
                            Assigned to <span className="text-green-500">{lecture.assignedTo}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={substitutes[lecture.id] || ''}
                            onChange={(e) => onAssign(lecture.id, e.target.value)}
                            className={`flex-1 px-3 py-2.5 rounded-xl border text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500/40 ${selectBg}`}
                          >
                            <option value="">Select teacher...</option>
                            {availableTeachers.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} — {t.dept}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => onSendRequest(lecture.id)}
                            disabled={!substitutes[lecture.id]}
                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                              substitutes[lecture.id]
                                ? 'text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-md shadow-amber-500/30'
                                : isDark
                                  ? 'bg-[#2C2C2E] text-[#636366] cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Send size={12} />
                            Request
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {leave.status === 'Rejected' && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${
              isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-100'
            }`}>
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                This leave was rejected, so no substitute assignment is required.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 flex-shrink-0 ${
          isDark ? 'border-[#2C2C2E] bg-[#1A1A1C]' : 'border-gray-100 bg-gray-50/70'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-colors ${
              isDark
                ? 'text-[#8E8E93] hover:bg-[#2C2C2E] hover:text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Close
          </button>

          {needsSubstitute && !affectedLectures.every((l) => l.assignedTo) && (
            <button
              onClick={onSendAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-md shadow-amber-500/30 transition-all active:scale-95"
            >
              <Send size={13} />
              Send All Requests
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// Small helper: InfoItem
// ==========================================
function InfoItem({ icon, label, value, isDark, valueClass }) {
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  return (
    <div>
      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1 ${textMuted}`}>
        {icon}
        {label}
      </div>
      <p className={`text-sm font-semibold ${valueClass || textMain}`}>{value}</p>
    </div>
  );
}