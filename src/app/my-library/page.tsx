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
  AlertCircle,
  Trash2,
  Copy,
  ExternalLink,
  MessageSquare,
  Bookmark
} from 'lucide-react';
import { 
  getCurrentUser, 
  getStoredLoans, 
  returnBook, 
  getStoredReadingLogs,
  getStoredSavedDialogues,
  deleteStoredSavedDialogue
} from '@/lib/db';
import { Member, LoanRecord, ReadingLog, SavedAiDialogue } from '@/lib/types';
import ReadingTree from '@/components/ReadingTree';
import confetti from 'canvas-confetti';

export default function MyLibraryPage() {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [savedDialogues, setSavedDialogues] = useState<SavedAiDialogue[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'scraps' | 'history' | 'badges' | 'card'>('current');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const allLoans = getStoredLoans().filter((l) => l.memberId === user.id);
      setLoans(allLoans);

      const logs = getStoredReadingLogs().filter((l) => l.memberId === user.id);
      setReadingLogs(logs);

      const dialogues = getStoredSavedDialogues();
      setSavedDialogues(dialogues);
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

  const handleDeleteDialogue = (id: string, title: string) => {
    if (confirm(`《${title}》 관련 저장된 AI 대화 노트를 휴지통에 버리시겠습니까?`)) {
      deleteStoredSavedDialogue(id);
      setSavedDialogues((prev) => prev.filter((d) => d.id !== id));
      setToastMessage('대화 노트가 안전하게 삭제(휴지통 비우기)되었습니다.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage('대화 내용이 클립보드에 복사되었습니다! 📋');
    setTimeout(() => setToastMessage(null), 2500);
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
              {currentUser.name} 님의 스마트 독서 통장 & 개인 독서장
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
      <div className="flex flex-wrap border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm text-xs font-bold gap-1">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'current' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-brand-600" />
          <span>현재 대출 도서 ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scraps')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'scraps' ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>AI 심층 대화 노트 ({savedDialogues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>대출/완독 이력 ({returnedLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'badges' ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-purple-600" />
          <span>획득 뱃지 ({currentUser.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'card' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Barcode className="w-4 h-4 text-indigo-600" />
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

      {/* Tab 2: Saved AI Dialogues Scrap Notes */}
      {activeTab === 'scraps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>나만의 AI 심층 대화 스크랩 노트</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  총 {savedDialogues.length}개 보관
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                AI 북버디와 나눈 깊이 있는 생각과 명답변이 <strong>날짜와 시간(초 단위)</strong>과 함께 영구 보관됩니다.
              </p>
            </div>

            <Link
              href="/books"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0"
            >
              <span>+ 새 책 읽고 AI와 대화하기</span>
            </Link>
          </div>

          {savedDialogues.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-400 space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-xl">
                ⭐
              </div>
              <h4 className="font-bold text-slate-700 text-sm">아직 저장된 AI 독서 대화가 없습니다.</h4>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                도서 상세 페이지 하단의 <strong>[AI 북버디 & 심층 토론]</strong>에서 마음에 드는 AI의 답변 말풍선 아래 <strong>[⭐ 독서장에 저장]</strong> 버튼을 누르면 이곳에 날짜/시간과 함께 자동으로 모입니다!
              </p>
              <Link 
                href="/books" 
                className="inline-block mt-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow hover:brightness-110 transition"
              >
                추천 도서 읽고 AI와 대화해보기 🚀
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {savedDialogues.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative group"
                >
                  {/* Card Header: Book Info & Saved Timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      {item.bookCoverUrl ? (
                        <img 
                          src={item.bookCoverUrl} 
                          alt={item.bookTitle} 
                          className="w-10 h-14 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-amber-100 flex items-center justify-center text-lg shrink-0">
                          📖
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                            {item.category || '문학/동화'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.targetLevel === 'elem_low' ? '초등 저학년' : item.targetLevel === 'middle' ? '중학생' : '초등 고학년'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                          {item.bookTitle}
                        </h4>
                      </div>
                    </div>

                    {/* Timestamp Badge */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>기록: {item.savedAt}</span>
                      </span>
                    </div>
                  </div>

                  {/* Dialogue Content */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* User Question */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        Q
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-700 block mb-0.5">내가 던진 생각 질문:</span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {item.userQuestion}
                        </p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="bg-gradient-to-br from-cosmic-50/50 via-white to-amber-50/30 p-4 rounded-2xl border border-cosmic-100 flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-cosmic-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        AI
                      </span>
                      <div className="flex-1 space-y-1">
                        <span className="font-semibold text-cosmic-800 block text-xs">AI 북버디의 심층 해설 & 대화:</span>
                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {item.aiResponse}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      {item.bookId && item.bookId !== 'general-chat' && (
                        <Link
                          href={`/books/${item.bookId}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 font-bold text-slate-600 transition flex items-center gap-1"
                        >
                          <span>이 책 다시 읽기</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopyText(`[도서] ${item.bookTitle}\n[질문] ${item.userQuestion}\n[AI 답변] ${item.aiResponse}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold transition flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteDialogue(item.id, item.bookTitle)}
                      className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition flex items-center gap-1 border border-rose-200 hover:border-rose-300"
                      title="이 노트를 휴지통에 버립니다"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>휴지통에 버리기</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            완독 및 반납 이력 ({returnedLoans.length}권)
          </h3>

          {returnedLoans.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              아직 반납된 완독 이력이 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">도서명</th>
                    <th className="p-3.5">분야</th>
                    <th className="p-3.5">대출일</th>
                    <th className="p-3.5">반납일</th>
                    <th className="p-3.5 text-right">보상 포인트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returnedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-800">{loan.bookTitle}</td>
                      <td className="p-3.5 text-slate-500">{loan.bookCategory}</td>
                      <td className="p-3.5 text-slate-500">{loan.borrowedAt}</td>
                      <td className="p-3.5 text-emerald-600 font-medium">{loan.returnedAt || loan.dueDate}</td>
                      <td className="p-3.5 text-right font-bold text-amber-600">+30 P</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            내가 획득한 독서 뱃지 ({currentUser.badges.length}개)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {currentUser.badges.map((badge) => (
              <div key={badge.id} className="p-4 bg-white rounded-2xl border border-purple-100 shadow-sm text-center space-y-2">
                <div className="text-4xl">{badge.icon}</div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{badge.name}</h4>
                <p className="text-[11px] text-slate-500">{badge.description}</p>
                <div className="text-[10px] text-purple-600 font-mono">
                  {badge.unlockedAt} 획득
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Mobile Card */}
      {activeTab === 'card' && (
        <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">
                별빛 작은도서관 모바일 회원증
              </span>
              <h3 className="text-lg font-black mt-0.5">{currentUser.name}</h3>
            </div>
            <span className="text-3xl">{currentUser.avatarEmoji}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl text-center space-y-2 shadow-inner">
            {/* Real Barcode Graphic */}
            <div className="font-mono text-slate-900 font-black text-2xl tracking-[0.3em] py-2 border-y-2 border-slate-900">
              ||| | |||| | ||| | |||
            </div>
            <div className="text-xs font-mono font-bold text-slate-600">
              {currentUser.barcode}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="text-[10px] text-indigo-200">독서 레벨</div>
              <div className="font-black text-sm mt-0.5">Lv. {currentUser.level}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="text-[10px] text-indigo-200">누적 완독</div>
              <div className="font-black text-sm mt-0.5">{currentUser.totalBooksRead}권</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="text-[10px] text-indigo-200">독서 포인트</div>
              <div className="font-black text-sm mt-0.5 text-amber-300">{currentUser.readingPoints} P</div>
            </div>
          </div>

          <div className="text-center text-[10px] text-indigo-200">
            도서 대출 및 사서 확인 시 이 화면을 사서에게 보여주세요.
          </div>
        </div>
      )}

    </div>
  );
}
