import { useState, useEffect } from 'react';
import { X, Plus, User, Mail, BookOpen, Building2, Clock, Check } from 'lucide-react';

export default function FacultyModal({ isOpen, onClose, onSave, initialData = null, isDark }) {
  const mode = initialData ? 'edit' : 'add';

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    subjects: [],
    hoursTotal: 22,
    status: 'Available',
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [errors, setErrors] = useState({});

  // Load existing data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || '',
        department: initialData.department || '',
        email: initialData.email || '',
        subjects: initialData.subjects || [],
        hoursTotal: initialData.hoursTotal || 22,
        status: initialData.status || 'Available',
      });
    } else {
      setFormData({
        name: '', role: '', department: '', email: '',
        subjects: [], hoursTotal: 22, status: 'Available',
      });
    }
    setErrors({});
    setSubjectInput('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Theme classes
  const modalClass = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const inputClass = isDark
    ? 'bg-[#2C2C2E] border-[#3A3A3C] text-white placeholder-[#636366] focus:border-amber-500/50 focus:ring-amber-500/20'
    : 'bg-gray-50 border-gray-200 text-[#1C1C1E] placeholder-gray-400 focus:border-amber-500/50 focus:ring-amber-500/20';

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !formData.subjects.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, subjects: [...prev.subjects, trimmed] }));
      setSubjectInput('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData((prev) => ({ ...prev, subjects: prev.subjects.filter((s) => s !== subject) }));
  };

  const handleSubjectKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  const statusOptions = [
    { value: 'Available', color: 'bg-green-500' },
    { value: 'Busy', color: 'bg-amber-500' },
    { value: 'On Leave', color: 'bg-red-500' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] border shadow-2xl max-h-[95vh] flex flex-col ${modalClass}`}
      >

        {/* Header */}
        <div className={`flex items-center justify-between p-6 pb-4 border-b ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              {mode === 'add' ? <Plus size={20} /> : <User size={20} />}
            </div>
            <div>
              <h2 className={`text-lg font-bold tracking-tight ${textMain}`}>
                {mode === 'add' ? 'Add Faculty' : 'Edit Faculty'}
              </h2>
              <p className={`text-xs ${textMuted}`}>
                {mode === 'add' ? 'Fill in the details below' : 'Update the faculty information'}
              </p>
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">

          {/* Name */}
          <FormField label="Full Name" icon={<User size={14} />} error={errors.name} isDark={isDark}>
            <input
              type="text"
              placeholder="Dr. Neha Gupta"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2 ${inputClass}`}
            />
          </FormField>

          {/* Role + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Role" icon={<User size={14} />} error={errors.role} isDark={isDark}>
              <input
                type="text"
                placeholder="Associate Professor"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2 ${inputClass}`}
              />
            </FormField>
            <FormField label="Department" icon={<Building2 size={14} />} error={errors.department} isDark={isDark}>
              <input
                type="text"
                placeholder="Electronics & Telecom"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2 ${inputClass}`}
              />
            </FormField>
          </div>

          {/* Email */}
          <FormField label="Email Address" icon={<Mail size={14} />} error={errors.email} isDark={isDark}>
            <input
              type="email"
              placeholder="n.gupta@college.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2 ${inputClass}`}
            />
          </FormField>

          {/* Subjects */}
          <FormField label="Subjects Taught" icon={<BookOpen size={14} />} isDark={isDark}>
            <div className={`w-full pl-10 pr-2 py-2 rounded-xl border transition-all flex flex-wrap items-center gap-1.5 ${inputClass}`}>
              {formData.subjects.map((sub) => (
                <span
                  key={sub}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(sub)}
                    className="hover:opacity-70"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={formData.subjects.length === 0 ? 'Type a subject & press Enter' : 'Add more...'}
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={handleSubjectKeyDown}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1"
              />
            </div>
          </FormField>

          {/* Total Hours */}
          <FormField label="Total Work Hours (per week)" icon={<Clock size={14} />} isDark={isDark}>
            <input
              type="number"
              placeholder="22"
              value={formData.hoursTotal}
              onChange={(e) => handleChange('hoursTotal', parseInt(e.target.value) || 0)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-all focus:ring-2 ${inputClass}`}
            />
          </FormField>

          {/* Status segmented control */}
          <div>
            <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>
              Status
            </label>
            <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl ${isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100'}`}>
              {statusOptions.map((opt) => {
                const isActive = formData.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('status', opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? isDark ? 'bg-[#3A3A3C] text-white shadow-sm' : 'bg-white text-[#1C1C1E] shadow-sm'
                        : textMuted
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`p-6 pt-4 border-t flex items-center justify-end gap-3 ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isDark ? 'text-[#8E8E93] hover:bg-[#2C2C2E] hover:text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-b from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D6851A] shadow-sm active:scale-95 transition-all"
          >
            <Check size={16} strokeWidth={2.5} />
            {mode === 'add' ? 'Add Faculty' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, icon, error, isDark, children }) {
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  return (
    <div>
      <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${textMuted}`}>
        {icon}
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${textMuted}`}>
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}