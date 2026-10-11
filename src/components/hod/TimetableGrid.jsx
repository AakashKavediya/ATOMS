import { useSelector } from 'react-redux';
import ClassBlock from './ClassBlock';
import { selectTheme } from '../../store/slices/uiSlice';
import {
  timetableDays as days,
  timetableSlots as timeSlots,
  timetableData,
} from '../../lib/mockData';

export default function TimetableGrid() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const containerClass = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const headerBg = isDark ? 'bg-[#252527]' : 'bg-[#F9FAFB]';
  const rowBorder = isDark ? 'border-[#2C2C2E]' : 'border-gray-100';

  return (
    <div className={`rounded-[24px] border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] ${containerClass}`}>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">

          {/* Header row */}
          <div className={`grid grid-cols-[80px_repeat(6,1fr)] border-b ${rowBorder} ${headerBg}`}>
            <div className={`px-4 py-4 text-xs font-semibold uppercase tracking-wider ${textMuted}`}>
              Time
            </div>
            {days.map((day) => (
              <div key={day} className={`px-4 py-4 text-sm font-semibold text-center ${textMain}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Body rows */}
          {timeSlots.map((time, idx) => (
            <div
              key={time}
              className={`grid grid-cols-[80px_repeat(6,1fr)] ${
                idx !== timeSlots.length - 1 ? `border-b ${rowBorder}` : ''
              }`}
            >
              {/* Time label */}
              <div className={`px-4 py-3 text-xs font-semibold flex items-start pt-5 ${textMuted}`}>
                {time}
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const classData = timetableData[day]?.[time];
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`p-2 min-h-[100px] border-l ${rowBorder}`}
                  >
                    {classData ? (
                      <ClassBlock classData={classData} />
                    ) : (
                      <div className={`w-full h-full rounded-[14px] ${
                        isDark ? 'bg-[#252527]/50' : 'bg-gray-50/50'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}