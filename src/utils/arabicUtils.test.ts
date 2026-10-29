import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stripHarakat,
  normalizeArabic,
  calculateArabicSimilarity,
  verifyArrangement,
  evaluateExam
} from './arabicUtils';

test('stripHarakat accurately strips Arabic vowels and diacritics', () => {
  const input = 'مَدْرَسَةٌ عَلِيَّةٌ إِسْلَامِيَّة';
  const expected = 'مدرسة علية إسلامية';
  assert.equal(stripHarakat(input), expected);
});

test('normalizeArabic handles alef variations and ta marbuta', () => {
  const word1 = 'إِسْلَام';
  const word2 = 'اسلام';
  assert.equal(normalizeArabic(word1), normalizeArabic(word2));

  const word3 = 'مَدْرَسَة';
  const word4 = 'مدرسه';
  assert.equal(normalizeArabic(word3), normalizeArabic(word4));
});

test('calculateArabicSimilarity calculates proper matching percentages', () => {
  assert.equal(calculateArabicSimilarity('الطَّالِبُ فِي الفَصْلِ', 'الطالب في الفصل'), 100);
  assert.ok(calculateArabicSimilarity('الطالب في المدرسة', 'الطالب في الفصل') > 40);
  assert.equal(calculateArabicSimilarity('', 'مرحبا'), 0);
});

test('verifyArrangement correctly checks reordered Arabic sentences', () => {
  const correct = 'يَذْهَبُ الطَّالِبُ إِلَى المَدْرَسَةِ كُلَّ يَوْمٍ';
  const selectedCorrect = ['يذهب', 'الطالب', 'إلى', 'المدرسة', 'كل', 'يوم'];
  const selectedWrong = ['المدرسة', 'يذهب', 'الطالب', 'إلى', 'كل', 'يوم'];

  assert.equal(verifyArrangement(selectedCorrect, correct), true);
  assert.equal(verifyArrangement(selectedWrong, correct), false);
});

test('evaluateExam calculates KKM 75 and assigns proper MA predicates', () => {
  const correctAnswers = { q1: 1, q2: 2, q3: 0, q4: 3 };
  
  // All correct = 100
  const perfectResult = evaluateExam({ q1: 1, q2: 2, q3: 0, q4: 3 }, correctAnswers);
  assert.equal(perfectResult.score, 100);
  assert.equal(perfectResult.isPassed, true);
  assert.equal(perfectResult.predicateAr, 'مُمْتَاز');

  // 3 out of 4 = 75 (Pass)
  const passResult = evaluateExam({ q1: 1, q2: 2, q3: 0, q4: 0 }, correctAnswers);
  assert.equal(passResult.score, 75);
  assert.equal(passResult.isPassed, true);
  assert.equal(passResult.predicateAr, 'جَيِّد');

  // 2 out of 4 = 50 (Fail)
  const failResult = evaluateExam({ q1: 1, q2: 2, q3: 1, q4: 0 }, correctAnswers);
  assert.equal(failResult.score, 50);
  assert.equal(failResult.isPassed, false);
});
