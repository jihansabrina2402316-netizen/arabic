import React, { useState, useEffect } from 'react';
import {
  auth,
  db,
  checkIsAdmin,
  testConnection,
  handleFirestoreError,
  OperationType
} from './firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { UserProfile, MaharahType, Lesson, UserProgressRecord } from './types';
import { INITIAL_LESSONS } from './data/maharahData';
import { AuthGate } from './components/AuthGate';
import { Navbar } from './components/Navbar';
import { MobileDrawer } from './components/MobileDrawer';
import { MaharahIstima } from './components/MaharahIstima';
import { MaharahKalam } from './components/MaharahKalam';
import { MaharahQiraah } from './components/MaharahQiraah';
import { MaharahKitabah } from './components/MaharahKitabah';
import { ModulQawaid } from './components/ModulQawaid';
import { KamusMufradat } from './components/KamusMufradat';
import { AsesmenMadrasah } from './components/AsesmenMadrasah';
import { AdminPanel } from './components/AdminPanel';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeMaharah, setActiveMaharah] = useState<MaharahType>('istima');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lesson list (default initial lessons + custom materials added by admin from Firestore)
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [userScores, setUserScores] = useState<Record<string, number>>({});

  // 1. Validate connection and listen to Auth state on initial boot
  useEffect(() => {
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdmin = checkIsAdmin(fbUser.email);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setCurrentUser(snap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || (isAdmin ? 'Admin Al-Arabiyyah MA' : 'Siswa Madrasah Aliyah'),
              role: isAdmin ? 'admin' : 'student',
              grade: isAdmin ? 'Umum' : 'X',
              madrasah: 'Madrasah Aliyah Model',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (err) {
          console.warn('Firestore load profile error, using fallback:', err);
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Pengguna MA',
            role: isAdmin ? 'admin' : 'student',
            grade: isAdmin ? 'Umum' : 'X',
            madrasah: 'Madrasah Aliyah Model'
          });
        }
      } else {
        // If no user in Firebase Auth, check if fallback memory user was active
        setCurrentUser(prev => prev?.uid?.startsWith('fallback-') ? prev : null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to custom learning materials from Firestore
  useEffect(() => {
    if (!currentUser) return;

    try {
      const q = collection(db, 'custom_materials');
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const customList: Lesson[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            customList.push({
              id: docSnap.id,
              maharah: data.maharah || 'qiraah',
              grade: data.grade || 'X',
              level: 'Menengah',
              title: data.title,
              titleAr: data.titleAr,
              description: 'Materi tambahan yang disusun oleh Ustadz/Admin MA.',
              contentAr: data.contentAr,
              contentId: data.contentId,
              audioScript: data.contentAr,
              readingParagraphs: [
                { ar: data.contentAr, id: data.contentId || '' }
              ]
            });
          });

          if (customList.length > 0) {
            setLessons([...INITIAL_LESSONS, ...customList]);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'custom_materials');
        }
      );
      return () => unsub();
    } catch (err) {
      console.warn('Could not attach custom materials listener:', err);
    }
  }, [currentUser]);

  // Handle mock / fallback login for admin jihansabrina291006@gmail.com
  const handleMockLoginFallback = (email: string, displayName: string, role: 'admin' | 'student') => {
    const profile: UserProfile = {
      uid: 'fallback-' + (email.includes('jihan') ? 'admin' : 'student'),
      email,
      displayName,
      role,
      grade: role === 'admin' ? 'Umum' : 'X',
      madrasah: 'Madrasah Aliyah Negeri (MAN) Model',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(profile);
  };

  const handleLogout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(null);
    setActiveMaharah('istima');
  };

  // Save student progress to Firestore per user
  const handleSaveProgress = async (lessonId: string, score: number) => {
    setUserScores(prev => ({ ...prev, [lessonId]: score }));

    if (!currentUser || currentUser.uid.startsWith('fallback-')) {
      return;
    }

    try {
      const progressRef = doc(db, 'users', currentUser.uid, 'progress', lessonId);
      const record: UserProgressRecord = {
        userId: currentUser.uid,
        lessonId,
        maharah: activeMaharah,
        score,
        completed: score >= 75,
        completedAt: new Date().toISOString()
      };
      await setDoc(progressRef, record, { merge: true });
    } catch (err) {
      console.warn('Save progress to Firestore error:', err);
    }
  };

  const handleCustomMaterialAdded = (newMaterial: any) => {
    const formatted: Lesson = {
      id: newMaterial.id,
      maharah: newMaterial.maharah,
      grade: newMaterial.grade,
      level: 'Menengah',
      title: newMaterial.title,
      titleAr: newMaterial.titleAr,
      description: 'Materi tambahan guru dari Firestore.',
      contentAr: newMaterial.contentAr,
      contentId: newMaterial.contentId,
      audioScript: newMaterial.contentAr,
      readingParagraphs: [
        { ar: newMaterial.contentAr, id: newMaterial.contentId || '' }
      ]
    };
    setLessons(prev => [formatted, ...prev]);
  };

  // Filter lessons for each maharah
  const istimaLessons = lessons.filter(l => l.maharah === 'istima');
  const kalamLessons = lessons.filter(l => l.maharah === 'kalam');
  const qiraahLessons = lessons.filter(l => l.maharah === 'qiraah');
  const kitabahLessons = lessons.filter(l => l.maharah === 'kitabah');

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-2xl font-arabic animate-bounce shadow-xl shadow-emerald-950">
          ع
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Memuat Al-Arabiyyah MA...
        </div>
      </div>
    );
  }

  // Wajib Login Gate
  if (!currentUser) {
    return (
      <AuthGate
        onLoginSuccess={(profile) => setCurrentUser(profile)}
        mockLoginFallback={handleMockLoginFallback}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        activeMaharah={activeMaharah}
        onSelectMaharah={(m) => setActiveMaharah(m)}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        user={currentUser}
        activeMaharah={activeMaharah}
        onSelectMaharah={(m) => setActiveMaharah(m)}
        onLogout={handleLogout}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
        {activeMaharah === 'istima' && (
          <MaharahIstima
            lessons={istimaLessons}
            user={currentUser}
            onSaveProgress={handleSaveProgress}
          />
        )}

        {activeMaharah === 'kalam' && (
          <MaharahKalam
            lessons={kalamLessons}
            user={currentUser}
            onSaveProgress={handleSaveProgress}
          />
        )}

        {activeMaharah === 'qiraah' && (
          <MaharahQiraah
            lessons={qiraahLessons}
            user={currentUser}
            onSaveProgress={handleSaveProgress}
          />
        )}

        {activeMaharah === 'kitabah' && (
          <MaharahKitabah
            lessons={kitabahLessons}
            user={currentUser}
            onSaveProgress={handleSaveProgress}
          />
        )}

        {activeMaharah === 'qawaid' && <ModulQawaid />}

        {activeMaharah === 'mufradat' && <KamusMufradat />}

        {activeMaharah === 'ujian' && (
          <AsesmenMadrasah
            user={currentUser}
            onSaveProgress={handleSaveProgress}
          />
        )}

        {activeMaharah === 'admin' && (
          <AdminPanel
            user={currentUser}
            onMaterialAdded={handleCustomMaterialAdded}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Al-Arabiyyah MA • Kurikulum Terpadu Bahasa Arab Madrasah Aliyah</span>
          <span className="font-arabic text-emerald-400 text-sm">
            مَنْ جَدَّ وَجَدَ • مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ
          </span>
        </div>
      </footer>
    </div>
  );
}
