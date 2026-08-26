'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles, 
  Grid, 
  List, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { getStoredBooks } from '@/lib/db';
import { Book, TargetLevel, BookCategory } from '@/lib/types';
import BookCard from '@/components/BookCard';

const CATEGORIES: BookCategory[] = [
  '문학/동화',
  '과학/우주',
  '역사/사회',
  '판타지/모험',
  '철학/인성',
  '예술/만화',
  '진로/자기계발'
];

function BooksContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<TargetLevel | 'all'>('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'copies'>('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const refreshBooks = () => {
    setBooks(getStoredBooks());
  };

  useEffect(() => {
    refreshBooks();
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setOnlyAvailable(false);
    setSortBy('title');
  };

  // Filter & Sort
  const filteredBooks = books.filter((b) => {
    // Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.publisher.toLowerCase().includes(q) ||
      b.isbn.includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q));

    // Category
    const matchCategory = selectedCategory === 'all' || b.category === selectedCategory;

    // Level
    const matchLevel = selectedLevel === 'all' || b.targetLevel === selectedLevel;

    // Only Available
    const matchAvailable = !onlyAvailable || b.availableCopies > 0;

    return matchQuery && matchCategory && matchLevel && matchAvailable;
  }).sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title, 'ko');
    if (sortBy === 'year') return b.publishYear - a.publishYear;
    if (sortBy === 'copies') return b.availableCopies - a.availableCopies;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600" />
            도서 통합 검색 & 탐색
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            작은도서관 소장 도서 <strong className="text-slate-800 font-semibold">{books.length}종</strong> 및 10,000권 규모 검색 카탈로그
          </p>
        </div>

        {/* View Switcher & Reset */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>필터 초기화</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-white shadow text-brand-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-white shadow text-brand-600 font-bold' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="도서명, 저자, 출판사, ISBN, 핵심 키워드로 검색해보세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">카테고리:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 분야
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row (Grade Level, Availability, Sorting) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          
          {/* Target Grade Level */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">권장 학년:</span>
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-2.5 py-1 rounded-lg font-medium ${selectedLevel === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedLevel('elem_low')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${selectedLevel === 'elem_low' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              🐣 초등 저학년
            </button>
            <button
              onClick={() => setSelectedLevel('elem_high')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${selectedLevel === 'elem_high' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              🚀 초등 고학년
            </button>
            <button
              onClick={() => setSelectedLevel('middle')}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 ${selectedLevel === 'middle' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              🦉 중학생
            </button>
          </div>

          {/* Availability Checkbox & Sort */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer select-none font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>대출 가능한 책만 보기</span>
            </label>

            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-medium">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="title">가나다순 (제목)</option>
                <option value="year">발행연도 최신순</option>
                <option value="copies">대출 가능 권수순</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">검색 조건과 일치하는 도서가 없습니다</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            검색어 오타를 확인하거나 필터를 초기화해보세요.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-700 transition"
          >
            모든 도서 보기
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" : "space-y-4"}>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onBookUpdated={refreshBooks} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">도서 카탈로그를 불러오는 중...</div>}>
      <BooksContent />
    </Suspense>
  );
}
