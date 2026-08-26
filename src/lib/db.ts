'use client';

import { Book, Member, LoanRecord, ReadingLog, LibraryConfig } from './types';
import { INITIAL_BOOKS, INITIAL_MEMBERS } from '../data/sampleBooks';

const STORAGE_KEYS = {
  BOOKS: 'starry_books_v1',
  MEMBERS: 'starry_members_v1',
  LOANS: 'starry_loans_v1',
  READING_LOGS: 'starry_reading_logs_v1',
  CURRENT_MEMBER: 'starry_current_member_v1',
  GEMINI_API_KEY: 'starry_gemini_api_key',
  LIBRARY_CONFIG: 'starry_library_config_v1',
};

// Known books master mapping for instant reliable cover, rich summary and direct YES24 links
const KNOWN_COVER_MAP: Record<string, { coverUrl: string; yes24Url: string; price: number; isbn: string; summary: string }> = {
  '와니니': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936442804.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936442804',
    price: 10800,
    isbn: '9788936442804',
    summary: '세렝게티 초원의 마디바 사자 무리에서 가장 작고 약하게 태어난 어린 암사자 와니니. 무리의 규칙을 어겼다는 억울한 오해를 받고 홀로 거친 초원에 쫓겨납니다. 굶주림과 하이에나, 거대한 수사자들의 위협 속에서 와니니는 자신처럼 무리에서 밀려난 외톨이 친구들(아산테, 잠보, 말라피)을 만나 작은 무리를 이룹니다. 서로의 약점을 감싸 안으며 초원의 사계절을 버텨내고 마침내 스스로의 힘으로 진정한 용기와 연대의 가치를 증명해내는 대한민국 대표 아동문학 성장 걸작입니다.',
  },
  '마당을 나온 암탉': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788971968710.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788971968710',
    price: 11000,
    isbn: '9788971968710',
    summary: '양계장 좁은 철장에 갇혀 알만 낳던 암탉 \'잎싹\'. 자신의 알을 직접 품어 병아리를 탄생시키겠다는 간절한 소망을 품고 마당을 탈출합니다. 숲속에서 버려진 청둥오리 알을 품어 아기 오리 \'초록머리\'를 낳아 기르며, 천적 족제비의 위협 속에서 목숨을 바쳐 자식을 지켜냅니다. 모성애와 자유, 그리고 자연의 순환에 대한 깊은 철학적 울림을 전하는 한국 아동문학의 불멸의 고전입니다.',
  },
  '아몬드': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434120.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936434120',
    price: 12000,
    isbn: '9788936434120',
    summary: '뇌 속 편도체(아몬드) 크기가 작아 분노도 공포도 느끼지 못하는 알렉시티미아(감정표현불능증)를 앓는 16세 소년 윤재. 비극적인 사고로 가족을 잃고 세상에 홀로 남겨진 윤재 앞에, 어두운 상처로 가득 찬 소년 \'곤이\'와 맑은 영혼의 소녀 \'도라\'가 나타납니다. 서로의 결핍을 마주하며 타인의 고통에 공감하는 법을 배워가는 뭉클한 청소년 성장 소설입니다.',
  },
  '어린 왕자': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932917245.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788932917245',
    price: 9800,
    isbn: '9788932917245',
    summary: '사하라 사막에 불시착한 비행사가 B612 소행성에서 온 어린 왕자를 만나며 시작되는 이야기. 장미꽃 한 송이를 사랑했지만 떠나올 수밖에 없었던 순수한 왕자가 여우를 만나 "가장 중요한 것은 눈에 보이지 않고 마음으로 보아야 한다"는 진리를 깨달아가는 불후의 세계 명작입니다.',
  },
  '불편한 편의점': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9791161571188',
    price: 14000,
    isbn: '9791161571188',
    summary: '서울 청파동 골목 모퉁이에 자리 잡은 낡고 불편한 ALWAYS 편의점. 지갑을 잃어버린 70대 전직 교사 염 여사는 자신의 지갑을 지켜준 노숙인 \'독고\'에게 야간 아르바이트 자리를 제안합니다. 말도 어눌하고 잃어버린 기억 속에 갇혀 있던 독고가 편의점을 오가는 지친 이웃들(취준생, 고단한 가장, 갈등을 겪는 모자 등)의 사연을 따뜻하게 들어주고 온기를 건네며, 편의점은 사람들의 상처를 치유하는 기적과 위로의 공간으로 탈바꿈합니다.',
  },
  '긴긴밤': {
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954677189.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788954677189',
    price: 11500,
    isbn: '9788954677189',
    summary: '지구상에 마지막 하나 남은 흰바위코뿔소 \'노든\'과 버려진 알에서 태어난 어린 펭귄의 눈물겨운 동행. 코끼리 무리에서 자라나 가족을 잃고 인간의 전쟁과 동물원을 거치며 깊은 상처를 입은 노든이, 어린 펭귄을 푸른 바다로 데려가기 위해 험난한 사막과 긴긴밤을 건넙니다. 수많은 존재들의 숭고한 사랑과 희생으로 마침내 자신만의 바다에 도달하는 찬란한 생명의 연대를 노래한 감동 대작입니다.',
  }
};

const enrichBook = (b: Book): Book => {
  let enriched = { ...b };

  for (const [key, meta] of Object.entries(KNOWN_COVER_MAP)) {
    if (b.title?.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(b.title?.toLowerCase())) {
      enriched.coverUrl = meta.coverUrl;
      enriched.yes24Url = meta.yes24Url;
      enriched.price = meta.price;
      enriched.isbn = meta.isbn;
      if (!enriched.summary || enriched.summary.length < 80) {
        enriched.summary = meta.summary;
      }
      break;
    }
  }

  if (!enriched.yes24Url) {
    enriched.yes24Url = `https://www.yes24.com/Product/Search?domain=BOOK&query=${encodeURIComponent(enriched.isbn || enriched.title)}`;
  }
  if (!enriched.price) {
    enriched.price = 12000;
  }

  return enriched;
};

// Safe LocalStorage helpers
export const getStoredBooks = (): Book[] => {
  if (typeof window === 'undefined') return INITIAL_BOOKS.map(enrichBook);
  const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (!saved) {
    const initialized = INITIAL_BOOKS.map(enrichBook);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(initialized));
    return initialized;
  }
  try {
    const parsed: Book[] = JSON.parse(saved);
    const enriched = parsed.map(enrichBook);
    // Persist enriched data back
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(enriched));
    return enriched;
  } catch (e) {
    return INITIAL_BOOKS.map(enrichBook);
  }
};

export const saveStoredBooks = (books: Book[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
};

export const getStoredMembers = (): Member[] => {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_MEMBERS;
  }
};

export const saveStoredMembers = (members: Member[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
};

export const getStoredLoans = (): LoanRecord[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
  if (!saved) {
    // Initial demo loans
    const initialLoans: LoanRecord[] = [
      {
        id: 'loan-1',
        bookId: 'book-1',
        bookTitle: '마당을 나온 암탉',
        bookCategory: '문학/동화',
        memberId: 'mem-1',
        memberName: '김하늘',
        memberBarcode: 'STU-2026-0101',
        borrowedAt: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0],
        status: 'active'
      },
      {
        id: 'loan-2',
        bookId: 'book-2',
        bookTitle: '아몬드 (Almond)',
        bookCategory: '문학/동화',
        memberId: 'mem-2',
        memberName: '박준서',
        memberBarcode: 'STU-2026-0205',
        borrowedAt: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0],
        status: 'active'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(initialLoans));
    return initialLoans;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const saveStoredLoans = (loans: LoanRecord[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
};

export const getStoredReadingLogs = (): ReadingLog[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEYS.READING_LOGS);
  if (!saved) {
    const initialLogs: ReadingLog[] = [
      {
        id: 'log-1',
        memberId: 'mem-1',
        bookId: 'book-6',
        bookTitle: '만복이네 떡집',
        rating: 5,
        reviewText: '만복이가 착한 말을 쓰려고 노력하는 모습이 너무 멋있었어요. 나도 친구들에게 상처 주는 말을 하지 않고 예쁜 말을 써야겠어요!',
        aiFeedback: {
          compliment: '하늘 학생! 만복이의 마음 변화를 깊이 이해하고 자신의 다짐으로 연결한 점이 정말 훌륭해요! 🌟',
          thinkingPrompt: '만약 하늘이가 만복이에게 소원 떡을 선물한다면 어떤 이름의 떡을 주고 싶나요?',
          gradeLevelFit: '초등 4학년 독서 논술 우수',
          starAward: 5
        },
        createdAt: '2026-03-10'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.READING_LOGS, JSON.stringify(initialLogs));
    return initialLogs;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
};

export const saveStoredReadingLogs = (logs: ReadingLog[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.READING_LOGS, JSON.stringify(logs));
};

export const getCurrentUser = (): Member => {
  if (typeof window === 'undefined') return INITIAL_MEMBERS[0];
  const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_MEMBER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return INITIAL_MEMBERS[0]; // 김하늘 (초4 기본)
};

export const setCurrentUser = (member: Member) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_MEMBER, JSON.stringify(member));
};

export const getStoredApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
};

export const saveStoredApiKey = (key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key);
};

// Loan Transaction Helper
export const borrowBook = (bookId: string, memberId: string): { success: boolean; message: string } => {
  const books = getStoredBooks();
  const members = getStoredMembers();
  const loans = getStoredLoans();

  const bookIndex = books.findIndex(b => b.id === bookId);
  const memberIndex = members.findIndex(m => m.id === memberId);

  if (bookIndex === -1) return { success: false, message: '도서를 찾을 수 없습니다.' };
  if (memberIndex === -1) return { success: false, message: '회원을 찾을 수 없습니다.' };

  const book = books[bookIndex];
  const member = members[memberIndex];

  if (book.availableCopies <= 0) {
    return { success: false, message: '현재 대출 가능한 도서가 없습니다 (대출 중).' };
  }

  const activeLoans = loans.filter(l => l.memberId === memberId && l.status === 'active');
  if (activeLoans.length >= member.maxLoans) {
    return { success: false, message: `최대 대출 가능 권수(${member.maxLoans}권)를 초과했습니다.` };
  }

  // Already borrowing this book?
  const alreadyBorrowing = activeLoans.find(l => l.bookId === bookId);
  if (alreadyBorrowing) {
    return { success: false, message: '이미 대출 중인 도서입니다.' };
  }

  // Update book
  book.availableCopies -= 1;
  if (book.availableCopies === 0) {
    book.status = 'borrowed';
  }
  books[bookIndex] = book;
  saveStoredBooks(books);

  // Update member
  member.activeLoansCount += 1;
  members[memberIndex] = member;
  saveStoredMembers(members);

  // Create loan record (14 days return period)
  const now = new Date();
  const dueDate = new Date();
  dueDate.setDate(now.getDate() + 14);

  const newLoan: LoanRecord = {
    id: `loan-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.title,
    bookCategory: book.category,
    memberId: member.id,
    memberName: member.name,
    memberBarcode: member.barcode,
    borrowedAt: now.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    status: 'active'
  };

  loans.unshift(newLoan);
  saveStoredLoans(loans);

  return { success: true, message: `"${book.title}" 대출이 완료되었습니다! (반납기한: ${newLoan.dueDate})` };
};

// Return Transaction Helper
export const returnBook = (loanId: string): { success: boolean; message: string } => {
  const books = getStoredBooks();
  const members = getStoredMembers();
  const loans = getStoredLoans();

  const loanIndex = loans.findIndex(l => l.id === loanId);
  if (loanIndex === -1) return { success: false, message: '대출 기록을 찾을 수 없습니다.' };

  const loan = loans[loanIndex];
  if (loan.status === 'returned') return { success: false, message: '이미 반납 처리된 도서입니다.' };

  loan.status = 'returned';
  loan.returnedAt = new Date().toISOString().split('T')[0];
  loans[loanIndex] = loan;
  saveStoredLoans(loans);

  // Update book copies
  const bookIndex = books.findIndex(b => b.id === loan.bookId);
  if (bookIndex !== -1) {
    books[bookIndex].availableCopies = Math.min(books[bookIndex].totalCopies, books[bookIndex].availableCopies + 1);
    books[bookIndex].status = 'available';
    saveStoredBooks(books);
  }

  // Update member active count & reward points
  const memberIndex = members.findIndex(m => m.id === loan.memberId);
  if (memberIndex !== -1) {
    members[memberIndex].activeLoansCount = Math.max(0, members[memberIndex].activeLoansCount - 1);
    members[memberIndex].totalBooksRead += 1;
    members[memberIndex].readingPoints += 30; // 30 points per book returned!
    members[memberIndex].level = Math.min(10, Math.floor(members[memberIndex].readingPoints / 100) + 1);
    saveStoredMembers(members);
  }

  return { success: true, message: `"${loan.bookTitle}" 반납이 정상 처리되었습니다! (+30 독서포인트 지급)` };
};

export const DEFAULT_LIBRARY_CONFIG: LibraryConfig = {
  libraryName: '별빛 북스페이스 작은도서관',
  subTitle: '초·중학생을 위한 AI 독서 메이트 & 스마트 작은도서관',
  contactPhone: '02-1234-5678',
  location: '마을 커뮤니티 센터 2층',
  adminPin: '1234',
  enableYes24Sync: true,
};

export const getStoredLibraryConfig = (): LibraryConfig => {
  if (typeof window === 'undefined') return DEFAULT_LIBRARY_CONFIG;
  const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY_CONFIG);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.LIBRARY_CONFIG, JSON.stringify(DEFAULT_LIBRARY_CONFIG));
    return DEFAULT_LIBRARY_CONFIG;
  }
  try {
    return { ...DEFAULT_LIBRARY_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    return DEFAULT_LIBRARY_CONFIG;
  }
};

export const saveStoredLibraryConfig = (config: LibraryConfig) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LIBRARY_CONFIG, JSON.stringify(config));
};
