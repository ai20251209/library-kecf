export type TargetLevel = 'elem_low' | 'elem_high' | 'middle'; // 초등 저학년, 초등 고학년, 중학생

export type BookCategory = 
  | '문학/동화'
  | '과학/우주'
  | '역사/사회'
  | '판타지/모험'
  | '철학/인성'
  | '예술/만화'
  | '진로/자기계발';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  category: BookCategory;
  targetLevel: TargetLevel;
  callNumber: string; // 청구기호 (예: 813.8-김28ㅁ)
  location: string; // 서가 위치 (예: 초등문학 A-03)
  summary: string;
  coverEmoji: string; // Fallback or cute visual emoji
  coverColor: string; // Gradient color theme for visual card
  coverUrl?: string;
  yes24Url?: string; // YES24 도서 상세 및 구매 링크
  price?: number; // 정가 (원)
  status: 'available' | 'borrowed' | 'reserved';
  totalCopies: number;
  availableCopies: number;
  tags: string[];
  recommendAge: string;
  deepQuestions: {
    question: string;
    focus: string; // '인물심리' | '세계관/배경' | '도덕적판단' | '창의적확장'
  }[];
  sampleQuizzes: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface LibraryConfig {
  libraryName: string; // 도서관 명칭 (예: 별빛 작은도서관)
  subTitle: string;    // 슬로건
  contactPhone: string;
  location: string;
  adminPin: string;    // 사서 마스터 PIN (기본: 1234)
  geminiApiKey?: string;
  enableYes24Sync: boolean;
  themeColor?: string;
}

export interface Member {
  id: string;
  barcode: string; // 회원증 바코드/QR (예: "STU-2026-0042")
  name: string;
  birthDate: string; // 생년월일 4자리 MMDD (예: "0512")
  grade: string; // 예: "초등 3학년", "초등 6학년", "중학교 2학년"
  schoolName: string;
  role: 'student' | 'teacher' | 'general' | 'admin';
  avatarEmoji: string;
  readingPoints: number;
  level: number; // 독서 레벨 (1~10)
  totalBooksRead: number;
  activeLoansCount: number;
  maxLoans: number;
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt?: string;
  }[];
  joinedAt: string;
}

export interface LoanRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCategory: BookCategory;
  memberId: string;
  memberName: string;
  memberBarcode: string;
  borrowedAt: string; // YYYY-MM-DD
  dueDate: string;    // YYYY-MM-DD
  returnedAt?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface ReadingLog {
  id: string;
  memberId: string;
  bookId: string;
  bookTitle: string;
  rating: number; // 1~5
  reviewText: string;
  aiFeedback?: {
    compliment: string;
    thinkingPrompt: string;
    gradeLevelFit: string;
    starAward: number;
  };
  createdAt: string;
}

export interface AIThinkingPrompt {
  id: string;
  level: TargetLevel;
  title: string;
  prompt: string;
}
