import { X, FileText, Download, ExternalLink } from 'lucide-react';

export default function ViewAttachmentModal({ isOpen, onClose, attachment, isDark }) {
  if (!isOpen || !attachment) return null;

  const fileName = typeof attachment === 'string' ? attachment : attachment?.name || 'attachment';
  const extension = fileName.split('.').pop().toLowerCase();
  const isPDF = extension === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension);
  const fileUrl = typeof attachment === 'string' ? `/placeholder.${extension}` : attachment.url;

  const modalClass = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-100';
  const textMain = isDark ? 'text-white' : 'text-[#1C1C1E]';
  const textMuted = isDark ? 'text-[#8E8E93]' : 'text-[#6B7280]';
  const previewBg = isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[24px] border shadow-2xl overflow-hidden ${modalClass}`}
      >

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isDark ? 'border-[#2C2C2E]' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h2 className={`text-sm font-bold truncate ${textMain}`}>{fileName}</h2>
              <p className={`text-[11px] ${textMuted}`}>
                {isPDF ? 'PDF Document' : isImage ? 'Image File' : 'Attachment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a
              href={fileUrl}
              download
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              title="Download"
            >
              <Download size={17} />
            </a>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              title="Open in new tab"
            >
              <ExternalLink size={17} />
            </a>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className={`flex-1 overflow-auto p-4 sm:p-6 ${previewBg}`}>

          {isImage && (
            <div className="flex items-center justify-center min-h-full">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-[70vh] rounded-xl shadow-2xl object-contain"
              />
            </div>
          )}

          {isPDF && (
            <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-2xl bg-white">
              <iframe src={`${fileUrl}#toolbar=0`} title={fileName} className="w-full h-full border-0" />
            </div>
          )}

          {!isImage && !isPDF && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <FileText size={64} className={`mb-4 ${textMuted} opacity-30`} />
              <p className={`text-sm font-medium ${textMain}`}>Preview not available</p>
              <p className={`text-xs mt-1 ${textMuted}`}>Click Download to view this file</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}