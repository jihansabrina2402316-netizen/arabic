import React, { useState } from 'react';
import { Lesson, UserProfile, ArrangeExercise } from '../types';
import { verifyArrangement } from '../utils/arabicUtils';
import { ArabicAudioPlayer } from '../utils/audioService';
import { VirtualKeyboard } from './VirtualKeyboard';
import {
  PenTool,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  Keyboard,
  FileText,
  HelpCircle,
  Volume2,
  Send,
  RefreshCw
} from 'lucide-react';

interface MaharahKitabahProps {
  lessons: Lesson[];
  user: UserProfile;
  onSaveProgress: (lessonId: string, score: number) => void;
}

export const MaharahKitabah: React.FC<MaharahKitabahProps> = ({
  lessons,
  user,
  onSaveProgress
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0] || {} as Lesson);
  const [activeTab, setActiveTab] = useState<'tartib' | 'insya'>('tartib');

  // Tartib state
  const [currentArrangeIdx, setCurrentArrangeIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    selectedLesson.arrangeExercises?.[0]?.jumbledWords || []
  );
  const [tartibResult, setTartibResult] = useState<boolean | null>(null);

  // Insya' state
  const [essayText, setEssayText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [evaluatingEssay, setEvaluatingEssay] = useState(false);
  const [essayFeedback, setEssayFeedback] = useState<any | null>(null);

  const arrangeExercises = selectedLesson.arrangeExercises || [];
  const currentExercise = arrangeExercises[currentArrangeIdx];

  const handleSelectWord = (word: string, indexInAvailable: number) => {
    setSelectedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, idx) => idx !== indexInAvailable));
    setTartibResult(null);
  };

  const handleDeselectWord = (word: string, indexInSelected: number) => {
    setSelectedWords(prev => prev.filter((_, idx) => idx !== indexInSelected));
    setAvailableWords(prev => [...prev, word]);
    setTartibResult(null);
  };

  const handleResetArrangement = () => {
    if (!currentExercise) return;
    setSelectedWords([]);
    setAvailableWords([...currentExercise.jumbledWords]);
    setTartibResult(null);
  };

  const handleCheckArrangement = () => {
    if (!currentExercise) return;
    const isCorrect = verifyArrangement(selectedWords, currentExercise.correctSentence);
    setTartibResult(isCorrect);
    if (isCorrect) {
      onSaveProgress(selectedLesson.id, 95);
    }
  };

  const handleNextArrange = () => {
    if (currentArrangeIdx < arrangeExercises.length - 1) {
      const nextIdx = currentArrangeIdx + 1;
      setCurrentArrangeIdx(nextIdx);
      const nextEx = arrangeExercises[nextIdx];
      setSelectedWords([]);
      setAvailableWords([...nextEx.jumbledWords]);
      setTartibResult(null);
    }
  };

  // Keyboard handlers for Insya
  const handleInsertChar = (char: string) => {
    setEssayText(prev => prev + char);
  };

  const handleBackspace = () => {
    setEssayText(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setEssayText(prev => prev + ' ');
  };

  // AI Grammar & Essay Checker
  const handleEvaluateEssay = async () => {
    if (!essayText.trim() || evaluatingEssay) return;
    setEvaluatingEssay(true);
    setEssayFeedback(null);

    try {
      const res = await fetch('/api/gemini/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: essayText,
          topic: selectedLesson.writingTopic?.topicAr || selectedLesson.title,
          promptType: 'insya'
        })
      });
      const data = await res.json();
      setEssayFeedback(data);
      if (data.score) {
        onSaveProgress(selectedLesson.id, data.score);
      }
    } catch (err) {
      console.error('AI Grammar check error:', err);
    } finally {
      setEvaluatingEssay(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-semibold border border-indigo-700/50">
              <PenTool className="w-3.5 h-3.5" /> Maharah Kitabah (Keterampilan Menulis)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              {selectedLesson.title}
              <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-900/60 text-indigo-300 border border-indigo-800">
                Kelas {selectedLesson.grade}
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-indigo-200">
              {selectedLesson.titleAr}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs text-slate-400 font-medium">Pilih Latihan Kitabah:</label>
            <select
              value={selectedLesson.id}
              onChange={(e) => {
                const found = lessons.find(l => l.id === e.target.value);
                if (found) {
                  setSelectedLesson(found);
                  setCurrentArrangeIdx(0);
                  setSelectedWords([]);
                  setAvailableWords(found.arrangeExercises?.[0]?.jumbledWords || []);
                  setTartibResult(null);
                  setEssayFeedback(null);
                }
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:border-indigo-500 focus:outline-none"
            >
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  [{l.grade}] {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 pt-6 border-t border-slate-800/80 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('tartib')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'tartib'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Susun Kalimat (تَرْتِيبُ الجُمَلِ)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('insya')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'insya'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Menulis Insya' & Koreksi AI
          </button>
        </div>
      </div>

      {/* Tab 1: Tartib Al-Kalimat (Susun Kalimat) */}
      {activeTab === 'tartib' && currentExercise && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                Latihan Menyusun Kata Menjadi Jumlah Mufidah
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klik kata-kata acak di bawah secara berurutan dari kanan ke kiri untuk menyusun kalimat sempurna.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800">
              Soal {currentArrangeIdx + 1} dari {arrangeExercises.length}
            </span>
          </div>

          {/* Target translation hint */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
            <span className="font-semibold text-slate-300">Makna Kalimat yang Dituju: </span>
            <span className="font-medium">"{currentExercise.translation}"</span>
          </div>

          {/* Assembled Sentence Box (Right to Left) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Kalimat yang Anda Susun:</label>
            <div
              dir="rtl"
              className="min-h-[70px] p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex flex-wrap gap-2 items-center justify-start"
            >
              {selectedWords.length === 0 ? (
                <span className="text-xs text-slate-600 font-arabic">
                  اِضْغَطْ عَلَى الكَلِمَاتِ أَدْنَاهُ لِتَرْتِيبِهَا هُنَا...
                </span>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDeselectWord(word, idx)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-rose-700 text-white font-arabic text-xl font-bold transition active:scale-95 shadow-sm group"
                    title="Klik untuk menghapus kata ini"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Pool */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Pilihan Kata Acak:</label>
            <div dir="rtl" className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectWord(word, idx)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-100 hover:text-white font-arabic text-xl font-semibold border border-slate-700 hover:border-indigo-500 transition active:scale-95 shadow-sm"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div>
              {tartibResult !== null && (
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${
                    tartibResult
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {tartibResult ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {tartibResult
                    ? 'أَحْسَنْتَ! Susunan kalimat Anda benar dan fasih.'
                    : 'Susunan belum tepat. Perhatikan urutan Fa\'il, Fi\'il, atau Mubtada\'-Khabar.'}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetArrangement}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Kata
              </button>
              <button
                type="button"
                onClick={handleCheckArrangement}
                disabled={selectedWords.length === 0}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-indigo-950"
              >
                Periksa Susunan
              </button>
              {tartibResult && currentArrangeIdx < arrangeExercises.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextArrange}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  Soal Berikutnya →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Insya' Muwajjah & AI Grammar Checker */}
      {activeTab === 'insya' && selectedLesson.writingTopic && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          {/* Topic Brief */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Topik Menulis Terarah (المَوْضُوعُ الإِنْشَائِيُّ)
              </span>
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="text-xs text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-indigo-900/50 border border-indigo-800 flex items-center gap-1"
              >
                <Keyboard className="w-3.5 h-3.5" />
                {showKeyboard ? 'Tutup Keyboard Arab' : 'Buka Keyboard Arab'}
              </button>
            </div>

            <p className="font-arabic text-2xl text-indigo-200 text-right">
              {selectedLesson.writingTopic.topicAr}
            </p>
            <p className="text-xs text-slate-300">
              {selectedLesson.writingTopic.topicId}
            </p>

            {selectedLesson.writingTopic.guidelines && (
              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">Panduan Menulis:</span>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-slate-400">
                  {selectedLesson.writingTopic.guidelines.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Textarea for Arabic essay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tulis paragraf bahasa Arab di bawah ini:</span>
              <span className="font-mono">{essayText.length} karakter</span>
            </div>
            <textarea
              dir="rtl"
              rows={5}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="اُكْتُبْ هُنَا فَقْرَةً بِاللُّغَةِ العَرَبِيَّةِ..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white font-arabic text-xl leading-relaxed text-right focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between">
            {selectedLesson.writingTopic.sampleEssay && (
              <button
                type="button"
                onClick={() => setEssayText(selectedLesson.writingTopic?.sampleEssay || '')}
                className="text-xs text-slate-400 hover:text-indigo-400 underline"
              >
                Gunakan Contoh Teks Model
              </button>
            )}
            <button
              type="button"
              onClick={handleEvaluateEssay}
              disabled={evaluatingEssay || !essayText.trim()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-lg shadow-indigo-950"
            >
              {evaluatingEssay ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Koreksi Tata Bahasa dengan AI
            </button>
          </div>

          {/* Virtual Arabic Keyboard */}
          {showKeyboard && (
            <div className="pt-2">
              <VirtualKeyboard
                onInsertChar={handleInsertChar}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                onClear={() => setEssayText('')}
              />
            </div>
          )}

          {/* AI Grammar Assessment Results */}
          {essayFeedback && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-700/60 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm text-white">Hasil Koreksi Tata Bahasa (Tashhih AI)</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-indigo-900 text-indigo-200 text-xs font-bold border border-indigo-700">
                  Nilai: {essayFeedback.score || 85} / 100
                </div>
              </div>

              {/* Corrected Text with Harakat */}
              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Teks Pembenahan dengan Harakat Lengkap:</span>
                  <button
                    type="button"
                    onClick={() => ArabicAudioPlayer.playArabicText(essayFeedback.correctedText)}
                    className="flex items-center gap-1 text-emerald-300 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Putar Teks
                  </button>
                </div>
                <p className="font-arabic text-2xl text-slate-100 text-right leading-loose pt-2">
                  {essayFeedback.correctedText}
                </p>
              </div>

              {/* General Feedback */}
              <div className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-300">Ulasan Guru: </span>
                {essayFeedback.feedback}
              </div>

              {/* Detailed Breakdown */}
              {essayFeedback.analysis && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {essayFeedback.analysis.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="font-semibold text-indigo-300">{item.aspect}</span>
                      <p className="mt-1 text-slate-400 leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
