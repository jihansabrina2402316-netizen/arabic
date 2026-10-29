import React from 'react';
import { Delete, Space, CornerDownLeft, Sparkles } from 'lucide-react';

interface VirtualKeyboardProps {
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear?: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onInsertChar,
  onBackspace,
  onSpace,
  onClear
}) => {
  // Row 1: Diacritics (Harakat)
  const harakatRow = [
    { label: 'َ (Fathah)', char: '\u064E' },
    { label: 'ِ (Kasrah)', char: '\u0650' },
    { label: 'ُ (Dhammah)', char: '\u064F' },
    { label: 'ْ (Sukun)', char: '\u0652' },
    { label: 'ّ (Syaddah)', char: '\u0651' },
    { label: 'ً (Tanwin Fath)', char: '\u064B' },
    { label: 'ٍ (Tanwin Kasr)', char: '\u064D' },
    { label: 'ٌ (Tanwin Dhamm)', char: '\u064C' },
    { label: 'ٰ (Alif Khanjariyyah)', char: '\u0670' },
    { label: 'ٓ (Maddah)', char: '\u0653' }
  ];

  // Arabic Alphabet Rows
  const row1 = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د', 'ذ'];
  const row2 = ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'];
  const row3 = ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ'];

  return (
    <div className="bg-slate-900 border border-emerald-700/50 rounded-2xl p-3 shadow-2xl select-none max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-emerald-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          لوحة المفاتيح العربية (Papan Ketik Arab & Harakat)
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors px-2 py-0.5 rounded hover:bg-rose-950/40"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Row Harakat */}
      <div className="flex flex-wrap gap-1 justify-center mb-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
        {harakatRow.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsertChar(item.char)}
            title={item.label}
            className="px-2 py-1 bg-emerald-950/50 hover:bg-emerald-700 text-emerald-300 hover:text-white rounded-lg text-base font-bold transition active:scale-95 border border-emerald-800/40"
          >
            ـ{item.char}
          </button>
        ))}
      </div>

      {/* Row 1 */}
      <div className="flex gap-1 justify-center mb-1.5">
        {row1.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onInsertChar(char)}
            className="flex-1 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-lg text-lg font-arabic font-semibold transition active:scale-95 shadow-sm border border-slate-700 hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex gap-1 justify-center mb-1.5 px-3">
        {row2.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onInsertChar(char)}
            className="flex-1 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-lg text-lg font-arabic font-semibold transition active:scale-95 shadow-sm border border-slate-700 hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 */}
      <div className="flex gap-1 justify-center mb-2 px-6">
        {row3.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onInsertChar(char)}
            className="flex-1 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-lg text-lg font-arabic font-semibold transition active:scale-95 shadow-sm border border-slate-700 hover:border-emerald-500"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Action Row */}
      <div className="flex gap-2 justify-center pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={onSpace}
          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-700"
        >
          <Space className="w-4 h-4" /> Spasi (مسافة)
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className="w-28 py-2 bg-rose-900/40 hover:bg-rose-700 text-rose-200 hover:text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition active:scale-95 border border-rose-800/60"
        >
          <Delete className="w-4 h-4" /> Hapus
        </button>
      </div>
    </div>
  );
};
