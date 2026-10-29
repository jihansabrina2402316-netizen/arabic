import React, { useState } from 'react';
import { Lesson, UserProfile } from '../types';
import { ArabicAudioPlayer, createArabicSpeechRecognizer } from '../utils/audioService';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Award,
  MessageSquare,
  Send,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Radio
} from 'lucide-react';

interface MaharahKalamProps {
  lessons: Lesson[];
  user: UserProfile;
  onSaveProgress: (lessonId: string, score: number) => void;
}

export const MaharahKalam: React.FC<MaharahKalamProps> = ({
  lessons,
  user,
  onSaveProgress
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0] || {} as Lesson);
  const [activeTab, setActiveTab] = useState<'hiwar' | 'tabir' | 'ai-tutor'>('hiwar');

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<any>(null);

  // AI Tutor chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; textAr: string; textId?: string; vocab?: string[] }>>([
    {
      sender: 'ai',
      textAr: 'أَهْلًا وَسَهْلًا يَا طَالِبِي العَزِيز! كَيْفَ حَالُكَ اليَوْمَ؟',
      textId: 'Selamat datang wahai muridku tersayang! Bagaimana kabarmu hari ini?',
      vocab: ['أَهْلًا وَسَهْلًا (Selamat datang)', 'طَالِبٌ (Murid)', 'كَيْفَ حَالُكَ (Bagaimana kabarmu)']
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  // Start speech recognition
  const handleToggleRecord = (targetSentence?: string) => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognizer = createArabicSpeechRecognizer(
      (transcript) => {
        setRecordedTranscript(transcript);
        setIsRecording(false);
        // Automatically evaluate with AI
        evaluateSpeechWithAI(transcript, targetSentence);
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );

    if (!recognizer) {
      alert('Browser Anda belum mendukung Web Speech Recognition. Anda dapat mengetikkan teks secara manual untuk dianalisis oleh AI.');
      return;
    }

    setIsRecording(true);
    recognizer.start();
  };

  const evaluateSpeechWithAI = async (transcript: string, target?: string) => {
    if (!transcript) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/gemini/speech-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          targetText: target || selectedLesson.speechPrompt?.targetSentence,
          topic: selectedLesson.title
        })
      });
      const data = await res.json();
      setSpeechEvaluation(data);
      if (data.score) {
        onSaveProgress(selectedLesson.id, data.score);
      }
    } catch (err) {
      console.error('Speech eval error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSendTutorMessage = async () => {
    if (!userChatInput.trim() || tutorLoading) return;

    const userText = userChatInput.trim();
    setUserChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', textAr: userText }]);
    setTutorLoading(true);

    try {
      const res = await fetch('/api/gemini/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages.concat({ sender: 'user', textAr: userText }),
          topic: selectedLesson.title
        })
      });
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          textAr: data.replyAr || 'مُمْتَاز! وَاصِلِ التَّحَدُّثَ.',
          textId: data.replyId,
          vocab: data.vocabularyHelp
        }
      ]);
    } catch (err) {
      console.error('Tutor chat error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          textAr: 'مُمْتَازٌ جِدًّا! أَنْتَ طَالِبٌ مُجْتَهِدٌ.',
          textId: 'Luar biasa sekali! Kamu adalah siswa yang rajin.'
        }
      ]);
    } finally {
      setTutorLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/50 text-teal-300 text-xs font-semibold border border-teal-700/50">
              <Mic className="w-3.5 h-3.5" /> Maharah Kalam (Berbicara & Hiwar)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              {selectedLesson.title}
              <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-900/60 text-teal-300 border border-teal-800">
                Kelas {selectedLesson.grade}
              </span>
            </h2>
            <p className="text-sm text-slate-300 font-arabic text-lg text-teal-200">
              {selectedLesson.titleAr}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs text-slate-400 font-medium">Pilih Modul Kalam:</label>
            <select
              value={selectedLesson.id}
              onChange={(e) => {
                const found = lessons.find(l => l.id === e.target.value);
                if (found) {
                  setSelectedLesson(found);
                  setSpeechEvaluation(null);
                  setRecordedTranscript('');
                }
              }}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:border-teal-500 focus:outline-none"
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
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800/80 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('hiwar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'hiwar'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-950'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Role-Play Percakapan (Hiwar)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tabir')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'tabir'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-950'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Praktik Berbicara & Ulasan AI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai-tutor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ai-tutor'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-950'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Mitra Bicara Ustadz AI
          </button>
        </div>
      </div>

      {/* Tab 1: Hiwar Role-Play */}
      {activeTab === 'hiwar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-teal-400" />
              Teks Percakapan Berpasangan (الحِوَارُ التَّفَاعُلِيُّ)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik tombol speaker untuk mendengar pelafalan fasih, lalu tirukan dengan intonasi yang tepat.
            </p>
          </div>

          <div className="space-y-4">
            {selectedLesson.dialogue?.map((line, idx) => {
              const isA = line.speakerRole === 'A';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition ${
                    isA
                      ? 'bg-slate-950/70 border-teal-900/60 ml-0 sm:mr-12'
                      : 'bg-teal-950/30 border-emerald-900/60 mr-0 sm:ml-12'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      {line.speaker} ({line.speakerRole === 'A' ? 'Tokoh A' : 'Tokoh B'})
                    </span>
                    <button
                      type="button"
                      onClick={() => ArabicAudioPlayer.playArabicText(line.textAr)}
                      className="p-1.5 rounded-lg bg-teal-900/50 hover:bg-teal-800 text-teal-200 transition active:scale-95 flex items-center gap-1 text-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Dengar
                    </button>
                  </div>

                  <p className="text-right font-arabic text-xl sm:text-2xl text-slate-100 leading-relaxed">
                    {line.textAr}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    "{line.textId}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Ta'bir Syafahi & AI Pronunciation Feedback */}
      {activeTab === 'tabir' && selectedLesson.speechPrompt && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-800/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <Lightbulb className="w-4 h-4" /> Situasi Berbicara (المَوْقِفُ الكَلَامِيُّ)
            </div>
            <p className="text-right font-arabic text-xl text-teal-100">
              {selectedLesson.speechPrompt.situationAr}
            </p>
            <p className="text-xs text-slate-300">
              {selectedLesson.speechPrompt.situationId}
            </p>

            <div className="pt-3 border-t border-teal-900/60">
              <span className="text-xs font-semibold text-slate-400">Target Kalimat yang Perlu Diucapkan:</span>
              <div className="flex items-center justify-between gap-4 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="font-arabic text-xl sm:text-2xl text-teal-300 text-right flex-1">
                  {selectedLesson.speechPrompt.targetSentence}
                </span>
                <button
                  type="button"
                  onClick={() => ArabicAudioPlayer.playArabicText(selectedLesson.speechPrompt?.targetSentence || '')}
                  className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 transition"
                  title="Dengarkan contoh fasih"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedLesson.speechPrompt.tips && (
              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">Tips Makhraj & Intonasi:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                  {selectedLesson.speechPrompt.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recorder & Action */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
            <button
              type="button"
              onClick={() => handleToggleRecord(selectedLesson.speechPrompt?.targetSentence)}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-900/60'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/60'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <div>
              <div className="text-sm font-bold text-white">
                {isRecording ? 'Sedang Mendengarkan... Ucapkan Kalimat Sekarang!' : 'Klik Mikrofon untuk Mulai Bicara'}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Web Speech API akan mentranskrip ucapan Anda dan AI Gemini akan mengevaluasi kefasihan serta makharijul hurufnya.
              </p>
            </div>

            {/* Manual input fallback */}
            <div className="w-full max-w-md pt-2 flex gap-2">
              <input
                type="text"
                dir="rtl"
                value={recordedTranscript}
                onChange={(e) => setRecordedTranscript(e.target.value)}
                placeholder="Atau ketik ucapan Anda di sini..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-arabic text-lg text-right text-xs focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => evaluateSpeechWithAI(recordedTranscript, selectedLesson.speechPrompt?.targetSentence)}
                disabled={evaluating || !recordedTranscript}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {evaluating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Evaluasi AI
              </button>
            </div>
          </div>

          {/* AI Speech Evaluation Result */}
          {speechEvaluation && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-950 border border-teal-700/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-sm text-white">Hasil Evaluasi Maharah Kalam AI</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-teal-900 text-teal-200 text-xs font-bold border border-teal-700">
                  Nilai: {speechEvaluation.score || 85} / 100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-teal-300">Kefasihan & Intonasi:</span>
                  <p className="mt-1 text-slate-300 leading-relaxed">{speechEvaluation.fluencyNote}</p>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-emerald-300">Catatan Makhraj & Huruf:</span>
                  <p className="mt-1 text-slate-300 leading-relaxed">{speechEvaluation.makhrajTips}</p>
                </div>
              </div>

              {speechEvaluation.encouragement && (
                <div className="p-3 rounded-xl bg-teal-900/30 border border-teal-800/40 text-xs text-teal-200 italic flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-teal-400" />
                  <span>{speechEvaluation.encouragement}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interactive AI Tutor Chat (Mitra Bicara Ustadz AI) */}
      {activeTab === 'ai-tutor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ustadz AI - Mitra Percakapan Bahasa Arab</h3>
                <p className="text-xs text-teal-400">Berlatih dialog santai dalam bahasa Arab fusha MA</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setChatMessages([
                  {
                    sender: 'ai',
                    textAr: 'أَهْلًا وَسَهْلًا! أَنَا مُسْتَعِدٌّ لِلْمُحَادَثَةِ مَعَكَ بِاللُّغَةِ العَرَبِيَّةِ.',
                    textId: 'Selamat datang! Saya siap bercakap-cakap denganmu dalam bahasa Arab.'
                  }
                ]);
              }}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800"
            >
              Reset Chat
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto p-2">
            {chatMessages.map((msg, idx) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {isAI && (
                    <div className="w-8 h-8 rounded-full bg-teal-900/80 text-teal-300 flex items-center justify-center text-xs shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                      isAI
                        ? 'bg-slate-950 border border-teal-900/60 text-slate-100'
                        : 'bg-teal-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        {isAI ? 'Ustadz AI' : user.displayName || 'Siswa'}
                      </span>
                      {isAI && (
                        <button
                          type="button"
                          onClick={() => ArabicAudioPlayer.playArabicText(msg.textAr)}
                          className="text-teal-300 hover:text-white"
                          title="Dengar suara"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="font-arabic text-xl sm:text-2xl leading-relaxed text-right">
                      {msg.textAr}
                    </p>

                    {msg.textId && (
                      <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800/60">
                        {msg.textId}
                      </p>
                    )}

                    {msg.vocab && msg.vocab.length > 0 && (
                      <div className="pt-2 text-[11px] text-teal-300 flex flex-wrap gap-1">
                        {msg.vocab.map((v, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-teal-950/60 border border-teal-900/60">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAI && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {tutorLoading && (
              <div className="flex items-center gap-2 text-xs text-teal-400 italic p-3">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Ustadz AI sedang menyusun balasan bahasa Arab...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              dir="rtl"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendTutorMessage();
              }}
              placeholder="اُكْتُبْ رِسَالَتَكَ بِالعَرَبِيَّةِ هُنَا..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-arabic text-xl text-right focus:outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleSendTutorMessage}
              disabled={tutorLoading || !userChatInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-lg shadow-teal-950"
            >
              <Send className="w-4 h-4" /> Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
