import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToPaste, updatePaste } from '../redux/pasteSlice';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// Preset Categories (Jaise user ne bola: Gym, Food, Dukaan Saman, etc.)
// ============================================================================
const PRESET_CATEGORIES = [
  { id: 'Gym', label: '🏋️ Gym / Fitness', color: 'emerald' },
  { id: 'Food', label: '🥗 Food & Diet', color: 'amber' },
  { id: 'Shopping', label: '🛒 Dukaan Saman', color: 'sky' },
  { id: 'Code', label: '💻 Code / Dev', color: 'violet' },
  { id: 'Notes', label: '📝 Quick Notes', color: 'indigo' },
  { id: 'Work', label: '💼 Work / Office', color: 'slate' },
];

function Home() {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('Gym');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get('pasteId');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPastes = useSelector((state) => state.paste.pastes);
  const { user } = useAuth(); // Auth context se current logged in user ka data fetch kar rahe hain

  // Agar URL me `?pasteId=...` hai, toh existing paste ka data load karo (Edit Mode)
  useEffect(() => {
    if (pasteId) {
      const paste = allPastes.find((p) => (p._id || p.id) === pasteId);
      if (paste) {
        setTitle(paste.title || '');
        setValue(paste.content || '');
        if (paste.category) {
          const matched = PRESET_CATEGORIES.some((c) => c.id === paste.category);
          if (matched) {
            setCategory(paste.category);
            setIsCustomCategory(false);
          } else {
            setIsCustomCategory(true);
            setCustomCategory(paste.category);
          }
        }
      }
    }
  }, [pasteId, allPastes]);

  // --------------------------------------------------------------------------
  // Copy to Clipboard feature
  // --------------------------------------------------------------------------
  const handleCopy = () => {
    if (!value.trim()) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --------------------------------------------------------------------------
  // Save / Update Paste function
  // --------------------------------------------------------------------------
  function createOrUpdatePaste(e) {
    e.preventDefault();

    if (!title.trim()) {
      setStatusMessage('⚠️ Please provide a title for this paste!');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    if (!value.trim()) {
      setStatusMessage('⚠️ Please enter some content in the paste!');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    const finalCategory = isCustomCategory
      ? (customCategory.trim() || 'General')
      : category;

    // Paste object with category & user mapping (Ready for user-based filtering!)
    const paste = {
      _id: pasteId || 'paste_' + Date.now().toString(36),
      title: title.trim(),
      category: finalCategory,
      content: value,
      // 👉 User-based save ready: Agar user logged in hai toh uski ID, warna 'guest'
      userId: user ? user.id : 'guest',
      userEmail: user ? user.email : 'guest',
      createdAt: pasteId
        ? (allPastes.find((p) => (p._id || p.id) === pasteId)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePaste(paste));
      setStatusMessage('✅ Paste successfully updated!');
    } else {
      dispatch(addToPaste(paste));
      setStatusMessage('✅ Paste successfully created!');
    }

    // Reset fields & search param
    setTitle('');
    setValue('');
    setSearchParams({});
    setIsCustomCategory(false);
    setCustomCategory('');

    // Smooth redirect to All Pastes page after short notification
    setTimeout(() => {
      navigate('/pastes');
    }, 800);
  }

  // Word and character count calculation
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Top Heading with Typography & Subtitle */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
            {pasteId ? 'Edit Mode' : 'New Creation'}
          </span>
          {user && (
            <span className="text-xs text-slate-500 font-medium">
              Saving as: <strong className="text-slate-800">{user.name || user.email}</strong>
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {pasteId ? 'Update Your Paste' : 'Create & Categorize Paste'}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Separate your pastes neatly — Gym workout, Food diet, Dukaan saman, Code & Notes.
        </p>
      </div>

      {/* Notification Toast Message */}
      {statusMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-lg flex items-center justify-between animate-fadeIn">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Category Selector Bar (Requirement #4: Clear categorisation) */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
            Select Paste Category / Type
          </label>
          
          <div className="flex flex-wrap gap-2 items-center">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setIsCustomCategory(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  !isCustomCategory && category === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                isCustomCategory
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              ✨ Custom Category
            </button>
          </div>

          {/* Custom Category Input if selected */}
          {isCustomCategory && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Enter custom category name (e.g., College Project, Travel List)..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full sm:w-80 px-3.5 py-2 text-xs rounded-lg border border-indigo-200 bg-indigo-50/40 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
        </div>

        {/* Title & Content Inputs */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Paste Title / List Name
            </label>
            <input
              type="text"
              placeholder="e.g., Morning Chest & Triceps Routine or Weekly Kirana List..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          {/* Editor Toolbar with Copy & Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Content / Details
            </label>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                {wordCount} words • {charCount} chars
              </span>

              {/* Copy Button (Requirement #6) */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={!value.trim()}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            placeholder="Type or paste your content here... (e.g. 1. Dumbbell Press, 2. Cable Flies, 3. Pushups...)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-y"
          />

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setValue('');
                setSearchParams({});
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              Clear Form
            </button>

            <button
              type="button"
              onClick={createOrUpdatePaste}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition active:scale-[0.98] cursor-pointer"
            >
              {pasteId ? 'Save Changes' : 'Publish Paste'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;