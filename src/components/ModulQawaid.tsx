import React, { useState } from 'react';
import { QAWAID_TOPICS, GrammarTopic } from '../data/maharahData';
import { ArabicAudioPlayer } from '../utils/audioService';
import {
  Layers,
  BookOpen,
  Volume2,
  Table,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ModulQawaid: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(QAWAID_TOPICS[0]);
  const [selectedFilter, setSelectedFilter] = useState<'Semua' | 'Nahwu' | 'Sharaf'>('Semua');

  const filteredTopics = QAWAID_TOPICS.filter(t => {
    if (selectedFilter === 'Semua') return true;
    return t.category === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/50 text-amber-300 text-xs font-semibold border border-amber-700/50">
              <Layers className="w-3.5 h-3.5" /> Modul Qawa'id (Kaidah Nahwu & Sharaf MA)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              {selectedTopic.title}
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-900/60 text-amber-300 border border-amber-800">
                {selectedTopic.category}
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-amber-200">
              {selectedTopic.titleAr}
            </p>
            <p className="text-xs text-slate-400 max-w-2xl">
              {selectedTopic.summary}
            </p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 shrink-0">
            {(['Semua', 'Nahwu', 'Sharaf'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedFilter === f
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredTopics.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTopic(t)}
            className={`text-left p-4 rounded-2xl border transition ${
              selectedTopic.id === t.id
                ? 'bg-amber-950/40 border-amber-600 shadow-lg shadow-amber-950/40'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                {t.category}
              </span>
              <span className="font-arabic text-xs text-amber-300/80">{t.titleAr}</span>
            </div>
            <h4 className="text-sm font-bold text-white line-clamp-1">{t.title}</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.summary}</p>
          </button>
        ))}
      </div>

      {/* Rules Breakdown */}
      {selectedTopic.rules && selectedTopic.rules.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Penjelasan Kaidah & Contoh I'rab
          </h3>

          <div className="space-y-4">
            {selectedTopic.rules.map((rule, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-950 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 border border-amber-800">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {rule.rule}
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Contoh Kalimat:</span>
                    <p className="font-arabic text-xl sm:text-2xl text-slate-100 text-right mt-1">
                      {rule.exampleAr}
                    </p>
                    <p className="text-xs text-slate-400 italic mt-1">"{rule.exampleId}"</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => ArabicAudioPlayer.playArabicText(rule.exampleAr)}
                    className="self-end sm:self-auto p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 flex items-center gap-1.5 text-xs transition"
                  >
                    <Volume2 className="w-4 h-4" /> Dengar
                  </button>
                </div>

                <div className="text-xs text-slate-400 pl-3 border-l-2 border-amber-500/50">
                  <span className="font-semibold text-slate-300">Analisis Nahwu: </span>
                  {rule.analysis}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasrif Table if available */}
      {selectedTopic.tasrifTable && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-amber-400" />
              Tabel Tasrif Lughawi 14 Dhomir (Fi'il Madhi, Mudhari', Amr)
            </h3>
            <span className="text-xs text-amber-400 font-mono">Pola Tsulatsi Mujarrad</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Dhamir (الضَّمِيرُ)</th>
                  <th className="py-3 px-3">Arti Subjek</th>
                  <th className="py-3 px-3">Mādhī (الفِعْلُ المَاضِي)</th>
                  <th className="py-3 px-3">Mudhāri' (المُضَارِعُ)</th>
                  <th className="py-3 px-3">Amr (الأَمْرُ)</th>
                  <th className="py-3 px-3 text-right">Suara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {selectedTopic.tasrifTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50 transition">
                    <td className="py-2.5 px-3 font-arabic text-lg font-bold text-amber-300">{row.dhamir}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.dhamirMeaning}</td>
                    <td className="py-2.5 px-3 font-arabic text-lg text-slate-100">{row.madhi}</td>
                    <td className="py-2.5 px-3 font-arabic text-lg text-slate-100">{row.mudhari}</td>
                    <td className="py-2.5 px-3 font-arabic text-lg text-slate-100">{row.amr}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => ArabicAudioPlayer.playArabicText(`${row.madhi} ${row.mudhari}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-900/60 text-amber-300"
                        title="Dengar pelafalan fi'il"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
