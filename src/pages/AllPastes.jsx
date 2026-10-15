import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromPastes } from '../redux/pasteSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// Helper: Category Badge Styling (Color-coding per category)
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

function AllPastes() {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Logged in user info

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  // 👉 Requirement #5: User-based filter toggle ("All" vs "Only My Pastes")
  const [onlyMyPastes, setOnlyMyPastes] = useState(false);

  // Extract all unique categories dynamically
  const categoriesList = ['ALL', ...Array.from(new Set(pastes.map((p) => p.category || 'General')))];

  // --------------------------------------------------------------------------
  // Copy Content to Clipboard
  // --------------------------------------------------------------------------
  const handleCopy = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // --------------------------------------------------------------------------
  // Filter logic: Search + Category + User-based filter
  // --------------------------------------------------------------------------
  const filteredPastes = pastes.filter((paste) => {
    // 1. Search term match (in title or content or category)
    const matchesSearch =
      (paste.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paste.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paste.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category filter match
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (paste.category || 'General').toLowerCase() === selectedCategory.toLowerCase();

    // 3. User-specific filter (Requirement #5)
    // Agar user ne 'My Pastes' select kiya hai, toh sirf current user ki ID match karegi
    const matchesUser = !onlyMyPastes || (user && (paste.userId === user.id || paste.userId === 'guest'));

    return matchesSearch && matchesCategory && matchesUser;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header section with Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
            Organized Repository
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            All Saved Pastes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, filter by category (Gym, Food, Dukaan, etc.), and copy with one click.
          </p>
        </div>

        {/* User filter toggle (Requirement #5) */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setOnlyMyPastes(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                !onlyMyPastes
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pastes
            </button>
            <button
              onClick={() => setOnlyMyPastes(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                onlyMyPastes
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👤 My Pastes Only
            </button>
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by title, contents, or category (e.g. gym, food, grocery)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Filter Pills (Requirement #4) */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-semibold text-slate-400 mr-1">Category:</span>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pastes Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPastes.length > 0 ? (
          filteredPastes.map((paste) => {
            const pasteId = paste?._id || paste?.id;
            const isCopied = copiedId === pasteId;

            return (
              <div
                key={pasteId}
                className="bg-white border border-slate-200/90 hover:border-indigo-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Category Badge & Created Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getCategoryStyle(
                        paste?.category
                      )}`}
                    >
                      {paste?.category || 'General'}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {paste?.createdAt
                        ? new Date(paste.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </span>
                  </div>

                  {/* Title (Requirement #4: Clear Bold Title) */}
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition">
                    {paste?.title}
                  </h3>

                  {/* Snippet Preview */}
                  <p className="mt-2 text-slate-600 text-xs leading-relaxed line-clamp-4 font-mono bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    {paste?.content}
                  </p>
                </div>

                {/* Card Footer: Action Buttons (Copy, Edit, View, Delete) */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* Copy Button (Requirement #6) */}
                  <button
                    onClick={() => handleCopy(pasteId, paste?.content)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      isCopied
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/70'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Other Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/pastes/${pasteId}`)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Details"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/?pasteId=${pasteId}`)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit Paste"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => dispatch(removeFromPastes(pasteId))}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Paste"
                    >
                      Delete
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-800">No Pastes Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No paste matches your current search or category filter. Try clearing filters or create a new paste.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              + Create New Paste
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default AllPastes;