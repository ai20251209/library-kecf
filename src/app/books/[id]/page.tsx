'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  BookCheck, 
  Clock, 
  MapPin, 
  Barcode, 
  Share2, 
  Bookmark, 
  Award, 
  Lightbulb, 
  Send,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getStoredBooks, getCurrentUser, borrowBook, returnBook, getStoredLoans, saveStoredReadingLogs, getStoredReadingLogs } from '@/lib/db';
import { Book, Member, LoanRecord, ReadingLog } from '@/lib/types';
import AIChatBot from '@/components/AIChatBot';
import confetti from 'canvas-confetti';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [currentLoan, setCurrentLoan] = useState<LoanRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSuccessToast, setIsSuccessToast] = useState(true);

  // Review state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<ReadingLog[]>([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const loadData = () => {
    const allBooks = getStoredBooks();
    const found = allBooks.find((b) => b.id === bookId);
    setBook(found || null);

    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const loans = getStoredLoans();
      const active = loans.find((l) => l.bookId === bookId && l.memberId === user.id && l.status === 'active');
      setCurrentLoan(active || null);
    }

    const allLogs = getStoredReadingLogs().filter((log) => log.bookId === bookId);
    setReviews(allLogs);
  };

  useEffect(() => {
    loadData();
  }, [bookId]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl">📚</div>
        <h2 className="text-xl font-bold text-slate-800">도서를 찾을 수 없습니다</h2>
        <p className="text-xs text-slate-500">삭제되었거나 잘못된 경로입니다.</p>
        <Link href="/books" className="inline-block px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow">
          도서 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleBorrow = () => {
    if (!currentUser) return;
    const res = borrowBook(book.id, currentUser.id);
    setIsSuccessToast(res.success);
    setToastMessage(res.message);

    if (res.success) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      loadData();
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReturn = () => {
    if (!currentLoan) return;
    const res = returnBook(currentLoan.id);
    setIsSuccessToast(res.success);
    setToastMessage(res.message);

    if (res.success) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      loadData();
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !currentUser) return;

    setReviewSubmitting(true);

    // AI Review Coach Feedback Simulation
    setTimeout(() => {
      const newLog: ReadingLog = {
        id: `log-${Date.now()}`,
        memberId: currentUser.id,
        bookId: book.id,
        bookTitle: book.title,
        rating,
        reviewText: reviewText.trim(),
        aiFeedback: {
          compliment: `${currentUser.name} 학생! 《${book.title}》을 읽고 자신의 솔직한 느낌을 훌륭하게 표현했어요! 🌟`,
          thinkingPrompt: `만약 주인공이 다른 선택을 했다면 이야기는 어떻게 달라졌을지 친구들과 이야기해보세요.`,
          gradeLevelFit: `${currentUser.grade} 맞춤 독후감 우수작`,
          starAward: rating
        },
        createdAt: new Date().toISOString().split('T')[0]
      };

      const existingLogs = getStoredReadingLogs();
      const updated = [newLog, ...existingLogs];
      saveStoredReadingLogs(updated);

      setReviews((prev) => [newLog, ...prev]);
      setReviewText('');
      setReviewSubmitting(false);

      confetti({ particleCount: 80, spread: 90, origin: { y: 0.7 } });
    }, 600);
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>도서 목록으로 돌아가기</span>
        </Link>
      </div>

      {/* Book Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Book Cover Card */}
        <div className="lg:col-span-4">
          <div className={`w-full rounded-3xl bg-gradient-to-br ${book.coverColor} p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                {book.category}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/20 backdrop-blur-md">
                {book.recommendAge}
              </span>
            </div>

            <div className="my-auto text-center py-6">
              <span className="text-8xl drop-shadow-2xl inline-block animate-float">
                {book.coverEmoji}
              </span>
            </div>

            <div className="bg-black/30 backdrop-blur-md -mx-8 -mb-8 p-5 border-t border-white/10 text-center">
              <div className="font-bold text-lg leading-tight drop-shadow">{book.title}</div>
              <div className="text-xs text-white/80 mt-1">{book.author} · {book.publisher} ({book.publishYear})</div>
            </div>
          </div>
        </div>

        {/* Book Details & Loan Actions */}
        <div className="lg:col-span-8 space-y-6">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                {book.category}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                권장: {book.recommendAge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {book.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span>저자: <strong className="text-slate-800">{book.author}</strong></span>
              <span>출판사: <strong className="text-slate-800">{book.publisher}</strong></span>
              <span>발행: <strong className="text-slate-800">{book.publishYear}년</strong></span>
              <span>ISBN: <strong className="text-slate-800 font-mono">{book.isbn}</strong></span>
            </div>
          </div>

          {/* Location & Call Number Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">서가 위치</div>
                <div className="font-bold text-slate-800">{book.location}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Barcode className="w-4 h-4 text-cosmic-600 shrink-0" />
              <div>
                <div className="text-slate-400 text-[11px]">청구기호 (한국십진분류)</div>
                <div className="font-mono font-bold text-slate-800">{book.callNumber}</div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              줄거리 및 도서 안내
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
              {book.summary}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {book.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>

          {/* Loan / Return Action Bar */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <div className={`w-3.5 h-3.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-rose-400'}`} />
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {isAvailable ? `대출 가능 (${book.availableCopies}/${book.totalCopies}권 보유)` : '현재 대출 중 (반납 대기)'}
                </div>
                <div className="text-xs text-slate-500">
                  대출 기간: 기본 14일 (연장 1회 가능)
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {currentLoan ? (
                <button
                  onClick={handleReturn}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>반납하기 (+30P)</span>
                </button>
              ) : (
                <button
                  onClick={handleBorrow}
                  disabled={!isAvailable}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5 ${
                    isAvailable
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-brand-600/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <BookCheck className="w-4 h-4" />
                  <span>{isAvailable ? '지금 바로 대출하기' : '대출 불가 (예약하기)'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in ${
              isSuccessToast ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {isSuccessToast ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>{toastMessage}</span>
            </div>
          )}

        </div>

      </div>

      {/* Embedded AI BookBuddy Chat & Quiz Section */}
      <section id="ai-buddy" className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cosmic-500" />
              《{book.title}》 AI 북버디 & 심층 토론
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              초·중등 맞춤형 AI와 함께 책의 의미를 탐구하고 퀴즈를 풀어보세요!
            </p>
          </div>
        </div>

        <AIChatBot book={book} />
      </section>

      {/* Reading Review & AI Essay Coach Section */}
      <section className="pt-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            학생 독서 한줄평 & AI 독후감 코칭
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            느낀 점을 작성하면 AI가 칭찬과 함께 생각의 깊이를 더해주는 피드백을 전달합니다.
          </p>
        </div>

        {/* Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">별점 평가:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition"
                >
                  <Star className={`w-5 h-5 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            placeholder={`《${book.title}》을 읽고 가장 기억에 남는 장면이나 주인공에게 하고 싶은 말을 적어보세요...`}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={reviewSubmitting || !reviewText.trim()}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                reviewSubmitting || !reviewText.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{reviewSubmitting ? 'AI 코칭 생성 중...' : '독후평 등록 & AI 코칭 받기'}</span>
            </button>
          </div>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
              아직 등록된 독후평이 없습니다. 첫 번째 독후평의 주인공이 되어보세요!
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">회원 독후평</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-400">{r.createdAt}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {r.reviewText}
                </p>

                {/* AI Coach Feedback Card */}
                {r.aiFeedback && (
                  <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200/90 rounded-xl p-3.5 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        AI 독서 코치의 따뜻한 피드백
                      </span>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                        {r.aiFeedback.gradeLevelFit}
                      </span>
                    </div>

                    <p className="text-amber-800 leading-snug">
                      {r.aiFeedback.compliment}
                    </p>

                    <div className="text-amber-700 text-[11px] pt-1 border-t border-amber-200/60">
                      💡 <strong>생각해볼 점:</strong> {r.aiFeedback.thinkingPrompt}
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
