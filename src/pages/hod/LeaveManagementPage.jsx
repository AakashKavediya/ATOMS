import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Clock, ChevronRight, Check, X, FileText, Paperclip, Users, MapPin,
} from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import { leaveRequests as initialLeaves } from '../../lib/mockData';
import LeaveDetailModal from '../../components/hod/LeaveDetailModal';
import ViewAttachmentModal from '../../components/hod/ViewAttachmentModal';

export default function LeaveManagementPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [leaves, setLeaves] = useState(initialLeaves);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [attachmentToView, setAttachmentToView] = useState(null);

  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const handleApprove = (id) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'approved' } : l)));
    setSelectedLeave(null);
  };

  const handleReject = (id) => {
    setLeaves(leaves.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l)));
    setSelectedLeave(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {pendingCount > 0 && (
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
            isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-700'
          }`}>
            {pendingCount} Pending
          </span>
          <span className={`text-xs ${textMuted}`}>Review and manage faculty leave requests</span>
        </div>
      )}

      <div className="space-y-5">
        {leaves.map((leave) => (
          <LeaveCard
            key={leave.id}
            leave={leave}
            isDark={isDark}
            textMain={textMain}
            textMuted={textMuted}
            onSeeMore={() => setSelectedLeave(leave)}
            onViewAttachment={() => setAttachmentToView(leave.attachment)}
            onQuickApprove={() => handleApprove(leave.id)}
            onQuickReject={() => handleReject(leave.id)}
          />
        ))}
      </div>

      <LeaveDetailModal
        isOpen={!!selectedLeave}
        onClose={() => setSelectedLeave(null)}
        leave={selectedLeave}
        isDark={isDark}
        onApprove={() => { if (selectedLeave) handleApprove(selectedLeave.id); }}
        onReject={() => { if (selectedLeave) handleReject(selectedLeave.id); }}
      />

      <ViewAttachmentModal
        isOpen={!!attachmentToView}
        onClose={() => setAttachmentToView(null)}
        attachment={attachmentToView}
        isDark={isDark}
      />

    </div>
  );
}

function LeaveCard({ leave, isDark, textMain, textMuted, onSeeMore, onViewAttachment, onQuickApprove, onQuickReject }) {

  const cardClass = isDark
    ? 'bg-[#1C1C1E] border-[#2C2C2E] hover:border-[#3A3A3C] shadow-[0_2px_12px_rgba(0,0,0,0.5)]'
    : 'bg-white border-gray-100 hover:border-gray-200 shadow-[0_2px_16px_rgba(0,0,0,0.04)]';
  const tableHeaderBg = isDark ? 'bg-[#252527]' : 'bg-gray-50';
  const tableRowBorder = isDark ? 'border-[#2C2C2E]' : 'border-gray-100';
  const divider = isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100';

  return (
    <div className={`relative rounded-[22px] border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${cardClass}`}>

      <div className={`absolute left-0 top-0 bottom-0 w-1 ${leave.accentColor}`} />

      <div className="p-5 sm:p-6 pl-6 sm:pl-7">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-start mb-5">

          <div className="flex items-center gap-3.5 lg:col-span-5">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${leave.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0`}>
              {leave.initials}
            </div>
            <div className="min-w-0">
              <h3 className={`text-base font-bold truncate ${textMain}`}>{leave.teacherName}</h3>
              <p className={`text-xs mt-0.5 truncate ${textMuted}`}>{leave.role}</p>
              <p className={`text-[11px] mt-0.5 truncate ${textMuted}`}>{leave.department}</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>Leave Type</p>
            <p className={`text-sm font-semibold ${textMain}`}>{leave.leaveType}</p>
            {leave.attachment ? (
              <button
                onClick={onViewAttachment}
                className={`flex items-center gap-1 text-[11px] font-semibold mt-1 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                }`}
              >
                <Paperclip size={11} /> View attachment
              </button>
            ) : (
              <p className={`text-[11px] mt-1 ${textMuted}`}>No attachment</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>Date</p>
            <p className={`text-sm font-semibold ${textMain}`}>{leave.date}</p>
          </div>

          <div className="lg:col-span-2">
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>Duration</p>
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
              leave.duration === 'Full Day'
                ? isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-600'
                : isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              {leave.duration}
            </span>
          </div>
        </div>

        <div className={`h-px w-full my-5 ${divider}`} />

        {/* Lectures */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <Users size={13} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-widest ${textMain}`}>Lectures Affected</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isDark ? 'bg-[#2C2C2E] text-[#8E8E93]' : 'bg-gray-100 text-gray-600'
            }`}>
              {leave.lecturesAffected.length}
            </span>
          </div>

          <div className={`rounded-[14px] border overflow-hidden ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
            <div className={`grid grid-cols-[110px_2fr_1.5fr_90px] sm:grid-cols-[140px_2fr_1.5fr_100px] gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest ${tableHeaderBg} ${textMuted}`}>
              <span>Time</span>
              <span>Subject</span>
              <span>Class</span>
              <span>Room</span>
            </div>
            {leave.lecturesAffected.map((lecture, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-[110px_2fr_1.5fr_90px] sm:grid-cols-[140px_2fr_1.5fr_100px] gap-3 px-4 py-3 text-sm transition-colors ${
                  idx !== leave.lecturesAffected.length - 1 ? `border-b ${tableRowBorder}` : ''
                } ${isDark ? 'hover:bg-[#252527]' : 'hover:bg-gray-50/50'}`}
              >
                <span className={`flex items-center gap-1.5 font-medium ${textMuted}`}>
                  <Clock size={11} className="opacity-60" />{lecture.time}
                </span>
                <span className={`font-semibold truncate ${textMain}`}>{lecture.subject}</span>
                <span className={`truncate ${textMuted}`}>{lecture.class}</span>
                <span className={`flex items-center gap-1 font-medium ${textMuted}`}>
                  <MapPin size={11} className="opacity-60" />{lecture.room}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isDark ? 'border-[#2C2C2E] bg-[#1A1A1C]' : 'border-gray-100 bg-gray-50/60'
      }`}>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onQuickReject}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              isDark
                ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20'
                : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            <X size={13} strokeWidth={3} /> Reject
          </button>
          <button
            onClick={onQuickApprove}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm transition-all active:scale-95"
          >
            <Check size={13} strokeWidth={3} /> Approve
          </button>
        </div>

        <button
          onClick={onSeeMore}
          className={`group flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 w-full sm:w-auto justify-center ${
            isDark
              ? 'text-white bg-[#2C2C2E] hover:bg-[#3A3A3C]'
              : 'text-[#1C1C1E] bg-white hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText size={13} />
          See Details
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}