import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, Plus, Filter } from 'lucide-react';
import { selectTheme } from '../../store/slices/uiSlice';
import { facultyList as initialFaculty } from '../../lib/mockData';
import FacultyCard from '../../components/hod/FacultyCard';
import FacultyModal from '../../components/hod/FacultyModal';

export default function FacultyPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === 'dark';

  const [faculty, setFaculty] = useState(initialFaculty);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';

  const filtered = faculty.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getInitials = (name) =>
    name.split(' ').filter(Boolean).map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  const openAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSave = (formData) => {
    if (editingMember) {
      setFaculty(faculty.map((f) =>
        f.id === editingMember.id
          ? { ...f, ...formData, initials: getInitials(formData.name) }
          : f
      ));
    } else {
      const newMember = {
        id: Date.now(),
        ...formData,
        initials: getInitials(formData.name),
        hoursDone: 0,
      };
      setFaculty([newMember, ...faculty]);
    }
  };

  const handleRemove = (id, name) => {
    if (confirm(`Remove ${name} from faculty?`)) {
      setFaculty(faculty.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <button
          onClick={openAdd}
          className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
          <input
            type="text"
            placeholder="Search faculty by name, department, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all border focus:ring-2 focus:ring-amber-500/40 ${
              isDark
                ? 'bg-[#1C1C1E] border-[#2C2C2E] text-white placeholder-[#636366]'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <button className={`hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${
          isDark
            ? 'bg-[#1C1C1E] border-[#2C2C2E] text-white hover:bg-[#2C2C2E]'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}>
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className={`text-center py-24 ${textMuted}`}>
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-base font-medium">No faculty found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((member) => (
            <FacultyCard
              key={member.id}
              member={member}
              isDark={isDark}
              onEdit={() => openEdit(member)}
              onRemove={() => handleRemove(member.id, member.name)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingMember}
        isDark={isDark}
      />
    </div>
  );
}