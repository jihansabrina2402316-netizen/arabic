import React, { useState } from 'react';
import { Lesson, UserProfile, Question } from '../types';
import { ArabicAudioPlayer } from '../utils/audioService';
import {
  BookOpen,
  Volume2,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookMarked,
  Search,
  Layers
} from 'lucide-react';

interface MaharahQiraahProps {
  lessons: Lesson[];
  user: UserProfile;
  onSaveProgress: (lessonId: string, score: number) => void;
}

export const MaharahQiraah: React.FC<MaharahQiraahProps> = ({
  lessons,
  user,
  onSaveProgress
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0] || {} as Lesson);
  const [showTranslations, setShowTranslations] = useState<Record<number, boolean>>({});
  const [activeVocabModal, setActiveVocabModal] = useState<any | null>(null);

  // Sentence analysis state
  const [sentenceInput, setSentenceInput] = useState('');
  const [analyzingSentence, setAnalyzingSentence] = useState(false);
  const [irabResult, setIrabResult] = useState<any | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const toggleTranslation = (idx: number) => {
    setShowTranslations(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAnalyzeSentence = async (textToAnalyze?: string) => {
    const text = textToAnalyze || sentenceInput;
    if (!text) return;
    setAnalyzingSentence(true);
    setIrabResult(null);

    try {
      const res = await fetch('/api/gemini/explain-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text })
      });
      const data = await res.json();
      setIrabResult(data);
    } catch (err) {
      console.error('Irab analysis error:', err);
    } finally {
      setAnalyzingSentence(false);
    }
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    const questions = selectedLesson.questions || [];
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * 100);
    setScore(calculatedScore);
    setSubmittedQuiz(true);
    onSaveProgress(selectedLesson.id, calculatedScore);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/50 text-cyan-300 text-xs font-semibold border border-cyan-700/50">
              <BookOpen className="w-3.5 h-3.5" /> Maharah Qira'ah (Membaca & Analisis Teks)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              {selectedLesson.title}
              <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-900/60 text-cyan-300 border border-cyan-800">
                Kelas {selectedLesson.grade}
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-cyan-200">
              {selectedLesson.titleAr}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs text-slate-400 font-medium">Pilih Teks Qira'ah:</label>
            <select
              value={selectedLesson.id}
              onChange={(e) => {
                const found = lessons.find(l => l.id === e.target.value);
                if (found) {
                  setSelectedLesson(found);
                  setUserAnswers({});
                  setSubmittedQuiz(false);
                  setScore(null);
                  setIrabResult(null);
                }
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:border-cyan-500 focus:outline-none"
            >
              {lessons.map(l => (
                <option key={l.id} value={l.id}>
                  [{l.grade}] {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Reading Text Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Naskah Bacaan Lengkap Berharakat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const fullText = selectedLesson.readingParagraphs?.map(p => p.ar).join(' ') || '';
                ArabicAudioPlayer.playArabicText(fullText);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" /> Dengarkan Bacaan
            </button>
          </div>
        </div>

        {/* Paragraphs */}
        <div className="space-y-6">
          {selectedLesson.readingParagraphs?.map((para, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-cyan-500">Paragraf {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => ArabicAudioPlayer.playArabicText(para.ar)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Dengar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnalyzeSentence(para.ar)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] ml-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Bedah I'rab
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTranslation(idx)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] ml-2"
                  >
                    {showTranslations[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showTranslations[idx] ? 'Sembunyikan Arti' : 'Lihat Arti'}
                  </button>
                </div>
              </div>

              <p className="font-arabic text-2xl sm:text-3xl text-slate-100 leading-[2.2] text-right">
                {para.ar}
              </p>

              {showTranslations[idx] && (
                <div className="pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-3 rounded-xl">
                  <span className="font-semibold text-slate-300">Terjemahan: </span>
                  {para.id}
                </div>
              )}

              {para.notes && (
                <div className="text-[11px] text-cyan-400/90 font-mono bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/50">
                  <span className="font-bold">Kaidah Tarkib: </span> {para.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vocabulary Highlight Section */}
        {selectedLesson.vocabulary && selectedLesson.vocabulary.length > 0 && (
          <div className="pt-6 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              Kosakata Kunci dalam Teks (المُفْرَدَاتُ الجَدِيدَةُ)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {selectedLesson.vocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  onClick={() => ArabicAudioPlayer.playArabicText(vocab.ar)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-700/60 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {vocab.type || 'Isim'}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                  </div>
                  <p className="font-arabic text-lg sm:text-xl text-slate-100 text-right mt-1">
                    {vocab.ar}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {vocab.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI I'rab & Tashkeel Breakdown Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Analisis I'rab & Kaidah Nahwu AI</h3>
              <p className="text-xs text-slate-400">
                Pilih atau ketik kalimat bahasa Arab untuk dibedah kedudukan nahwunya secara instan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            dir="rtl"
            value={sentenceInput}
            onChange={(e) => setSentenceInput(e.target.value)}
            placeholder="Ketik kalimat Arab untuk dibedah i'rabnya (contoh: تَقَعُ مَدْرَسَتِي فِي وَسَطِ المَدِينَةِ)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-arabic text-lg text-right focus:outline-none focus:border-amber-500 text-sm"
          />
          <button
            type="button"
            onClick={() => handleAnalyzeSentence()}
            disabled={analyzingSentence || !sentenceInput}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-amber-950"
          >
            {analyzingSentence ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
            Bedah I'rab
          </button>
        </div>

        {/* Irab Breakdown Result */}
        {irabResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-900/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <span className="font-arabic text-2xl text-amber-300 text-right">
                {irabResult.vocalized}
              </span>
              <span className="text-xs text-slate-400 italic">
                "{irabResult.translation}"
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Kata (الكَلِمَةُ)</th>
                    <th className="py-2.5 px-3">Kedudukan (المَوْقِعُ)</th>
                    <th className="py-2.5 px-3">Tanda I'rab (العَلَامَةُ)</th>
                    <th className="py-2.5 px-3">Penjelasan Siswa MA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {irabResult.irabBreakdown?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-arabic text-base text-slate-100">{item.word}</td>
                      <td className="py-2.5 px-3 font-semibold text-cyan-300">{item.position}</td>
                      <td className="py-2.5 px-3 text-amber-300">{item.harakat}</td>
                      <td className="py-2.5 px-3 text-slate-300">{item.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {irabResult.ruleSummary && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
                <span className="font-semibold">Kesimpulan Kaidah: </span>
                {irabResult.ruleSummary}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Latihan Pemahaman Bacaan (Fahm Al-Maqru') */}
      {selectedLesson.questions && selectedLesson.questions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                Latihan Pemahaman Teks (فَهْمُ المَقْرُوءِ)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Uji kemampuan membaca dan mencerna isi bacaan di atas.
              </p>
            </div>
            {submittedQuiz && score !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-700/60">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300">Nilai: {score}/100</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {selectedLesson.questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-100">{q.question}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;
                      let btnStyle = 'bg-slate-900 hover:bg-slate-800/80 text-slate-300 border-slate-800';

                      if (submittedQuiz) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/80 text-emerald-200 border-emerald-600 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/80 text-rose-200 border-rose-600';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-900/60 text-cyan-200 border-cyan-500 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submittedQuiz && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {submittedQuiz && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {submittedQuiz && (
                    <div className="pl-9 pt-2 text-xs text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                      <span className="font-semibold text-cyan-400">Pembahasan: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {submittedQuiz ? (
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setSubmittedQuiz(false);
                  setScore(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Ulangi Latihan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-cyan-950/50"
              >
                Kirim & Simpan Nilai
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
