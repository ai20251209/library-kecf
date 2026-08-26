'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  Search, 
  Compass, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Clock, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Lightbulb, 
  ArrowRight
} from 'lucide-react';
import { getStoredBooks, getCurrentUser, getStoredLoans } from '@/lib/db';
import { Book, Member, LoanRecord, TargetLevel } from '@/lib/types';
import BookCard from '@/components/BookCard';
import ReadingTree from '@/components/ReadingTree';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [activeLoans, setActiveLoans] = useState<LoanRecord[]>([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<TargetLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
    const allBooks = getStoredBooks();
    setBooks(allBooks);
    
    if (user) {
      const loans = getStoredLoans().filter(l => l.memberId === user.id && l.status === 'active');
      setActiveLoans(loans);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredBooks = books.filter(b => {
    const matchLevel = selectedLevelFilter === 'all' || b.targetLevel === selectedLevelFilter;
    const matchSearch = searchQuery.trim() === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Cosmic Portal Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
        
        {/* Glow & Sparkles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-cosmic-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>초·중학생을 위한 차세대 AI 스마트 작은도서관</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            책 속 세상과 <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">AI 북버디</span>가<br className="hidden sm:inline" /> 
            너의 생각을 깨워줄 거야!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            10,000권의 도서 탐험부터 AI와 함께하는 심층 독서 토론, 퀴즈 챌린지, 독서 통장까지! 나만의 지혜 우주를 키워보세요.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-2xl focus-within:border-brand-400 focus-within:bg-white/15 transition">
              <Search className="w-5 h-5 text-slate-300 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="도서명, 작가, 키워드(예: 아몬드, 우주, 모험)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent text-white placeholder:text-slate-400 text-sm focus:outline-none"
              />
              <Link
                href={`/books?q=${encodeURIComponent(searchQuery)}`}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-cosmic-600 text-white rounded-xl text-xs font-bold shadow-lg hover:brightness-110 shrink-0 transition"
              >
                검색하기
              </Link>
            </div>
          </div>

          {/* Age Level Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">눈높이 선택:</span>
            
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3.5 py-1.5 rounded-full border transition font-semibold ${
                selectedLevelFilter === 'all'
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              전체 도서
            </button>

            <button
              onClick={() => setSelectedLevelFilter('elem_low')}
              className={`px-3.5 py-1.5 rounded-full border transition font-semibold flex items-center gap-1.5 ${
                selectedLevelFilter === 'elem_low'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <span>🐣</span>
              <span>초등 저학년 (1~3학년)</span>
            </button>

            <button
              onClick={() => setSelectedLevelFilter('elem_high')}
              className={`px-3.5 py-1.5 rounded-full border transition font-semibold flex items-center gap-1.5 ${
                selectedLevelFilter === 'elem_high'
                  ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <span>🚀</span>
              <span>초등 고학년 (4~6학년)</span>
            </button>

            <button
              onClick={() => setSelectedLevelFilter('middle')}
              className={`px-3.5 py-1.5 rounded-full border transition font-semibold flex items-center gap-1.5 ${
                selectedLevelFilter === 'middle'
                  ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <span>🦉</span>
              <span>중학생 (1~3학년)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Gamified Reading Tree Widget (for current student) */}
        {currentUser && (
          <section>
            <ReadingTree member={currentUser} />
          </section>
        )}

        {/* Daily AI Thinking Challenge & My Active Loans Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily AI Challenge */}
          <div className="lg:col-span-2 bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-cosmic-500/10 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> 오늘의 AI 생각 퀘스트
                </span>
                <span className="text-xs text-slate-500 font-medium">매일 새로운 질문</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 pt-1">
                "만약 내가 하루 동안 원하는 책 속 등장인물이 될 수 있다면 누구를 고를까?"
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                나만의 이유를 AI 북버디에게 설명하고, 칭찬 스탬프와 함께 +20 독서 포인트를 획득해보세요!
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center -space-x-1.5">
                <span className="text-xl">🦊</span>
                <span className="text-xl">🐰</span>
                <span className="text-xl">🦁</span>
                <span className="text-xs font-medium text-slate-500 pl-2">오늘 142명의 친구들이 대화 참여 중</span>
              </div>

              <Link
                href="/ai-lounge?prompt=만약 내가 하루 동안 원하는 책 속 등장인물이 될 수 있다면 누구를 고를까?"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
              >
                <span>생각 나누기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Loans Quick View */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  현재 대출 중인 도서
                </h3>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {activeLoans.length}권
                </span>
              </div>

              {activeLoans.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  현재 대출 중인 도서가 없습니다.<br />마음에 드는 책을 대출해보세요!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="font-bold text-slate-800 truncate">{loan.bookTitle}</div>
                      <div className="flex items-center justify-between text-slate-500 mt-1 text-[11px]">
                        <span>반납 예정: {loan.dueDate}</span>
                        <span className="text-brand-600 font-semibold">대출 중</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/my-library"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center block transition"
              >
                내 독서 통장 바로가기 →
              </Link>
            </div>
          </div>

        </div>

        {/* 3. Curated Books Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                이달의 인기 필독서 & 추천 도서
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                사서 선생님과 AI가 엄선한 초·중학생 맞춤형 도서입니다.
              </p>
            </div>

            <Link
              href="/books"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>전체 도서 보기</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} onBookUpdated={refreshData} />
            ))}
          </div>
        </section>

        {/* 4. Why AI Little Library Feature Banner */}
        <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-cosmic-400 tracking-wider uppercase">
              NEXT-GEN LITTLE LIBRARY LMS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              왜 초·중학생 작은도서관에 AI가 필요할까요?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              단순히 책을 빌려보는 것을 넘어, AI가 친구가 되어 질문을 던지고 상상력을 넓혀줄 때 책 한 권의 가치는 10배로 자라납니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
                🐣
              </div>
              <h3 className="font-bold text-sm text-white">초등 저학년 맞춤</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                동화 같은 쉬운 대화와 칭찬 스탬프로 독서에 대한 흥미와 친밀감을 높여줍니다.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-3">
                🚀
              </div>
              <h3 className="font-bold text-sm text-white">초등 고학년 상상력</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                "만약 나라면?" 질문을 통해 주인공의 심리를 이해하고 공감 능력을 심화합니다.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-3">
                🦉
              </div>
              <h3 className="font-bold text-sm text-white">중학생 심층 비판 토론</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                문학적 상징, 사회적 딜레마, 철학적 주제를 분석하여 사고력과 논술력을 완성합니다.
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
