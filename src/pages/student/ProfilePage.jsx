import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, User, GraduationCap, Building2, BookOpen } from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import { selectUser } from '../../store/slices/authSlice';

export default function ProfilePage() {
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || '??';

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ============ HEADER CARD ============ */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${cardClass}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/30">
              {initials}
            </div>
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl font-bold tracking-tight ${textMain}`}>
              {user?.name || 'User'}
            </h1>
            <p className={`text-sm mt-1 ${textMuted}`}>
              {user?.role || 'STUDENT'} • Sem 3 • Division A
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold ${
                isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-700'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold ${
                isDark ? 'bg-[#2C2C2E] text-[#8E8E93]' : 'bg-gray-100 text-gray-600'
              }`}>
                Roll No: CS-2023-042
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ DETAILS GRID ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <InfoCard
          icon={<Mail size={18} />}
          label="Email"
          value={user?.email || '—'}
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />
        <InfoCard
          icon={<Phone size={18} />}
          label="Phone"
          value="+91 98765 43210"
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />
        <InfoCard
          icon={<Building2 size={18} />}
          label="Department"
          value="Computer Science"
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />
        <InfoCard
          icon={<GraduationCap size={18} />}
          label="Semester"
          value="Semester 3"
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />
        <InfoCard
          icon={<BookOpen size={18} />}
          label="Division"
          value="A"
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />
        <InfoCard
          icon={<MapPin size={18} />}
          label="Hostel"
          value="B-204, Boys Hostel"
          isDark={isDark}
          cardClass={cardClass}
          textMain={textMain}
          textMuted={textMuted}
        />

      </div>

      {/* ============ ACADEMIC INFO ============ */}
      <div className={`p-6 rounded-3xl border ${cardClass}`}>
        <h2 className={`text-base font-bold mb-4 ${textMain}`}>Academic Information</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBlock label="CGPA" value="8.4" isDark={isDark} />
          <StatBlock label="Credits Earned" value="82" isDark={isDark} />
          <StatBlock label="Backlogs" value="0" isDark={isDark} />
          <StatBlock label="Attendance" value="87%" isDark={isDark} />
        </div>
      </div>

    </div>
  );
}

// ==========================================
// Small components
// ==========================================
function InfoCard({ icon, label, value, isDark, cardClass, textMain, textMuted }) {
  return (
    <div className={`p-5 rounded-3xl border flex items-start gap-4 ${cardClass}`}>
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${isDark ? 'bg-[#2C2C2E] text-[#8E8E93]' : 'bg-gray-100 text-gray-600'}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{label}</p>
        <p className={`text-sm font-semibold mt-1 truncate ${textMain}`}>{value}</p>
      </div>
    </div>
  );
}

function StatBlock({ label, value, isDark }) {
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  return (
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{label}</p>
      <p className={`text-2xl font-bold tracking-tight mt-1 ${textMain}`}>{value}</p>
    </div>
  );
}