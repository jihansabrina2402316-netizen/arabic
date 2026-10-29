import React from 'react';
import { UserProfile, MaharahType } from '../types';
import { checkIsAdmin } from '../firebase';
import {
  LogOut,
  ShieldCheck,
  User,
  GraduationCap,
  Sparkles,
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Layers,
  Search,
  Award,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeMaharah: MaharahType;
  onSelectMaharah: (maharah: MaharahType) => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeMaharah,
  onSelectMaharah,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const isAdmin = user.role === 'admin' || checkIsAdmin(user.email);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onSelectMaharah('istima')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950 font-bold text-lg font-arabic shrink-0">
              ع
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">
                  Al-Arabiyyah MA
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 hidden sm:inline-block whitespace-nowrap">
                  Kelas X-XII
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block whitespace-nowrap">
                Pembelajaran Bahasa Arab Terpadu
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation links for desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSelectMaharah('istima')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'istima'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Istima'
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('kalam')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'kalam'
                ? 'bg-teal-950 text-teal-300 border border-teal-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> Kalam
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('qiraah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'qiraah'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Qira'ah
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('kitabah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'kitabah'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Kitabah
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('qawaid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'qawaid'
                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Qawa'id
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('mufradat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'mufradat'
                ? 'bg-blue-950 text-blue-300 border border-blue-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Kamus
          </button>
          <button
            type="button"
            onClick={() => onSelectMaharah('ujian')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeMaharah === 'ujian'
                ? 'bg-purple-950 text-purple-300 border border-purple-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Asesmen
          </button>
        </nav>

        {/* Right: User Profile & Logout Button */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() => onSelectMaharah('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMaharah === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}

          {/* User Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center font-bold">
              {user.displayName?.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <div className="text-slate-200 font-semibold truncate max-w-[120px]">
                {user.displayName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                {user.role === 'admin' ? 'Administrator' : `Kelas ${user.grade || 'X'}`}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            title="Keluar dari akun"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
