import { useRef } from 'react';
import { X, Check, Printer, Building2, User, AlertCircle } from 'lucide-react';

export default function LeaveDetailModal({ isOpen, onClose, leave, isDark, onApprove, onReject }) {
  const sheetRef = useRef(null);

  if (!isOpen || !leave) return null;

  const affectedLectures = leave.lecturesAffected || [];

  const modalClass = isDark ? 'bg-[#141416] border-[#2C2C2E]' : 'bg-[#F2F2F7] border-gray-200';
  const paperClass = isDark
    ? 'bg-[#1C1C1E] border-[#2C2C2E] shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
    : 'bg-white border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)]';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const tableBorder = isDark ? 'border-[#3A3A3C]' : 'border-gray-300';
  const tableHeaderBg = isDark ? 'bg-[#252527]' : 'bg-[#F9FAFB]';
  const tableRowHover = isDark ? 'hover:bg-[#252527]/60' : 'hover:bg-gray-50/70';
  const divider = isDark ? 'border-[#2C2C2E]' : 'border-gray-200';

  // Print handler — clones sheet into hidden iframe
  const handlePrint = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;

    const html = sheet.outerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teaching Load Adjustment Sheet</title>
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; background: #fff; color: #000; font-size: 11px; }
            #printable-sheet { background: #fff !important; color: #000 !important; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; }
            #printable-sheet * { background: transparent !important; color: #000 !important; border-color: #000 !important; box-shadow: none !important; }
            #printable-sheet [class*="grid-cols-"] { display: grid !important; }
            .border-r { border-right: 1px solid #000 !important; }
            .border-b { border-bottom: 1px solid #000 !important; }
            .border-t { border-top: 1px solid #000 !important; }
            .border-2 { border: 2px solid #000 !important; }
            .border-dotted { border-style: dotted !important; }
            .border-dashed { border-style: dashed !important; }
            .text-center { text-align: center !important; }
            .text-right { text-align: right !important; }
            .font-bold { font-weight: 700 !important; }
            .font-semibold { font-weight: 600 !important; }
            .uppercase { text-transform: uppercase !important; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) { console.error(e); }
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-5xl max-h-[95vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden ${modalClass}`}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isDark ? 'border-[#2C2C2E] bg-[#141416]/95' : 'border-gray-200 bg-white/95'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <AlertCircle size={18} />
            </div>
            <div className="min-w-0">
              <h2 className={`text-base font-bold tracking-tight truncate ${textMain}`}>Teaching Load Adjustment</h2>
              <p className={`text-[11px] truncate ${textMuted}`}>Leave Request from {leave.teacherName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              isDark ? 'hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5">

          {/* Paper sheet — ref target */}
          <div ref={sheetRef} id="printable-sheet" className={`rounded-2xl border ${paperClass} p-6 sm:p-10`}>

            {/* Letterhead */}
            <div className={`text-center mb-6 pb-6 border-b-2 border-dashed ${divider}`}>
              <h1 className={`text-sm sm:text-base font-bold tracking-wide uppercase leading-tight ${textMain}`}>
                K. J. Somaiya Institute of Engineering and Information Technology, Sion
              </h1>
              <h2 className={`text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-2 ${textMain}`}>
                Teaching Load Adjustment Sheet
              </h2>
            </div>

            {/* Department + Faculty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-baseline gap-2">
                <Building2 size={12} className={`flex-shrink-0 mb-0.5 ${textMuted}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${textMuted}`}>Department :</span>
                <span className={`flex-1 text-xs font-bold border-b border-dotted pb-0.5 ${tableBorder} ${textMain}`}>
                  {leave.department || 'Electronics and Telecommunication'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <User size={12} className={`flex-shrink-0 mb-0.5 ${textMuted}`} />
                <span className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${textMuted}`}>Faculty Name :</span>
                <span className={`flex-1 text-xs font-bold border-b border-dotted pb-0.5 ${tableBorder} ${textMain}`}>
                  {leave.teacherName}
                </span>
              </div>
            </div>

            {/* Main table */}
            <div className={`rounded-lg border-2 overflow-hidden ${tableBorder}`}>
              <div className={`grid grid-cols-[0.9fr_1.1fr_0.5fr_1.6fr_0.9fr_1.4fr_1.1fr_0.7fr_0.8fr] text-[9px] sm:text-[10px] font-bold uppercase tracking-tight text-center ${tableHeaderBg} ${textMain}`}>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Day & Date</div>
                <div className={`grid grid-rows-[auto_1fr] border-r ${tableBorder}`}>
                  <div className={`px-1 py-1 border-b text-center leading-tight ${tableBorder}`}>Duration</div>
                  <div className="grid grid-cols-2">
                    <div className={`px-1 py-1.5 border-r text-center ${tableBorder}`}>From</div>
                    <div className="px-1 py-1.5 text-center">To</div>
                  </div>
                </div>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Room No.</div>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Semester, Branch, Division & Subject</div>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Lecture / Lab / Tutorial</div>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Name & Signature of person who will engage</div>
                <div className={`px-1 py-3 border-r flex items-center justify-center leading-tight ${tableBorder}`}>Date on which Lecture will be Compensated</div>
                <div className={`grid grid-rows-[auto_1fr] border-r ${tableBorder}`}>
                  <div className={`px-1 py-1 border-b text-center leading-tight ${tableBorder}`}>Duration</div>
                  <div className="grid grid-cols-2">
                    <div className={`px-1 py-1.5 border-r text-center ${tableBorder}`}>From</div>
                    <div className="px-1 py-1.5 text-center">To</div>
                  </div>
                </div>
                <div className={`px-1 py-3 flex items-center justify-center leading-tight ${textMain}`}>Remarks</div>
              </div>

              {/* Rows */}
              {affectedLectures.map((lecture, idx) => {
                const [fromTime, toTime] = lecture.time.split(' - ');
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-[0.9fr_1.1fr_0.5fr_1.6fr_0.9fr_1.4fr_1.1fr_0.7fr_0.8fr] text-[10px] sm:text-[11px] border-t ${tableBorder} ${tableRowHover}`}
                  >
                    <div className={`px-1 py-4 border-r text-center ${tableBorder} ${textMuted}`}>{leave.date}</div>
                    <div className={`grid grid-cols-2 border-r ${tableBorder}`}>
                      <div className={`px-1 py-4 border-r text-center font-medium ${tableBorder} ${textMuted}`}>{fromTime}</div>
                      <div className={`px-1 py-4 text-center font-medium ${textMuted}`}>{toTime}</div>
                    </div>
                    <div className={`px-1 py-4 border-r text-center font-medium ${tableBorder} ${textMuted}`}>
                      {lecture.room.replace('CR: ', '').replace('LAB: ', '')}
                    </div>
                    <div className={`px-2 py-4 border-r text-center font-semibold ${tableBorder} ${textMain}`}>
                      <p className="leading-tight">{lecture.class}</p>
                      <p className={`text-[10px] mt-0.5 font-medium ${textMuted}`}>{lecture.subject}</p>
                    </div>
                    <div className={`px-1 py-4 border-r text-center ${tableBorder} ${textMuted}`}>Lecture</div>
                    <div className={`px-1 py-4 border-r text-center font-medium ${tableBorder} ${textMain}`}>
                      {leave.substituteName || '—'}
                    </div>
                    <div className={`px-1 py-4 border-r text-center font-medium ${tableBorder} ${textMuted}`}>
                      {leave.compensationDate || '—'}
                    </div>
                    <div className={`grid grid-cols-2 border-r ${tableBorder}`}>
                      <div className={`px-1 py-4 border-r text-center ${tableBorder} ${textMuted}`}>—</div>
                      <div className={`px-1 py-4 text-center ${textMuted}`}>—</div>
                    </div>
                    <div className={`px-1 py-4 text-center ${textMuted}`}>{leave.remarks || '—'}</div>
                  </div>
                );
              })}

              {/* Empty filler rows */}
              {affectedLectures.length < 3 &&
                Array.from({ length: 3 - affectedLectures.length }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className={`grid grid-cols-[0.9fr_1.1fr_0.5fr_1.6fr_0.9fr_1.4fr_1.1fr_0.7fr_0.8fr] h-12 border-t ${tableBorder}`}
                  >
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`grid grid-cols-2 border-r ${tableBorder}`}>
                      <div className={`border-r ${tableBorder}`} />
                      <div />
                    </div>
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`border-r ${tableBorder}`} />
                    <div className={`grid grid-cols-2 border-r ${tableBorder}`}>
                      <div className={`border-r ${tableBorder}`} />
                      <div />
                    </div>
                    <div />
                  </div>
                ))}
            </div>

            {/* Signature */}
            <div className="mt-8 flex justify-end">
              <div className="text-right">
                <div className={`w-52 border-b border-dotted mb-2 ${tableBorder}`} />
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted}`}>Signature of the Faculty Member</p>
              </div>
            </div>

            {/* HOD remarks */}
            <div className="mt-8 flex items-center justify-between">
              <p className={`text-xs font-bold ${textMain}`}>Remarks and Signature of the Head of the Department:</p>
              <div className="flex items-center gap-4">
                <span className={`text-[11px] font-bold ${textMuted}`}>Accepted</span>
                <div className={`w-5 h-5 rounded border-2 ${tableBorder}`} />
                <span className={`text-[11px] font-bold ${textMuted}`}>Not Accepted</span>
                <div className={`w-5 h-5 rounded border-2 ${tableBorder}`} />
              </div>
            </div>

            {/* Instructions */}
            <div className={`mt-8 p-4 rounded-xl border-2 border-dashed ${isDark ? 'border-[#2C2C2E] bg-[#252527]/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle size={14} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${textMain}`}>HOD Please make sure that</p>
              </div>
              <div className={`space-y-1 ml-6 text-[11px] leading-relaxed ${textMuted}`}>
                <p>(1) The students do not remain unengaged during the lecture practical / tutorial periods.</p>
                <p>(2) Lost period is made up at another date and time.</p>
              </div>
            </div>

          </div>
          {/* END PAPER SHEET */}

        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 flex-shrink-0 ${
          isDark ? 'border-[#2C2C2E] bg-[#141416]/95' : 'border-gray-200 bg-white/95'
        }`}>
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              isDark ? 'text-white bg-[#2C2C2E] hover:bg-[#3A3A3C]' : 'text-[#1C1C1E] bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Printer size={14} /> Print Sheet
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onReject}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                isDark
                  ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border-2 border-rose-500/30'
                  : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200'
              }`}
            >
              <X size={14} strokeWidth={3} /> Not Accepted
            </button>
            <button
              onClick={onApprove}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 transition-all active:scale-95"
            >
              <Check size={14} strokeWidth={3} /> Accepted
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}