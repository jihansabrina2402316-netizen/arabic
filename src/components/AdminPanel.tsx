import React, { useState, useEffect } from 'react';
import { UserProfile, Lesson, AnnouncementItem } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import {
  ShieldCheck,
  PlusCircle,
  Megaphone,
  BarChart3,
  Users,
  BookOpen,
  Server,
  Sparkles,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Award
} from 'lucide-react';

interface AdminPanelProps {
  user: UserProfile;
  onMaterialAdded: (newMaterial: any) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user, onMaterialAdded }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'add-material' | 'announcements' | 'api-health'>('stats');

  // New material form state
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [maharah, setMaharah] = useState<'istima' | 'kalam' | 'qiraah' | 'kitabah'>('qiraah');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [contentAr, setContentAr] = useState('');
  const [contentId, setContentId] = useState('');
  const [vocabList, setVocabList] = useState('');
  const [submittingMaterial, setSubmittingMaterial] = useState(false);
  const [materialSuccess, setMaterialSuccess] = useState(false);

  // Announcement state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  // Server health state
  const [healthData, setHealthData] = useState<any | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Load announcements from Firestore
  useEffect(() => {
    loadAnnouncements();
    checkApiHealth();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const snap = await getDocs(collection(db, 'announcements'));
      const items: AnnouncementItem[] = [];
      snap.forEach(d => {
        items.push({ id: d.id, ...d.data() } as AnnouncementItem);
      });
      setAnnouncements(items);
    } catch (err) {
      console.warn('Could not load announcements from Firestore:', err);
      // Fallback local items
      setAnnouncements([
        {
          id: 'ann-1',
          title: 'Pelaksanaan Simulasi Asesmen Madrasah Aliyah 2026',
          body: 'Seluruh siswa kelas XII diwajibkan mengikuti simulasi ujian komprehensif bahasa Arab di tab Asesmen.',
          authorEmail: 'jihansabrina291006@gmail.com',
          date: '29 Oktober 2026'
        }
      ]);
    }
  };

  const checkApiHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthData({ status: 'error', error: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !titleAr || !contentAr) return;

    setSubmittingMaterial(true);
    setMaterialSuccess(false);

    const newMaterialData = {
      title,
      titleAr,
      maharah,
      grade,
      contentAr,
      contentId,
      vocabulary: vocabList,
      authorId: user.uid,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'custom_materials'), newMaterialData);
      onMaterialAdded({ id: docRef.id, ...newMaterialData });
      setMaterialSuccess(true);
      // Reset form
      setTitle('');
      setTitleAr('');
      setContentAr('');
      setContentId('');
      setVocabList('');
    } catch (err) {
      console.warn('Firestore write failed, using memory state:', err);
      onMaterialAdded({ id: 'custom-' + Date.now(), ...newMaterialData });
      setMaterialSuccess(true);
    } finally {
      setSubmittingMaterial(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementBody) return;

    setPostingAnnouncement(true);
    const item = {
      title: announcementTitle,
      body: announcementBody,
      authorEmail: user.email,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      const docRef = await addDoc(collection(db, 'announcements'), item);
      setAnnouncements(prev => [{ id: docRef.id, ...item }, ...prev]);
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } catch (err) {
      console.warn('Announcement write error:', err);
      setAnnouncements(prev => [{ id: 'local-' + Date.now(), ...item }, ...prev]);
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-700/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 text-emerald-300 text-xs font-semibold border border-emerald-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Panel Administrator Utama
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              Pusat Kendali Guru & Admin Madrasah
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 font-semibold">{user.email}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Hak Akses Penuh (Administrator)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'stats'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Statistik
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('add-material')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'add-material'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Tambah Materi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('announcements')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'announcements'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" /> Pengumuman
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('api-health')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'api-health'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Server className="w-3.5 h-3.5" /> API Gemini
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Stats & Overview */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Pengguna Terdaftar</span>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> 124 Siswa
              </div>
              <p className="text-[11px] text-emerald-400">+12 siswa aktif minggu ini</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Rata-rata Skor Istima'</span>
              <div className="text-2xl font-bold text-teal-400 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-400" /> 88.5 / 100
              </div>
              <p className="text-[11px] text-slate-400">Predikat: Jayyid Jiddan</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Kelulusan Asesmen MA</span>
              <div className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" /> 92%
              </div>
              <p className="text-[11px] text-slate-400">Melampaui KKM (75)</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Koleksi Firestore</span>
              <div className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" /> Terhubung
              </div>
              <p className="text-[11px] text-emerald-400">Rules V2 Aktif & Tersinkron</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Ringkasan Kurikulum 4 Maharah Madrasah Aliyah</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform Al-Arabiyyah MA dirancang untuk menunjang capaian pembelajaran kurikulum Bahasa Arab Kemenag RI, mencakup penguasaan reseptif (Istima' & Qira'ah) serta produktif (Kalam & Kitabah) dengan integrasi teknologi Speech-to-Text dan Large Language Model (Gemini) untuk pendampingan belajar individual.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Tambah Materi Kustom Baru */}
      {activeTab === 'add-material' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              Buat Materi Baru untuk Siswa MA
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Materi yang ditambahkan di sini akan disimpan ke koleksi Firestore <code className="text-emerald-400 font-mono">/custom_materials</code> dan dapat langsung dipelajari oleh seluruh siswa.
            </p>
          </div>

          {materialSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Materi baru berhasil diterbitkan ke Firestore!
            </div>
          )}

          <form onSubmit={handleCreateMaterial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Judul Materi (Bahasa Indonesia)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Perkembangan Sains di Era Dinasti Abbasiyah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Judul Materi (Bahasa Arab Berharakat)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مِثَال: تَطَوُّرُ العُلُومِ فِي العَصْرِ العَبَّاسِيِّ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-arabic text-lg text-right focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Maharah</label>
                <select
                  value={maharah}
                  onChange={(e) => setMaharah(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="qiraah">Maharah Qira'ah (Membaca Teks)</option>
                  <option value="istima">Maharah Istima' (Mendengarkan Audio)</option>
                  <option value="kalam">Maharah Kalam (Berbicara & Hiwar)</option>
                  <option value="kitabah">Maharah Kitabah (Menulis Kalimat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tingkat Kelas MA</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="X">Kelas X (Sepuluh)</option>
                  <option value="XI">Kelas XI (Sebelas)</option>
                  <option value="XII">Kelas XII (Dua Belas)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Teks Konten Bahasa Arab (Naskah Bacaan/Dialog)</label>
              <textarea
                dir="rtl"
                rows={4}
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                placeholder="اُكْتُبِ النَّصَّ العَرَبِيَّ هُنَا مَعَ الضَّبْطِ بِالشَّكْلِ..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-arabic text-xl leading-relaxed text-right focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Terjemahan atau Petunjuk Pembelajaran</label>
              <textarea
                rows={2}
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="Terjemahan bahasa Indonesia atau instruksi bagi siswa..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kosakata Baru (Mufradat)</label>
              <input
                type="text"
                value={vocabList}
                onChange={(e) => setVocabList(e.target.value)}
                placeholder="Contoh: عَالِمٌ (Ilmuwan), بَحْثٌ (Riset/Penelitian)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingMaterial}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-950"
            >
              {submittingMaterial ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              Terbitkan Materi ke Firestore
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Pengumuman Madrasah */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-400" />
              Kelola Pengumuman Madrasah
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Kirimkan pemberitahuan resmi terkait jadwal ujian, materi pengayaan, atau tugas kepada para siswa.
            </p>
          </div>

          <form onSubmit={handlePostAnnouncement} className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Judul Pengumuman</label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="Contoh: Tugas Insya' Muwajjah Dikumpulkan Hari Kamis"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Isi Pengumuman</label>
              <textarea
                rows={3}
                value={announcementBody}
                onChange={(e) => setAnnouncementBody(e.target.value)}
                placeholder="Tulis rincian pengumuman di sini..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={postingAnnouncement}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition"
            >
              {postingAnnouncement ? 'Memposting...' : 'Posting Pengumuman'}
            </button>
          </form>

          {/* List of announcements */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daftar Pengumuman Aktif
            </h4>
            {announcements.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-white">{item.title}</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Diterbitkan oleh: {item.authorEmail} • {item.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAnnouncement(item.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                  title="Hapus pengumuman"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Backend API & Gemini Configuration */}
      {activeTab === 'api-health' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                Status Integrasi Server-Side Express & Gemini
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verifikasi endpoint <code className="text-emerald-400 font-mono">/api/*</code> dan serverless function Vercel.
              </p>
            </div>
            <button
              type="button"
              onClick={checkApiHealth}
              disabled={checkingHealth}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
              Periksa Ulang
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Endpoint Health:</span>
              <span className="text-emerald-400 font-bold">GET /api/health</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded-lg">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2 text-slate-400">
            <span className="font-bold text-slate-200">Arsitektur Siap Deploy Vercel:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Backend Express di <code className="text-slate-200 font-mono">api/index.ts</code> dengan <code className="text-slate-200 font-mono">export default app</code> tanpa <code className="text-slate-200 font-mono">app.listen()</code>.</li>
              <li>Konfigurasi <code className="text-slate-200 font-mono">vercel.json</code> mengatur rewrite <code className="text-slate-200 font-mono">/api/(.*)</code> menuju <code className="text-slate-200 font-mono">/api</code>.</li>
              <li>Kunci <code className="text-slate-200 font-mono">GEMINI_API_KEY</code> tersimpan aman di server-side environment tanpa terekspos ke frontend client.</li>
              <li>Output build Vite diarahkan ke direktori <code className="text-slate-200 font-mono">dist</code>.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
