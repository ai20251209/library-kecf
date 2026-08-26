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

// Safe LocalStorage helpers
export const getStoredBooks = (): Book[] => {
  if (typeof window === 'undefined') return INITIAL_BOOKS;
  const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_BOOKS;
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
