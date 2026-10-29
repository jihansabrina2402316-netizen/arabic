/**
 * Arabic Text Utilities & Grading Logic for Al-Arabiyyah MA
 */

// Strip Arabic Harakat (tashkeel diacritics)
export function stripHarakat(text: string): string {
  if (!text) return '';
  // Unicode range for Arabic diacritics: \u064B - \u065F, \u0670
  return text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

// Normalize Arabic letters (alef, hamzah, ta marbutha, ya/alif maqsura)
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return stripHarakat(text)
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity between student answer and target text (0 to 100)
export function calculateArabicSimilarity(input: string, target: string): number {
  const normInput = normalizeArabic(input);
  const normTarget = normalizeArabic(target);

  if (normInput === normTarget) return 100;
  if (!normInput || !normTarget) return 0;

  // Word-level matching
  const inputWords = normInput.split(' ').filter(Boolean);
  const targetWords = normTarget.split(' ').filter(Boolean);

  let matchedWords = 0;
  for (const word of inputWords) {
    if (targetWords.includes(word)) {
      matchedWords++;
    }
  }

  const wordScore = (matchedWords / Math.max(inputWords.length, targetWords.length)) * 100;
  return Math.min(100, Math.round(wordScore));
}

// Verify sentence arrangement exercise
export function verifyArrangement(selectedWords: string[], correctSentence: string): boolean {
  const joined = selectedWords.join(' ');
  return normalizeArabic(joined) === normalizeArabic(correctSentence);
}

// Evaluate exam grade and Arabic academic predicate
export interface ExamResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  predicateAr: string;
  predicateId: string;
  isPassed: boolean;
}

export function evaluateExam(userAnswers: Record<string, number>, correctAnswers: Record<string, number>): ExamResult {
  const questionIds = Object.keys(correctAnswers);
  const total = questionIds.length;
  if (total === 0) {
    return {
      score: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      predicateAr: 'رَاسِب',
      predicateId: 'Belum Lulus',
      isPassed: false,
    };
  }

  let correct = 0;
  for (const qId of questionIds) {
    if (userAnswers[qId] === correctAnswers[qId]) {
      correct++;
    }
  }

  const score = Math.round((correct / total) * 100);

  // Kriteria Ketuntasan Minimal (KKM) Madrasah Aliyah: 75
  const isPassed = score >= 75;

  let predicateAr = 'مُمْتَاز';
  let predicateId = 'Sangat Baik (Mumtaz)';

  if (score >= 90) {
    predicateAr = 'مُمْتَاز';
    predicateId = 'Istimewa / Mumtaz (A)';
  } else if (score >= 80) {
    predicateAr = 'جَيِّد جِدًّا';
    predicateId = 'Sangat Baik / Jayyid Jiddan (B+)';
  } else if (score >= 75) {
    predicateAr = 'جَيِّد';
    predicateId = 'Baik / Jayyid (B)';
  } else if (score >= 60) {
    predicateAr = 'مَقْبُوْل';
    predicateId = 'Cukup / Maqbul (C)';
  } else {
    predicateAr = 'رَاسِب';
    predicateId = 'Perlu Remedial (D)';
  }

  return {
    score,
    totalQuestions: total,
    correctAnswers: correct,
    predicateAr,
    predicateId,
    isPassed,
  };
}
