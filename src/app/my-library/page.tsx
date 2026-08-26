'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookmarkCheck, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  QrCode, 
  BookOpen, 
  Sparkles, 
  Star, 
  Barcode, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getCurrentUser, getStoredLoans, returnBook, getStoredReadingLogs } from '@/lib/db';
import { Member, LoanRecord, ReadingLog } from '@/lib/types';
import ReadingTree from '@/components/ReadingTree';
import confetti from 'canvas-confetti';

export default function MyLibraryPage() {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'badges' | 'card'>('current');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const allLoans = getStoredLoans().filter((l) => l.memberId === user.id);
      setLoans(allLoans);

      const logs = getStoredReadingLogs().filter((l) => l.memberId === user.id);
      setReadingLogs(logs);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturn = (loanId: string) => {
    const res = returnBook(loanId);
    setToastMessage(res.message);
    if (res.success) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      loadData();
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!currentUser) return null;

  const activeLoans = loans.filter((l) => l.status === 'active');
  const returnedLoans = loans.filter((l) => l.status === 'returned');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currentUser.avatarEmoji}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentUser.name} 님의 스마트 독서 통장
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser.schoolName} · {currentUser.grade} · 회원코드: <strong className="font-mono">{currentUser.barcode}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('card')}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>모바일 회원증 보기</span>
          </button>
        </div>
      </div>

      {/* Reading Growth Tree Banner */}
      <ReadingTree member={currentUser} />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'current' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-600" />
          <span>현재 대출 도서 ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>대출/완독 이력 ({returnedLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'badges' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-purple-600" />
          <span>획득 뱃지 ({currentUser.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'card' ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Barcode className="w-4 h-4 text-amber-600" />
          <span>모바일 회원증</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-medium flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Current Loans */}
      {activeTab === 'current' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              대출 현황 ({activeLoans.length}/{currentUser.maxLoans}권)
            </h3>
            <Link href="/books" className="text-xs text-brand-600 font-bold hover:underline">
              + 새 도서 빌리러 가기
            </Link>
          </div>

          {activeLoans.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p>현재 대출 중인 도서가 없습니다.</p>
              <Link href="/books" className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white font-bold rounded-xl shadow">
                도서 탐색하기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                        {loan.bookCategory}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        D-day 반납기한 {loan.dueDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 mt-2">
                      {loan.bookTitle}
                    </h4>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>대출일: {loan.borrowedAt}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/books/${loan.bookId}#ai-buddy`}
                      className="px-3 py-1.5 text-xs font-bold text-cosmic-700 bg-cosmic-50 hover:bg-cosmic-100 rounded-lg transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI 북버디 대화</span>
                    </Link>

                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>반납 처리 (+30P)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Loan & Reading History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            완독 및 반납 이력 ({returnedLoans.length}권)
          </h3>

          {returnedLoans.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              아직 반납된 이력이 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">도서명</th>
                    <th className="p-3.5">분야</th>
                    <th className="p-3.5">대출일</th>
                    <th className="p-3.5">반납일</th>
                    <th className="p-3.5 text-right">획득 포인트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returnedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">{loan.bookTitle}</td>
                      <td className="p-3.5">{loan.bookCategory}</td>
                      <td className="p-3.5 text-slate-500">{loan.borrowedAt}</td>
                      <td className="p-3.5 text-emerald-600 font-medium">{loan.returnedAt || '-'}</td>
                      <td className="p-3.5 text-right font-bold text-amber-600">+30 P</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Badges Gallery */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            독서 퀘스트 달성 뱃지
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentUser.badges.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-orange-100 flex items-center justify-center text-3xl shadow-inner border border-amber-200">
                  {b.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{b.description}</div>
                  {b.unlockedAt && (
                    <div className="text-[10px] text-amber-600 font-medium mt-1">획득: {b.unlockedAt}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Mobile Library Card (QR / Barcode) */}
      {activeTab === 'card' && (
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 text-center space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-left">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  STARRY BOOKSPACE
                </span>
                <h4 className="font-bold text-sm text-white">별빛 작은도서관 모바일 회원증</h4>
              </div>
              <span className="text-2xl">{currentUser.avatarEmoji}</span>
            </div>

            <div className="py-2">
              <div className="text-2xl font-black text-white">{currentUser.name}</div>
              <div className="text-xs text-slate-400">{currentUser.schoolName} · {currentUser.grade}</div>
            </div>

            {/* Visual Simulated Barcode */}
            <div className="bg-white p-4 rounded-2xl text-slate-900 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-center space-x-1 h-12">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 6, 4, 2, 7, 3, 5, 2, 6, 2, 4, 3, 5, 2, 7].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <div className="font-mono text-sm font-black tracking-widest text-slate-800">
                {currentUser.barcode}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              도서관 대출/반납 키오스크 또는 사서 선생님 바코드 리더기에 화면을 스캔해주세요.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
