export type MaharahType = 'istima' | 'kalam' | 'qiraah' | 'kitabah' | 'qawaid' | 'mufradat' | 'ujian' | 'admin';

export type MAGrade = 'X' | 'XI' | 'XII';

export interface VocabWord {
  ar: string;
  id: string;
  category?: string;
  type?: 'Isim' | 'Fi\'il' | 'Harf';
  plural?: string;
  exampleAr?: string;
  exampleId?: string;
}

export interface Question {
  id: string;
  question: string;
  questionAr?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DialogueLine {
  speaker: string;
  speakerRole: 'A' | 'B';
  textAr: string;
  textId: string;
}

export interface ArrangeExercise {
  id: string;
  jumbledWords: string[];
  correctSentence: string;
  translation: string;
}

export interface ImlaExercise {
  id: string;
  audioText: string;
  expectedAr: string;
  hint: string;
}

export interface Lesson {
  id: string;
  maharah: MaharahType;
  grade: MAGrade;
  title: string;
  titleAr: string;
  description: string;
  level: 'Dasar' | 'Menengah' | 'Lanjutan';
  contentAr?: string;
  contentId?: string;
  audioDuration?: string;
  audioScript?: string;
  dialogue?: DialogueLine[];
  readingParagraphs?: { ar: string; id: string; notes?: string }[];
  vocabulary?: VocabWord[];
  questions?: Question[];
  arrangeExercises?: ArrangeExercise[];
  imlaExercises?: ImlaExercise[];
  writingTopic?: {
    topicAr: string;
    topicId: string;
    guidelines: string[];
    sampleEssay?: string;
  };
  speechPrompt?: {
    situationAr: string;
    situationId: string;
    targetSentence: string;
    tips: string[];
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'student';
  grade: MAGrade | 'Umum';
  madrasah: string;
  photoURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProgressRecord {
  id?: string;
  userId: string;
  maharah: MaharahType;
  lessonId: string;
  score: number;
  completed: boolean;
  feedback?: string;
  completedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  authorEmail: string;
  date: string;
}
