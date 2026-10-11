import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ChevronDown,
  Calendar,
  UploadCloud,
  Check,
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';

// ==========================================
// Placeholder data
// ==========================================
const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Comp Off', 'Duty Leave'];
const MONTH_OPTIONS = ['August', 'September', 'October', 'November'];

// Lectures that will be affected (in production, fetched based on selected dates)
const AFFECTED_LECTURES = [
  { id: 101, subject: 'Data Structures', class: 'Sem 3 - Div A', time: '09:00 — 10:00', room: 'C-204' },
  { id: 102, subject: 'DBMS', class: 'Sem 3 - Div B', time: '11:00 — 12:00', room: 'C-108' },
  { id: 103, subject: 'Compiler Design', class: 'Sem 7 - Div A', time: '14:00 — 16:00', room: 'Lab 3' },
];

// Available teachers (in production, fetched from backend)
const AVAILABLE_TEACHERS = [
  { id: 't1', name: 'Prof. R. Iyer', dept: 'Computer Science' },
  { id: 't2', name: 'Prof. S. Mehta', dept: 'Computer Science' },
  { id: 't3', name: 'Prof. A. Kumar', dept: 'Information Technology' },
  { id: 't4', name: 'Prof. N. Sharma', dept: 'Electronics' },
  { id: 't5', name: 'Prof. K. Patel', dept: 'Computer Science' },
];

const APPROVAL_STEPS = [
  { id: 1, label: 'Submitted by you', sublabel: 'Now', status: 'done' },
  { id: 2, label: 'HOD Review', sublabel: 'Pending', status: 'pending' },
  { id: 3, label: 'Substitute Assignment', sublabel: 'Pending', status: 'pending' },
];

const STEPS = [
  { num: 1, label: 'Leave Details' },
  { num: 2, label: 'Reason & Proof' },
  { num: 3, label: 'Substitutes' },
  { num: 4, label: 'Review' },
];

// ==========================================
// Main component
// ==========================================
export default function ApplyLeavePage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [step, setStep] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    fromDate: '2026-08-12',
    toDate: '2026-08-12',
    duration: 'Full Day',
    reason: '',
    notes: '',
  });

  const [substitutes, setSubstitutes] = useState({}); // { lectureId: teacherId }

  // Theme classes
  const cardClass = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-[#2C2C2E] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
    : 'bg-white/80 backdrop-blur-xl border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  const inputClass = isDark
    ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white placeholder-[#636366] focus:border-amber-500/50 focus:ring-amber-500/20'
    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-amber-500/50 focus:ring-amber-500/20';
  const divider = isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100';

  // Navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Format date
  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Assign substitute
  const assignSubstitute = (lectureId, teacherId) => {
    setSubstitutes((prev) => ({ ...prev, [lectureId]: teacherId }));
  };

  const assignedCount = AFFECTED_LECTURES.filter((l) => substitutes[l.id]).length;

  const handleSubmit = () => {
    if (assignedCount < AFFECTED_LECTURES.length) {
      alert(`Please assign a substitute for all ${AFFECTED_LECTURES.length} lectures.`);
      return;
    }
    alert('Leave request submitted with substitute assignments!');
    // TODO: POST to backend
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
              {MONTH_OPTIONS.map((month) => (
                <button
                  key={month}
                  onClick={() => { setSelectedMonth(month); setShowMonthDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    month === selectedMonth
                      ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : isDark ? 'text-white hover:bg-[#2C2C2E]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ============== LEFT: FORM CARD ============== */}
        <div className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${cardClass}`}>

          {/* Step progress indicator */}
          <div className="flex items-center justify-between mb-8 sm:mb-10 overflow-x-auto pb-1">
            {STEPS.map((s, idx) => {
              const isActive = step === s.num;
              const isCompleted = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive || isCompleted
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : isDark
                          ? 'bg-[#2C2C2E] text-[#8E8E93]'
                          : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : s.num}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold hidden sm:inline ${
                      isActive || isCompleted ? textMain : textMuted
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-6 sm:w-12 h-px ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* ============ STEP 1: LEAVE DETAILS ============ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className={`w-full appearance-none px-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                  >
                    {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>From</label>
                  <div className="relative">
                    <Calendar size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`} />
                    <input
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className={`w-full pl-10 pr-3 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>To</label>
                  <div className="relative">
                    <Calendar size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`} />
                    <input
                      type="date"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className={`w-full pl-10 pr-3 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Duration</label>
                <div className={`grid grid-cols-2 p-1 rounded-2xl ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100'}`}>
                  {['Half Day', 'Full Day'].map((d) => {
                    const isActive = formData.duration === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setFormData({ ...formData, duration: d })}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? isDark ? 'bg-[#3A3A3C] text-white shadow-sm' : 'bg-white text-gray-800 shadow-sm'
                            : textMuted
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============ STEP 2: REASON & PROOF ============ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly describe the reason of your leave"
                  rows={4}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 resize-none ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Attachment</label>
                <div className={`flex flex-col items-center justify-center py-10 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
                  isDark ? 'bg-[#2C2C2E]/50 border-[#3A3A3C] hover:border-amber-500/40' : 'bg-gray-50 border-gray-200 hover:border-amber-400'
                }`}>
                  <div className={`p-2.5 rounded-full mb-3 ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'}`}>
                    <UploadCloud size={20} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                  </div>
                  <p className={`text-sm font-semibold ${textMain}`}>Upload supporting document</p>
                  <p className={`text-xs mt-1 ${textMuted}`}>(eg. medical certificate, proof)</p>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${textMuted}`}>Notes for HOD (optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="eg: substitution preference: Prof. R. Iyer"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 ${inputClass}`}
                />
              </div>
            </div>
          )}

          {/* ============ STEP 3: SUBSTITUTES ============ */}
          {step === 3 && (
            <div className="space-y-6">
              <div className={`flex items-start gap-3 p-4 rounded-2xl ${
                isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'
              }`}>
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  <AlertCircle size={14} />
                </div>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                    {AFFECTED_LECTURES.length} lecture{AFFECTED_LECTURES.length > 1 ? 's' : ''} will be affected
                  </p>
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-purple-300/70' : 'text-purple-600/80'}`}>
                    Select a substitute teacher for each lecture. Requests will be sent to them after HOD approval.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {AFFECTED_LECTURES.map((lecture) => (
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
                          <Users size={10} /> {lecture.class}
                        </span>
                        <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
                          <Clock size={10} /> {lecture.time}
                        </span>
                        <span className={`text-[11px] flex items-center gap-1 ${textMuted}`}>
                          <MapPin size={10} /> {lecture.room}
                        </span>
                      </div>
                    </div>

                    <select
                      value={substitutes[lecture.id] || ''}
                      onChange={(e) => assignSubstitute(lecture.id, e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all focus:ring-2 ${inputClass}`}
                    >
                      <option value="">Select substitute teacher...</option>
                      {AVAILABLE_TEACHERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} — {t.dept}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-50'}`}>
                <span className={`text-xs font-semibold ${textMuted}`}>Progress</span>
                <span className={`text-xs font-bold ${
                  assignedCount === AFFECTED_LECTURES.length
                    ? 'text-green-500'
                    : isDark ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {assignedCount} / {AFFECTED_LECTURES.length} assigned
                </span>
              </div>
            </div>
          )}

          {/* ============ STEP 4: REVIEW ============ */}
          {step === 4 && (
            <div className="space-y-1">
              <ReviewRow label="Leave Type" value={formData.leaveType} isDark={isDark} />
              <ReviewRow label="Dates" value={`${formatDate(formData.fromDate)} – ${formatDate(formData.toDate)}`} isDark={isDark} />
              <ReviewRow label="Duration" value={formData.duration} isDark={isDark} />
              <ReviewRow label="Affected Lectures" value={`${AFFECTED_LECTURES.length} lectures`} isDark={isDark} />

              <div className={`mt-5 pt-5 border-t ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                  <h4 className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Substitute Assignments</h4>
                </div>

                <div className="space-y-2">
                  {AFFECTED_LECTURES.map((lecture) => {
                    const teacherId = substitutes[lecture.id];
                    const teacher = AVAILABLE_TEACHERS.find((t) => t.id === teacherId);
                    return (
                      <div
                        key={lecture.id}
                        className={`flex items-center justify-between py-2.5 px-3 rounded-xl ${
                          isDark ? 'bg-[#2C2C2E]/40' : 'bg-gray-50/60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${textMain}`}>{lecture.subject}</p>
                          <p className={`text-[10px] mt-0.5 ${textMuted}`}>{lecture.time}</p>
                        </div>
                        <span className={`text-xs font-semibold ml-3 ${
                          teacher
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-red-400' : 'text-red-500'
                        }`}>
                          {teacher ? teacher.name : 'Not assigned'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step actions */}
          <div className={`flex items-center justify-between gap-3 mt-10 pt-6 border-t ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
            {step > 1 ? (
              <button
                onClick={prevStep}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  isDark
                    ? 'text-[#8E8E93] bg-[#2C2C2E] hover:bg-[#3A3A3C] hover:text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-md shadow-amber-500/30 transition-all active:scale-95"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-md shadow-amber-500/30 transition-all active:scale-95"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>

        {/* ============== RIGHT: SIDEBAR ============== */}
        <div className="space-y-6">

          {/* Lecture Affected */}
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <h3 className={`text-base font-bold mb-4 ${textMain}`}>Lecture Affected</h3>
            <div className="space-y-2.5">
              {AFFECTED_LECTURES.map((lec) => (
                <div
                  key={lec.id}
                  className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border ${
                    isDark ? 'bg-[#2C2C2E]/50 border-[#2C2C2E]' : 'bg-gray-50/60 border-gray-100'
                  }`}
                >
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-orange-400" />
                  <div className="pl-3 min-w-0 flex-1">
                    <h4 className={`text-xs font-bold truncate ${textMain}`}>{lec.subject}</h4>
                    <p className={`text-[10px] mt-0.5 truncate ${textMuted}`}>{lec.class}</p>
                  </div>
                  <span className={`text-[10px] font-medium flex-shrink-0 ${textMuted}`}>
                    {lec.time.split(' — ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Status */}
          <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <h3 className={`text-base font-bold mb-5 ${textMain}`}>Approval Status</h3>
            <div>
              {APPROVAL_STEPS.map((s, idx) => {
                const isDone = s.status === 'done';
                const isLast = idx === APPROVAL_STEPS.length - 1;
                return (
                  <div key={s.id} className="relative flex gap-3">
                    {!isLast && (
                      <div className={`absolute left-2.5 top-6 bottom-0 w-px ${divider}`} style={{ height: 'calc(100% - 6px)' }} />
                    )}
                    <div className={`relative z-10 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      isDone
                        ? 'bg-green-500 text-white'
                        : isDark ? 'bg-[#2C2C2E] text-[#636366]' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isDone ? <Check size={10} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <div className="pb-6 min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${isDone ? textMain : textMuted}`}>{s.label}</p>
                      <p className={`text-[10px] mt-0.5 ${textMuted}`}>{s.sublabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// ==========================================
// Reusable: Review Row
// ==========================================
function ReviewRow({ label, value, isDark }) {
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-gray-500';
  const textMain = isDark ? 'text-[#F2F2F7]' : 'text-gray-800';
  const divider = isDark ? 'border-[#2C2C2E]' : 'border-gray-100';
  return (
    <div className={`flex items-center justify-between py-4 border-b ${divider} last:border-b-0`}>
      <span className={`text-sm ${textMuted}`}>{label}</span>
      <span className={`text-sm font-semibold ${textMain}`}>{value}</span>
    </div>
  );
}