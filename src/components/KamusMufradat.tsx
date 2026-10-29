import React, { useState } from 'react';
import { THEMATIC_VOCABULARY } from '../data/maharahData';
import { VocabWord } from '../types';
import { ArabicAudioPlayer } from '../utils/audioService';
import { stripHarakat, normalizeArabic } from '../utils/arabicUtils';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  BookMarked,
  Filter,
  Sparkles
} from 'lucide-react';

export const KamusMufradat: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const categories = ['Semua', 'Madrasah', 'Aktivitas', 'Teknologi', 'Akhlak'];

  const toggleBookmark = (ar: string) => {
    setBookmarkedIds(prev =>
      prev.includes(ar) ? prev.filter(item => item !== ar) : [...prev, ar]
    );
  };

  const filteredWords = THEMATIC_VOCABULARY.filter(word => {
    // Category check
    if (selectedCategory !== 'Semua' && word.category !== selectedCategory) {
      return false;
    }

    // Bookmark check
    if (showBookmarksOnly && !bookmarkedIds.includes(word.ar)) {
      return false;
    }

    // Search query check
    if (!searchQuery.trim()) return true;

    const queryNorm = searchQuery.toLowerCase().trim();
    const arNorm = normalizeArabic(word.ar);
    const idNorm = word.id.toLowerCase();
    const exampleArNorm = word.exampleAr ? normalizeArabic(word.exampleAr) : '';
    const exampleIdNorm = word.exampleId ? word.exampleId.toLowerCase() : '';

    return (
      arNorm.includes(queryNorm) ||
      idNorm.includes(queryNorm) ||
      exampleArNorm.includes(queryNorm) ||
      exampleIdNorm.includes(queryNorm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-800/60 rounded-3xl p-6 sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 text-xs font-semibold border border-blue-700/50">
            <BookMarked className="w-3.5 h-3.5" /> Kamus Mufradat Tematik MA
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Kamus Kosakata Bahasa Arab Madrasah Aliyah
          </h2>
          <p className="text-sm text-slate-300 font-arabic text-lg text-blue-200">
            مُعْجَمُ المُفْرَدَاتِ العَرَبِيَّةِ المَدْرَسِيَّةِ
          </p>
          <p className="text-xs text-slate-400 max-w-2xl">
            Kumpulan kosakata terpilih berharakat lengkap, terbagi berdasarkan tema kurikulum MA dengan audio pelafalan dan contoh pemakaian dalam kalimat.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata dalam Arab atau Indonesia (contoh: مدرسة / belajar / internet)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 ${
              showBookmarksOnly
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {showBookmarksOnly ? <BookmarkCheck className="w-4 h-4 text-amber-300" /> : <Bookmark className="w-4 h-4" />}
            Favorit ({bookmarkedIds.length})
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-900/80 text-blue-200 border border-blue-600 font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word, idx) => {
          const isBookmarked = bookmarkedIds.includes(word.ar);
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-blue-700/60 rounded-2xl p-4 shadow-lg transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-400 border border-blue-900 font-mono text-[10px]">
                    {word.category} • {word.type || 'Isim'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(word.ar)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                      title="Simpan ke favorit"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => ArabicAudioPlayer.playArabicText(word.ar)}
                      className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 transition"
                      title="Dengar pelafalan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <p className="font-arabic text-2xl font-bold text-slate-100">
                    {word.ar}
                  </p>
                  {word.plural && (
                    <p className="font-arabic text-xs text-blue-300/80 mt-0.5">
                      ج: {word.plural}
                    </p>
                  )}
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-200">
                  {word.id}
                </div>
              </div>

              {/* Example sentence */}
              {word.exampleAr && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Contoh Kalimat:</span>
                    <button
                      type="button"
                      onClick={() => ArabicAudioPlayer.playArabicText(word.exampleAr || '')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-arabic text-sm text-right text-slate-300">
                    {word.exampleAr}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    "{word.exampleId}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-sm">
          Tidak ditemukan kosakata yang sesuai dengan kata kunci pencarian.
        </div>
      )}
    </div>
  );
};
