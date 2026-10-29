import React, { useState } from 'react';
import { Lesson, UserProfile } from '../types';
import { ArabicAudioPlayer } from '../utils/audioService';
import { stripHarakat, normalizeArabic } from '../utils/arabicUtils';
import { VirtualKeyboard } from './VirtualKeyboard';
import {
  Headphones,
  Play,
  Square,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Keyboard,
  Award,
  BookOpen,
  Volume2,
  PenTool
} from 'lucide-react';

interface MaharahIstimaProps {
  lessons: Lesson[];
  user: UserProfile;
  onSaveProgress: (lessonId: string, score: number) => void;
}

export const MaharahIstima: React.FC<MaharahIstimaProps> = ({
  lessons,
  user,
  onSaveProgress
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0] || {} as Lesson);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9);
  const [showTranscript, setShowTranscript] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Imla state
  const [imlaInputs, setImlaInputs] = useState<Record<string, string>>({});
  const [imlaResults, setImlaResults] = useState<Record<string, boolean>>({});
  const [activeImlaId, setActiveImlaId] = useState<string | null>(null);
  const [showVirtualKb, setShowVirtualKb] = useState(false);

  const handlePlayAudio = (textToSpeak?: string) => {
    const text = textToSpeak || selectedLesson.audioScript || selectedLesson.contentAr || '';
    if (!text) return;

    if (isPlaying) {
      ArabicAudioPlayer.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      ArabicAudioPlayer.playArabicText(text, playbackRate, () => {
        setIsPlaying(false);
      });
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

    const score = Math.round((correct / questions.length) * 100);
    setQuizScore(score);
    setSubmittedQuiz(true);
    onSaveProgress(selectedLesson.id, score);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
    setQuizScore(null);
  };

  const handleCheckImla = (exerciseId: string, expectedText: string) => {
    const userText = imlaInputs[exerciseId] || '';
    const isCorrect = normalizeArabic(userText) === normalizeArabic(expectedText);
    setImlaResults(prev => ({ ...prev, [exerciseId]: isCorrect }));
  };

  const handleInsertChar = (char: string) => {
    if (!activeImlaId) return;
    setImlaInputs(prev => ({
      ...prev,
      [activeImlaId]: (prev[activeImlaId] || '') + char
    }));
  };

  const handleBackspace = () => {
    if (!activeImlaId) return;
    setImlaInputs(prev => ({
      ...prev,
      [activeImlaId]: (prev[activeImlaId] || '').slice(0, -1)
    }));
  };

  const handleSpace = () => {
    if (!activeImlaId) return;
    setImlaInputs(prev => ({
      ...prev,
      [activeImlaId]: (prev[activeImlaId] || '') + ' '
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 text-xs font-semibold border border-emerald-700/50">
              <Headphones className="w-3.5 h-3.5" /> Maharah Istima' (Menyimak)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              {selectedLesson.title}
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-800">
                Kelas {selectedLesson.grade}
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-emerald-200">
              {selectedLesson.titleAr}
            </p>
            <p className="text-xs text-slate-400 max-w-2xl">
              {selectedLesson.description}
            </p>
          </div>

          {/* Lesson Selector */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs text-slate-400 font-medium">Pilih Pelajaran Istima':</label>
            <select
              value={selectedLesson.id}
              onChange={(e) => {
                const found = lessons.find(l => l.id === e.target.value);
                if (found) {
                  setSelectedLesson(found);
                  handleResetQuiz();
                  ArabicAudioPlayer.stop();
                  setIsPlaying(false);
                }
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
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

      {/* Audio Player Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handlePlayAudio()}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 shadow-rose-900/50 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50'
              }`}
            >
              {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                Pemutar Audio Bahasa Arab
                {isPlaying && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Memutar...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Pelafalan fasih standar makharijul huruf Timur Tengah & Kemenag
              </p>
            </div>
          </div>

          {/* Speed & Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Kecepatan:</span>
              {[0.75, 0.9, 1.1].map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`text-xs px-2 py-0.5 rounded-lg font-mono transition ${
                    playbackRate === rate
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showTranscript ? 'Tutup Transkrip' : 'Buka Transkrip Naskah'}
            </button>
          </div>
        </div>

        {/* Hidden / Revealable Transcript */}
        {showTranscript && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-emerald-900/60 space-y-4">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Naskah Teks Istima' (نَصُّ الاِسْتِمَاعِ)
              </span>
              <button
                type="button"
                onClick={() => handlePlayAudio()}
                className="text-xs text-emerald-300 hover:underline flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" /> Putar Naskah
              </button>
            </div>
            <div className="text-right font-arabic text-xl sm:text-2xl text-slate-100 leading-loose whitespace-pre-line p-2">
              {selectedLesson.audioScript}
            </div>
            {selectedLesson.contentId && (
              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                <span className="font-semibold text-slate-300">Terjemahan Teks:</span>
                <p className="mt-1">{selectedLesson.contentId}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Latihan 1: Soal Pemahaman (Fahm al-Istima') */}
      {selectedLesson.questions && selectedLesson.questions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                Latihan 1: Pemahaman Audio (فَهْمُ المَسْمُوعِ)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih jawaban paling tepat berdasarkan apa yang Anda dengar.
              </p>
            </div>
            {submittedQuiz && quizScore !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700/60">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">Skor Anda: {quizScore}/100</span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {selectedLesson.questions.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-100">{q.question}</p>
                      {q.questionAr && (
                        <p className="text-base font-arabic text-emerald-300 mt-1">{q.questionAr}</p>
                      )}
                    </div>
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
                        btnStyle = 'bg-emerald-900/60 text-emerald-200 border-emerald-500 font-semibold';
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
                      <span className="font-semibold text-emerald-400">Pembahasan: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {submittedQuiz ? (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Ulangi Kuis
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
              >
                Kirim & Simpan Nilai
              </button>
            )}
          </div>
        </div>
      )}

      {/* Latihan 2: Imla' Dengar & Tulis (Dikte Bahasa Arab) */}
      {selectedLesson.imlaExercises && selectedLesson.imlaExercises.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-teal-400" />
                Latihan 2: Imla' Dengar & Tulis (الإِمْلَاءُ المَسْمُوعُ)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dengarkan penggalan frasa lalu ketikkan dalam bahasa Arab dengan benar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVirtualKb(!showVirtualKb)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium border border-slate-700 transition"
            >
              <Keyboard className="w-4 h-4" />
              {showVirtualKb ? 'Sembunyikan Keyboard Arab' : 'Buka Keyboard Arab'}
            </button>
          </div>

          <div className="space-y-4">
            {selectedLesson.imlaExercises.map((imla) => {
              const userVal = imlaInputs[imla.id] || '';
              const evaluated = imlaResults[imla.id];

              return (
                <div key={imla.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => ArabicAudioPlayer.playArabicText(imla.audioText)}
                        className="p-2.5 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800/80 transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Volume2 className="w-4 h-4" /> Putar Frasa
                      </button>
                      <span className="text-xs text-slate-400 italic">Petunjuk: {imla.hint}</span>
                    </div>

                    {evaluated !== undefined && (
                      <span
                        className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                          evaluated
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {evaluated ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {evaluated ? 'Mumtaz! Tepat' : 'Perbaiki Ejaan'}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="rtl"
                      value={userVal}
                      onFocus={() => setActiveImlaId(imla.id)}
                      onChange={(e) => setImlaInputs(prev => ({ ...prev, [imla.id]: e.target.value }))}
                      placeholder="اُكْتُبِ العِبَارَةَ هُنَا..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-arabic text-xl text-right focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckImla(imla.id, imla.expectedAr)}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition active:scale-95"
                    >
                      Periksa
                    </button>
                  </div>

                  {evaluated === false && (
                    <div className="text-xs text-slate-400 font-arabic text-right">
                      <span className="text-slate-400">Kunci Jawaban: </span>
                      <span className="text-emerald-400 font-bold text-base">{imla.expectedAr}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Virtual Arabic Keyboard for Imla */}
          {showVirtualKb && (
            <div className="pt-2">
              <VirtualKeyboard
                onInsertChar={handleInsertChar}
                onBackspace={handleBackspace}
                onSpace={handleSpace}
                onClear={() => {
                  if (activeImlaId) {
                    setImlaInputs(prev => ({ ...prev, [activeImlaId]: '' }));
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
