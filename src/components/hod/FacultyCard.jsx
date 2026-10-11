import { Mail, BookOpen, Clock, Edit3, UserMinus } from 'lucide-react';

export default function FacultyCard({ member, isDark, onEdit, onRemove }) {

  const cardClass = isDark
    ? 'bg-[#1C1C1E] border-[#2C2C2E] shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
    : 'bg-white border-[#F0F0F0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';

  // Status styles
  const statusStyles = {
    Available: {
      bg: isDark ? 'bg-[#1C2A1F]' : 'bg-[#DCE9F7]',
      text: isDark ? 'text-green-400' : 'text-[#1C1C1E]',
    },
    Busy: {
      bg: isDark ? 'bg-[#2A2118]' : 'bg-[#FEF3C7]',
      text: isDark ? 'text-amber-400' : 'text-[#1C1C1E]',
    },
    'On Leave': {
      bg: isDark ? 'bg-[#2A1A1A]' : 'bg-[#FEE2E2]',
      text: isDark ? 'text-red-400' : 'text-[#1C1C1E]',
    },
  };
  const status = statusStyles[member.status] || statusStyles.Available;

  return (
    <div className={`relative aspect-square flex flex-col rounded-[20px] border transition-all duration-300 hover:-translate-y-0.5 overflow-hidden ${cardClass}`}>

      {/* Status tab (top-right) */}
      <div className={`absolute top-0 right-4 px-4 py-1 rounded-b-[12px] text-xs font-bold shadow-sm z-10 ${status.bg} ${status.text}`}>
        {member.status}
      </div>

      <div className="p-5 flex flex-col flex-1 min-h-0">

        {/* Top: avatar + name + role + department */}
        <div className="flex-shrink-0">

          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold mb-3 ${
            isDark ? 'bg-[#2C2C2E] text-[#64B5F6]' : 'bg-[#DCE9F7] text-[#5B9BD5]'
          }`}>
            {member.initials}
          </div>

          <div className="pr-20">
            <h3 className={`text-base font-bold leading-tight tracking-tight truncate ${textMain}`}>
              {member.name}
            </h3>
            <p className={`text-xs mt-0.5 truncate ${textMuted}`}>{member.role}</p>
          </div>

          <div className="mt-2">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium truncate max-w-full ${
              isDark ? 'bg-[#2C2C2E] text-[#8E8E93]' : 'bg-[#DCE9F7] text-[#5B9BD5]'
            }`}>
              {member.department}
            </span>
          </div>
        </div>

        {/* Middle: details */}
        <div className="flex-1 flex flex-col justify-center gap-2 min-h-0 py-3">
          <div className="flex items-center gap-2">
            <Mail size={14} className={`flex-shrink-0 ${textMuted}`} strokeWidth={1.5} />
            <span className={`text-xs truncate ${textMuted}`}>{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={14} className={`flex-shrink-0 ${textMuted}`} strokeWidth={1.5} />
            <span className={`text-xs truncate ${textMuted}`}>{member.subjects.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className={`flex-shrink-0 ${textMuted}`} strokeWidth={1.5} />
            <span className={`text-xs ${textMuted}`}>
              {member.hoursDone} / {member.hoursTotal} hrs
            </span>
          </div>
        </div>

        {/* Bottom: actions */}
        <div className="flex-shrink-0">
          <div className={`h-px w-full mb-3 ${isDark ? 'bg-[#2C2C2E]' : 'bg-[#F0F0F0]'}`} />
          <div className="flex items-center justify-between">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-sm active:scale-95 transition-all"
            >
              <Edit3 size={12} strokeWidth={2.5} /> Edit
            </button>
            <button
              onClick={onRemove}
              className="flex items-center gap-1 text-xs font-semibold text-[#E53935] hover:text-[#C62828] active:scale-95 transition-all"
            >
              <UserMinus size={14} strokeWidth={2} /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}