import React from 'react';
import { UserProfile, MaharahType } from '../types';
import { checkIsAdmin } from '../firebase';
import {
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Layers,
  Search,
  Award,
  ShieldCheck,
  LogOut,
  X
} from 'lucide-react';

interface MobileDrawerProps {
  user: UserProfile;
  activeMaharah: MaharahType;
  onSelectMaharah: (m: MaharahType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  user,
  activeMaharah,
  onSelectMaharah,
  onLogout,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const isAdmin = user.role === 'admin' || checkIsAdmin(user.email);

  const menuItems: { id: MaharahType; label: string; labelAr: string; icon: any }[] = [
    { id: 'istima', label: 'Maharah Istima\' (Menyimak)', labelAr: 'الاِسْتِمَاع', icon: Headphones },
    { id: 'kalam', label: 'Maharah Kalam (Berbicara)', labelAr: 'الكَلَام', icon: Mic },
    { id: 'qiraah', label: 'Maharah Qira\'ah (Membaca)', labelAr: 'القِرَاءَة', icon: BookOpen },
    { id: 'kitabah', label: 'Maharah Kitabah (Menulis)', labelAr: 'الكِتَابَة', icon: PenTool },
    { id: 'qawaid', label: 'Kaidah Nahwu & Sharaf', labelAr: 'القَوَاعِد', icon: Layers },
    { id: 'mufradat', label: 'Kamus Mufradat MA', labelAr: 'المُفْرَدَات', icon: Search },
    { id: 'ujian', label: 'Simulasi Asesmen MA', labelAr: 'الاِخْتِبَار', icon: Award }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl">
        <div className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-arabic font-bold">
                ع
              </div>
              <span className="font-bold text-white text-sm">Al-Arabiyyah MA</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Info */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
            <div className="text-[11px] text-slate-400 truncate font-mono">{user.email}</div>
            <div className="text-[10px] text-emerald-400 font-medium">
              {isAdmin ? 'Administrator Utama' : `Siswa Kelas ${user.grade || 'X'}`}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeMaharah === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectMaharah(item.id);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-arabic text-xs text-slate-500">{item.labelAr}</span>
                </button>
              );
            })}

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onSelectMaharah('admin');
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 mt-2 transition ${
                  activeMaharah === 'admin'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Panel Admin Utama</span>
              </button>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
};
