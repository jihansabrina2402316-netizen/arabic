import React, { useState, useEffect } from 'react';
import { EXAM_QUESTIONS } from '../data/maharahData';
import { UserProfile } from '../types';
import { evaluateExam, ExamResult } from '../utils/arabicUtils';
import { ArabicAudioPlayer } from '../utils/audioService';
import {
  Award,
  Timer,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  Printer,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AsesmenMadrasahProps {
  user: UserProfile;
  onSaveProgress: (lessonId: string, score: number) => void;
}

export const AsesmenMadrasah: React.FC<AsesmenMadrasahProps> = ({ user, onSaveProgress }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isFinished) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinishExam = () => {
    const correctMap: Record<string, number> = {};
    EXAM_QUESTIONS.forEach(q => {
      correctMap[q.id] = q.correctAnswer;
    });

    const res = evaluateExam(userAnswers, correctMap);
    setExamResult(res);
    setIsFinished(true);
    onSaveProgress('asesmen-akhir-ma', res.score);
  };

  const handleResetExam = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setTimeLeft(600);
    setIsFinished(false);
    setExamResult(null);
  };

  const currentQ = EXAM_QUESTIONS[currentIdx];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-xs font-semibold border border-purple-700/50">
              <Award className="w-3.5 h-3.5" /> Simulasi Asesmen Madrasah Aliyah
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              Ujian Penilaian Komprehensif Bahasa Arab MA
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-purple-200">
              اِخْتِبَارُ التَّقْيِيمِ التَّحْصِيلِيِّ الشَّامِلِ
            </p>
            <p className="text-xs text-slate-400 max-w-2xl">
              Ujian komprehensif menguji 4 maharah (Istima', Kalam, Qira'ah, Kitabah) serta kaidah Nahwu-Sharaf. KKM: 75.
            </p>
          </div>

          {/* Timer Card */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950 border border-purple-800/60 shrink-0">
            <Timer className={`w-6 h-6 ${timeLeft < 120 ? 'text-rose-400 animate-pulse' : 'text-purple-400'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sisa Waktu</div>
              <div className="text-xl font-mono font-bold text-white">{formatTimer(timeLeft)}</div>
            </div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Box (3 cols) */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Nomor {currentIdx + 1} dari {EXAM_QUESTIONS.length}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  {currentQ.maharah}
                </span>
              </div>
              <button
                type="button"
                onClick={() => ArabicAudioPlayer.playArabicText(currentQ.questionAr || currentQ.question)}
                className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-800"
              >
                <Volume2 className="w-3.5 h-3.5" /> Audio Soal
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              {currentQ.questionAr && (
                <p className="font-arabic text-2xl sm:text-3xl text-right text-slate-100 leading-relaxed">
                  {currentQ.questionAr}
                </p>
              )}
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-900/60 text-purple-200 border-purple-500 font-semibold shadow-md'
                        : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Sebelumnya
              </button>

              {currentIdx < EXAM_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishExam}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition"
                >
                  Selesaikan Ujian & Lihat Sertifikat
                </button>
              )}
            </div>
          </div>

          {/* Palette Sidebar (1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigasi Soal
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {EXAM_QUESTIONS.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentIdx === idx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl text-xs font-bold transition flex items-center justify-center border ${
                      isCurrent
                        ? 'bg-purple-600 text-white border-purple-400 ring-2 ring-purple-500/50'
                        : isAnswered
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
                <span>Sudah Dijawab: {Object.keys(userAnswers).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
                <span>Belum: {EXAM_QUESTIONS.length - Object.keys(userAnswers).length}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinishExam}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition shadow-md shadow-purple-950"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </div>
      ) : (
        /* Results & Digital Certificate */
        <div className="space-y-6">
          {/* Certificate Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-600/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-purple-500" />

            <div className="space-y-1">
              <span className="text-amber-400 font-arabic text-xl sm:text-2xl">
                شَهَادَةُ التَّقْدِيرِ وَالنَّجَاحِ
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase">
                Sertifikat Hasil Asesmen Bahasa Arab
              </h3>
              <p className="text-xs text-slate-400">
                Madrasah Aliyah Model Pembelajaran Terpadu 4 Maharah Kemenag RI
              </p>
            </div>

            <div className="py-4 border-y border-slate-800/80 space-y-2 max-w-lg mx-auto">
              <p className="text-xs text-slate-400">Diberikan Kepada Siswa/i Berprestasi:</p>
              <h4 className="text-2xl font-bold text-amber-300">
                {user.displayName || 'Siswa Madrasah Aliyah'}
              </h4>
              <p className="text-xs text-slate-400">
                Email: {user.email} • Kelas: {user.grade} MA
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Skor Akhir</span>
                <p className="text-2xl font-bold text-purple-400 mt-1">{examResult?.score}</p>
                <span className="text-[10px] text-slate-500">Skala 100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Predikat Arab</span>
                <p className="text-xl font-bold font-arabic text-amber-400 mt-1">{examResult?.predicateAr}</p>
                <span className="text-[10px] text-slate-400 truncate block">{examResult?.predicateId}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Benar / Total</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {examResult?.correctAnswers} / {examResult?.totalQuestions}
                </p>
                <span className="text-[10px] text-slate-500">Soal</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Status KKM 75</span>
                <p className={`text-sm font-bold mt-2 ${examResult?.isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {examResult?.isPassed ? 'LULUS (ناجح)' : 'REMEDIAL'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Cetak Sertifikat
              </button>
              <button
                type="button"
                onClick={handleResetExam}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-purple-950"
              >
                <RotateCcw className="w-4 h-4" /> Ujian Ulang
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-400" />
              Kunci Jawaban & Pembahasan Lengkap
            </h4>
            <div className="space-y-4">
              {EXAM_QUESTIONS.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">Soal #{idx + 1} ({q.maharah})</span>
                      <span className={`font-semibold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrect ? 'Benar' : 'Salah'}
                      </span>
                    </div>
                    <p className="text-slate-200">{q.question}</p>
                    {q.questionAr && <p className="font-arabic text-base text-right text-purple-300">{q.questionAr}</p>}
                    <div className="p-2.5 rounded-xl bg-slate-900 text-slate-400">
                      <span className="text-emerald-400 font-semibold">Jawaban Tepat: </span>
                      {q.options[q.correctAnswer]}
                      <div className="mt-1 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
