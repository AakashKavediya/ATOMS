// Color palettes matching the reference design
const COLOR_PALETTES = {
  pink:   'from-[#F06292] to-[#EC407A]',
  blue:   'from-[#4FC3F7] to-[#29B6F6]',
  green:  'from-[#66BB6A] to-[#43A047]',
  teal:   'from-[#26C6DA] to-[#00ACC1]',
  orange: 'from-[#FFA726] to-[#FB8C00]',
  purple: 'from-[#AB47BC] to-[#8E24AA]',
};

export default function ClassBlock({ classData }) {
  const gradient = COLOR_PALETTES[classData.color] || COLOR_PALETTES.blue;

  return (
    <div className={`relative w-full h-full min-h-[88px] p-3 rounded-[14px] bg-gradient-to-br ${gradient} text-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden`}>

      {/* Top-left highlight */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      <div className="relative flex flex-col gap-0.5">
        <h4 className="text-[13px] font-bold leading-tight tracking-tight">
          {classData.subject}
        </h4>
        <p className="text-[11px] font-medium opacity-90 leading-tight">
          {classData.teacher}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] opacity-90">
          <span className="font-semibold">{classData.room}</span>
          <span className="opacity-50">•</span>
          <span>{classData.batch}</span>
        </div>
        <p className="text-[10px] opacity-75 font-medium">{classData.type}</p>
      </div>
    </div>
  );
}