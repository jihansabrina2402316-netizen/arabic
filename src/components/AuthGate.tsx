import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, checkIsAdmin, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthGateProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
  mockLoginFallback: (email: string, displayName: string, role: 'admin' | 'student') => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLoginSuccess, mockLoginFallback }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState<'X' | 'XI' | 'XII'>('X');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fillAdminCredentials = () => {
    setEmail('jihansabrina291006@gmail.com');
    setPassword('Jihanns_29');
    setDisplayName('Jihan Sabrina (Admin MA)');
    setErrorMsg(null);
  };

  const fillStudentCredentials = () => {
    setEmail('siswa.madrasah@aliyah.sch.id');
    setPassword('Madrasah2026!');
    setDisplayName('Ahmad Fauzan');
    setGrade('X');
    setErrorMsg(null);
  };

  // Sync or create user profile in Firestore
  const syncUserProfile = async (uid: string, userEmail: string, name: string): Promise<UserProfile> => {
    const isAdmin = checkIsAdmin(userEmail);
    const userRef = doc(db, 'users', uid);
    let profileData: UserProfile;

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        profileData = snap.data() as UserProfile;
      } else {
        profileData = {
          uid,
          email: userEmail,
          displayName: name || (isAdmin ? 'Admin Al-Arabiyyah MA' : 'Siswa Madrasah Aliyah'),
          role: isAdmin ? 'admin' : 'student',
          grade: isAdmin ? 'Umum' : grade,
          madrasah: 'Madrasah Aliyah Negeri (MAN) Model',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, profileData);
      }
      return profileData;
    } catch (err: any) {
      console.warn('Firestore sync failed, creating memory profile:', err);
      // Fallback in case of permission or initial network lag
      profileData = {
        uid,
        email: userEmail,
        displayName: name || (isAdmin ? 'Admin Al-Arabiyyah MA' : 'Siswa Madrasah Aliyah'),
        role: isAdmin ? 'admin' : 'student',
        grade: isAdmin ? 'Umum' : grade,
        madrasah: 'Madrasah Aliyah Model',
        createdAt: new Date().toISOString()
      };
      return profileData;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Mohon isi alamat email dan kata sandi');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        const profile = await syncUserProfile(cred.user.uid, email, displayName || 'Siswa MA');
        onLoginSuccess(profile);
      } else {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const profile = await syncUserProfile(cred.user.uid, cred.user.email || email, cred.user.displayName || displayName || 'Pengguna');
          onLoginSuccess(profile);
        } catch (signInErr: any) {
          // If admin requested credentials don't exist yet in Firebase Auth, auto-create
          if (
            email.toLowerCase() === 'jihansabrina291006@gmail.com' &&
            (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/invalid-login-credentials')
          ) {
            try {
              const cred = await createUserWithEmailAndPassword(auth, email, password);
              await updateProfile(cred.user, { displayName: 'Jihan Sabrina (Admin MA)' });
              const profile = await syncUserProfile(cred.user.uid, email, 'Jihan Sabrina (Admin MA)');
              onLoginSuccess(profile);
              return;
            } catch (createErr: any) {
              console.warn('Auto create admin failed:', createErr);
            }
          }

          // If Firebase email/password auth is not enabled on project or throws auth/operation-not-allowed,
          // gracefully allow login for specified admin credentials
          if (email.toLowerCase() === 'jihansabrina291006@gmail.com' && password === 'Jihanns_29') {
            mockLoginFallback(email, 'Jihan Sabrina (Admin MA)', 'admin');
            return;
          }

          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = err.message || 'Terjadi kesalahan saat masuk';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Email atau kata sandi tidak sesuai.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Email sudah terdaftar. Silakan pilih Masuk (Login).';
      } else if (err.code === 'auth/weak-password') {
        message = 'Kata sandi minimal 6 karakter.';
      } else if (err.code === 'auth/operation-not-allowed') {
        // Fallback for admin if provider not toggled yet
        if (email.toLowerCase() === 'jihansabrina291006@gmail.com' && password === 'Jihanns_29') {
          mockLoginFallback(email, 'Jihan Sabrina (Admin MA)', 'admin');
          return;
        }
        message = 'Login Email belum diaktifkan di konsol Firebase. Anda dapat menggunakan tombol Google Sign-In.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(res.user.uid, res.user.email || '', res.user.displayName || 'Siswa MA');
      onLoginSuccess(profile);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Gagal masuk dengan akun Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Banner */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950 font-bold text-xl">
              ع
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                Al-Arabiyyah MA
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Kemenag MA
                </span>
              </h1>
              <p className="text-xs text-slate-400">Platform Pembelajaran Terpadu 4 Maharah Berbasis AI</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-arabic text-emerald-300">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </span>
          </div>
        </div>
      </header>

      {/* Main Content: Split Hero & Login Card */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex-1 w-full flex flex-col lg:flex-row items-center gap-12 justify-center">
        {/* Left Side: Overview & Maharah Highlights */}
        <div className="flex-1 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/60 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Kurikulum Madrasah Aliyah Kelas X, XI & XII
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Kuasai <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">4 Maharah</span> Bahasa Arab Secara Terpadu
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Portal pembelajaran interaktif khusus siswa dan guru Madrasah Aliyah. Dilengkapi latihan istima' dengan audio fasih, latihan kalam dengan speech recognition, qira'ah berharakat lengkap, dan kitabah dengan evaluasi tata bahasa AI Gemini.
          </p>

          {/* 4 Maharah Grid Mini */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3 hover:border-emerald-700/60 transition">
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Istima' (Menyimak)</h3>
                <p className="text-xs text-slate-400">Audio dialog, naskah & kuis pemahaman</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3 hover:border-teal-700/60 transition">
              <div className="p-2 rounded-lg bg-teal-950 text-teal-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Kalam (Berbicara)</h3>
                <p className="text-xs text-slate-400">Hiwar roleplay & evaluasi makhraj suara</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3 hover:border-cyan-700/60 transition">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Qira'ah (Membaca)</h3>
                <p className="text-xs text-slate-400">Teks MA, arti kata & i'rab terintegrasi</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-start gap-3 hover:border-indigo-700/60 transition">
              <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">Kitabah (Menulis)</h3>
                <p className="text-xs text-slate-400">Tartib kalimat & insya' koreksi AI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Tersimpan di Cloud Firestore
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Asesmen Standar Madrasah
            </span>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {isRegister ? 'Daftar Akun Baru' : 'Gerbang Masuk (Masuk Siswa / Guru)'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Wajib Login
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {isRegister ? 'Buat Akun Siswa MA' : 'Selamat Datang di Al-Arabiyyah'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Silakan masuk untuk mengakses materi pelajaran dan menyimpan progres.
              </p>
            </div>

            {/* Quick Demo Pre-fill Buttons */}
            <div className="mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span>Akses Cepat Pengujian:</span>
                <span className="text-[10px] text-emerald-400 font-mono">1-Klik Isi Form</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="px-2.5 py-2 text-left bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 rounded-xl transition group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> Akun Admin
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    jihansabrina291006@gmail.com
                  </div>
                </button>

                <button
                  type="button"
                  onClick={fillStudentCredentials}
                  className="px-2.5 py-2 text-left bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                    <GraduationCap className="w-3.5 h-3.5" /> Akun Siswa
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    siswa.madrasah...
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Masuk dengan Akun Google
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                atau gunakan email & sandi
              </span>
            </div>

            {/* Form Email & Password */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Contoh: Muhammad Farhan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required={isRegister}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Kelas MA</label>
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
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">Kata Sandi</label>
                  {email === 'jihansabrina291006@gmail.com' && (
                    <span className="text-[10px] text-emerald-400 font-mono">Admin Password Match</span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition active:scale-[0.98] disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Memproses...</span>
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" /> Daftar Akun Siswa
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Masuk ke Aplikasi
                  </>
                )}
              </button>
            </form>

            {/* Toggle Login / Register */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                {isRegister
                  ? 'Sudah punya akun? Masuk di sini'
                  : 'Belum punya akun? Buat akun siswa baru'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Al-Arabiyyah MA - Kurikulum Bahasa Arab Madrasah Aliyah Kemenag RI</p>
      </footer>
    </div>
  );
};
