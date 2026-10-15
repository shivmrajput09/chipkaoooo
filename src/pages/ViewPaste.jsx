import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// ============================================================================
// Helper: Category Badge Styling
// ============================================================================
const getCategoryStyle = (cat) => {
  const normalized = (cat || 'General').toLowerCase();
  if (normalized.includes('gym') || normalized.includes('fitness')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (normalized.includes('food') || normalized.includes('diet') || normalized.includes('meal')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  if (normalized.includes('shop') || normalized.includes('saman') || normalized.includes('kirana')) {
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }
  if (normalized.includes('code') || normalized.includes('dev')) {
    return 'bg-violet-50 text-violet-700 border-violet-200';
  }
  if (normalized.includes('work') || normalized.includes('office')) {
    return 'bg-slate-100 text-slate-700 border-slate-300';
  }
  return 'bg-indigo-50 text-indigo-700 border-indigo-200';
};

function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPastes = useSelector((state) => state.paste.pastes);
  const [copied, setCopied] = useState(false);

  // ID se paste find kar rahe hain
  const paste = allPastes.find((p) => (p._id || p.id) === id);

  // Copy to clipboard
  const handleCopy = () => {
    if (!paste?.content) return;
    navigator.clipboard.writeText(paste.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!paste) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Paste Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This paste might have been deleted or does not exist.</p>
        <button
          onClick={() => navigate('/pastes')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
        >
          ← Back to All Pastes
        </button>
      </div>
    );
  }

  const wordCount = paste.content?.trim() ? paste.content.trim().split(/\s+/).length : 0;
  const charCount = paste.content?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/pastes')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Pastes
        </button>

        <div className="flex items-center gap-2">
          {/* Copy Button (Requirement #6) */}
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border shadow-2xs ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Full Paste</span>
              </>
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => navigate(`/?pasteId=${paste._id || paste.id}`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Card Header with Category & Dates */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/40">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${getCategoryStyle(
                paste.category
              )}`}
            >
              {paste.category || 'General'}
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span>
                {paste.createdAt
                  ? `Created: ${new Date(paste.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}`
                  : ''}
              </span>
              <span>•</span>
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {paste.title}
          </h1>
        </div>

        {/* Content Viewer */}
        <div className="p-6">
          <div className="relative">
            <pre className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap select-text selection:bg-indigo-500 selection:text-white">
              {paste.content}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ViewPaste;