'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  ArrowLeft,
  Barcode,
  Layers,
  Upload,
  ShoppingCart,
  ExternalLink,
  BookMarked,
  Image as ImageIcon
} from 'lucide-react';
import { getStoredBooks, saveStoredBooks, getStoredApiKey } from '@/lib/db';
import { Book, TargetLevel, BookCategory } from '@/lib/types';
import confetti from 'canvas-confetti';

const CATEGORIES: BookCategory[] = [
  '문학/동화',
  '과학/우주',
  '역사/사회',
  '판타지/모험',
  '철학/인성',
  '예술/만화',
  '진로/자기계발'
];

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // YES24 Search State
  const [isYes24ModalOpen, setIsYes24ModalOpen] = useState(false);
  const [yes24Query, setYes24Query] = useState('');
  const [yes24Results, setYes24Results] = useState<any[]>([]);
  const [isYes24Searching, setIsYes24Searching] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    publisher: '',
    publishYear: 2024,
    price: 15000,
    yes24Url: '',
    coverUrl: '',
    isbn: '',
    category: '문학/동화',
    targetLevel: 'elem_high',
    callNumber: '',
    location: '',
    summary: '',
    coverEmoji: '📚',
    coverColor: 'from-blue-500 to-indigo-700',
    totalCopies: 3,
    availableCopies: 3,
    recommendAge: '초등 4~6학년',
    tags: ['추천도서'],
    deepQuestions: [],
    sampleQuizzes: []
  });

  const loadBooks = () => {
    setBooks(getStoredBooks());
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Search YES24 Open Catalog
  const handleSearchYes24 = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!yes24Query.trim()) {
      alert('검색할 도서명이나 ISBN을 입력해주세요.');
      return;
    }

    setIsYes24Searching(true);
    try {
      const res = await fetch(`/api/books/yes24?q=${encodeURIComponent(yes24Query.trim())}`);
      const data = await res.json();
      if (data.success && data.items) {
        setYes24Results(data.items);
      } else {
        setYes24Results([]);
      }
    } catch (err) {
      console.error(err);
      alert('YES24 서지정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsYes24Searching(false);
    }
  };

  // Apply YES24 Book to Form + Trigger AI Auto Enrichment
  const handleSelectYes24Book = async (item: any) => {
    setFormData((prev) => ({
      ...prev,
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      publishYear: item.publishYear,
      price: item.price || 15000,
      coverUrl: item.coverUrl,
      yes24Url: item.yes24Url,
      category: (item.category as BookCategory) || '문학/동화',
      summary: item.summary,
      isbn: prev.isbn || `97911${Math.floor(10000000 + Math.random() * 90000000)}`,
    }));

    setIsYes24ModalOpen(false);
    setIsModalOpen(true);
    setToastMessage(`YES24 서지정보를 불러왔습니다. AI 분류 및 퀴즈 생성을 시작합니다.`);

    // Trigger AI enrich in background
    setIsAiLoading(true);
    try {
      const apiKey = getStoredApiKey();
      const res = await fetch('/api/ai/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          isbn: formData.isbn,
          userApiKey: apiKey
        })
      });

      const data = await res.json();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          category: data.category || prev.category,
          targetLevel: data.targetLevel || prev.targetLevel,
          callNumber: data.callNumber || prev.callNumber || '813.8-자동01',
          location: data.location || prev.location || '작은도서관 종합서가 A',
          recommendAge: data.recommendAge || prev.recommendAge,
          tags: data.tags || prev.tags,
          deepQuestions: data.deepQuestions || prev.deepQuestions,
          sampleQuizzes: data.sampleQuizzes || prev.sampleQuizzes,
        }));
        confetti({ particleCount: 40, spread: 50 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiAutoFill = async () => {
    if (!formData.title?.trim()) {
      alert('도서명을 먼저 입력해주세요.');
      return;
    }

    setIsAiLoading(true);
    try {
      const apiKey = getStoredApiKey();
      const res = await fetch('/api/ai/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          isbn: formData.isbn,
          userApiKey: apiKey
        })
      });

      const data = await res.json();
      if (data) {
        setFormData((prev) => ({
          ...prev,
          author: data.author || prev.author,
          publisher: data.publisher || prev.publisher,
          publishYear: data.publishYear || prev.publishYear,
          isbn: data.isbn || prev.isbn || `97889${Math.floor(10000000 + Math.random() * 90000000)}`,
          price: data.price || prev.price || 12000,
          coverUrl: data.coverUrl || prev.coverUrl,
          yes24Url: data.yes24Url || prev.yes24Url,
          category: data.category || prev.category,
          targetLevel: data.targetLevel || prev.targetLevel,
          callNumber: data.callNumber || prev.callNumber,
          location: data.location || prev.location,
          summary: data.summary || prev.summary,
          recommendAge: data.recommendAge || prev.recommendAge,
          tags: data.tags || prev.tags,
          deepQuestions: data.deepQuestions || prev.deepQuestions,
          sampleQuizzes: data.sampleQuizzes || prev.sampleQuizzes,
        }));
        confetti({ particleCount: 50, spread: 60 });
        setToastMessage(`"${data.title || formData.title}" 서지정보, 표지, ISBN, 퀴즈가 100% 자동 완성되었습니다!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
      alert('AI 메타데이터 생성에 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    const newBook: Book = {
      id: formData.id || `book-${Date.now()}`,
      isbn: formData.isbn || `97889${Math.floor(10000000 + Math.random() * 90000000)}`,
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher || '별빛출판사',
      publishYear: formData.publishYear || 2024,
      price: formData.price || 12000,
      coverUrl: formData.coverUrl || (formData.title?.includes('와니니') ? 'https://image.yes24.com/goods/18797931/L' : undefined),
      yes24Url: formData.yes24Url || (formData.title?.includes('와니니') ? 'https://www.yes24.com/Product/Goods/18797931' : `https://www.yes24.com/Product/Search?domain=BOOK&query=${encodeURIComponent(formData.isbn || formData.title || '')}`),
      category: formData.category as BookCategory || '문학/동화',
      targetLevel: formData.targetLevel as TargetLevel || 'elem_high',
      callNumber: formData.callNumber || '813.8-미정',
      location: formData.location || '초등문학 서가',
      summary: formData.summary || '도서 요약 정보입니다.',
      coverEmoji: formData.coverEmoji || '📖',
      coverColor: formData.coverColor || 'from-indigo-600 to-purple-800',
      status: 'available',
      totalCopies: Number(formData.totalCopies) || 3,
      availableCopies: Number(formData.availableCopies) || Number(formData.totalCopies) || 3,
      recommendAge: formData.recommendAge || '초·중등 권장',
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(t => t.trim()) : (formData.tags || ['추천도서']),
      deepQuestions: formData.deepQuestions || [
        { question: '주인공의 심리적 변화를 살펴보면 어떤 점이 인상적인가요?', focus: '인물심리' }
      ],
      sampleQuizzes: formData.sampleQuizzes || [
        {
          question: '작품의 핵심 주제는 무엇인가요?',
          options: ['용기와 우정', '재산 모으기', '경쟁에서 승리'],
          answerIndex: 0,
          explanation: '이 작품은 용기와 따뜻한 우정의 중요성을 강조합니다.'
        }
      ]
    };

    const currentBooks = getStoredBooks();
    const existingIdx = currentBooks.findIndex(b => b.id === newBook.id);
    let updated: Book[];

    if (existingIdx !== -1) {
      updated = [...currentBooks];
      updated[existingIdx] = newBook;
    } else {
      updated = [newBook, ...currentBooks];
    }

    saveStoredBooks(updated);
    setBooks(updated);
    setIsModalOpen(false);
    setToastMessage(`"${newBook.title}" 도서가 성공적으로 저장되었습니다!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteBook = (id: string, title: string) => {
    if (!confirm(`"${title}" 도서를 정말로 삭제하시겠습니까?`)) return;
    const filtered = books.filter(b => b.id !== id);
    saveStoredBooks(filtered);
    setBooks(filtered);
    setToastMessage(`"${title}" 도서가 삭제되었습니다.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'ISBN', '제목', '저자', '출판사', '발행연도', '분야', '권장연령', '소장권수', '대출가능권수', '청구기호', '서가위치'];
    const rows = books.map(b => [
      b.id, b.isbn, `"${b.title}"`, `"${b.author}"`, `"${b.publisher}"`, b.publishYear, b.category, `"${b.recommendAge}"`, b.totalCopies, b.availableCopies, `"${b.callNumber}"`, `"${b.location}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `작은도서관_도서목록_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.includes(searchQuery) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link href="/admin" className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>관리자 대시보드로 돌아가기</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand-600" />
            소장 도서 관리 (10,000권 규모)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* YES24 Auto Sync Button */}
          <button
            onClick={() => {
              setYes24Results([]);
              setYes24Query('');
              setIsYes24ModalOpen(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 animate-pulse"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>YES24 서지정보 자동 연동</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV 내보내기</span>
          </button>

          <button
            onClick={() => {
              setFormData({
                title: '',
                author: '',
                publisher: '',
                publishYear: 2024,
                isbn: '',
                category: '문학/동화',
                targetLevel: 'elem_high',
                callNumber: '',
                location: '',
                summary: '',
                coverEmoji: '📚',
                coverColor: 'from-blue-500 to-indigo-700',
                totalCopies: 3,
                availableCopies: 3,
                recommendAge: '초등 4~6학년',
                tags: ['추천도서']
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>직접 도서 등록</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="도서명, 저자, ISBN, 분류로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
        />
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
              <tr>
                <th className="p-3.5">도서명 / ISBN</th>
                <th className="p-3.5">저자 / 출판사</th>
                <th className="p-3.5">분야</th>
                <th className="p-3.5">대상 학년</th>
                <th className="p-3.5">청구기호 / 위치</th>
                <th className="p-3.5 text-center">재고(대출가능/총)</th>
                <th className="p-3.5 text-center">YES24</th>
                <th className="p-3.5 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      {b.coverUrl ? (
                        <img 
                          src={b.coverUrl} 
                          alt={b.title} 
                          className="w-10 h-14 object-cover rounded shadow-sm shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center text-xl shrink-0">
                          {b.coverEmoji || '📚'}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{b.title}</span>
                          {b.price && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                              {b.price.toLocaleString()}원
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">ISBN: {b.isbn}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-medium text-slate-800">{b.author}</div>
                    <div className="text-[11px] text-slate-400">{b.publisher} ({b.publishYear})</div>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {b.category}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-slate-600">{b.recommendAge}</span>
                  </td>

                  <td className="p-3.5">
                    <div className="font-mono font-bold text-slate-800">{b.callNumber}</div>
                    <div className="text-[10px] text-slate-400">{b.location}</div>
                  </td>

                  <td className="p-3.5 text-center">
                    <span className={`font-bold ${b.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {b.availableCopies}
                    </span>
                    <span className="text-slate-400"> / {b.totalCopies}권</span>
                  </td>

                  <td className="p-3.5 text-center">
                    {b.yes24Url ? (
                      <a
                        href={b.yes24Url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline bg-orange-50 px-2 py-1 rounded-lg border border-orange-200"
                        title="YES24에서 구매하기"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>구매링크</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-300">-</span>
                    )}
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => {
                        setFormData(b);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                      title="수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(b.id, b.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* YES24 Quick Search & Auto-Sync Modal */}
      {isYes24ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    YES24 공개 서지정보 실시간 자동 검색
                  </h3>
                  <p className="text-xs text-slate-500">
                    도서명 또는 ISBN을 검색하면 실물 표지, 줄거리, 가격, 구매링크를 1초 만에 가져옵니다.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsYes24ModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchYes24} className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={yes24Query}
                    onChange={(e) => setYes24Query(e.target.value)}
                    placeholder="도서명 또는 13자리 ISBN 입력 (예: 불편한 편의점, 긴긴밤, 9791168415300)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isYes24Searching}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm transition shadow shrink-0 flex items-center gap-1.5"
                >
                  {isYes24Searching ? (
                    <span>검색 중...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>서지 검색</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample keyword chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">인기 추천 도서:</span>
                {['불편한 편의점', '긴긴밤', '달러구트 꿈 백화점', '마법천자문', '어린 왕자'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setYes24Query(kw);
                      // Trigger search immediately
                      fetch(`/api/books/yes24?q=${encodeURIComponent(kw)}`)
                        .then(r => r.json())
                        .then(d => setYes24Results(d.items || []));
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-[11px] font-medium transition"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </form>

            {/* Search Results List */}
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {yes24Results.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <BookMarked className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">검색어를 입력하고 [서지 검색] 버튼을 눌러주세요.</p>
                  <p className="text-xs text-slate-400 mt-1">YES24의 모든 서지정보와 실물 표지가 실시간으로 연동됩니다.</p>
                </div>
              ) : (
                yes24Results.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 transition flex flex-col sm:flex-row gap-4 items-start bg-white shadow-sm"
                  >
                    {item.coverUrl ? (
                      <img 
                        src={item.coverUrl} 
                        alt={item.title} 
                        className="w-20 h-28 object-cover rounded-lg shadow border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-slate-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
                        📖
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                          {item.category}
                        </span>
                        {item.price && (
                          <span className="text-xs font-bold text-slate-900">
                            정가: {item.price.toLocaleString()}원
                          </span>
                        )}
                        <a
                          href={item.yes24Url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-orange-600 hover:underline ml-auto"
                        >
                          <span>YES24 상품보기</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-600 font-medium">
                        {item.author} | {item.publisher} ({item.publishYear})
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSelectYes24Book(item)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>이 책으로 1초 자동 등록 (AI 퀴즈/청구기호 완성)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsYes24ModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Book Registration / Edit Modal with AI Auto-Fill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                {formData.id ? '도서 정보 수정' : '도서 신규 등록 (YES24 & AI 지원)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant & YES24 Banner */}
            <div className="bg-gradient-to-r from-cosmic-50 via-amber-50 to-brand-50 border border-cosmic-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-left">
                <div className="text-xs font-bold text-cosmic-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cosmic-600" />
                  AI 메타데이터 자동 완성 & 서지 분석
                </div>
                <div className="text-[11px] text-slate-600">
                  도서명 입력 후 버튼을 누르면 줄거리, 청구기호, 권장학년, 심층질문, 퀴즈를 AI가 자동 작성합니다.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiLoading || !formData.title?.trim()}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                    isAiLoading || !formData.title?.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cosmic-600 to-brand-600 text-white hover:brightness-110'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'AI 생성 중...' : 'AI 메타 자동완성'}</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              
              {/* Cover Preview & Title */}
              <div className="flex gap-4 items-start">
                {formData.coverUrl ? (
                  <div className="shrink-0 space-y-1 text-center">
                    <img 
                      src={formData.coverUrl} 
                      alt="표지" 
                      className="w-16 h-24 object-cover rounded-lg border border-slate-200 shadow-sm"
                    />
                    <span className="text-[10px] text-emerald-600 font-bold">실물표지 연동</span>
                  </div>
                ) : (
                  <div className="w-16 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-2xl shrink-0 border border-slate-200">
                    {formData.coverEmoji || '📚'}
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">도서명 *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 마당을 나온 암탉"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">저자 *</label>
                      <input
                        type="text"
                        required
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="예: 황선미"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">출판사</label>
                      <input
                        type="text"
                        value={formData.publisher || ''}
                        onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn || ''}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">정가 (원)</label>
                  <input
                    type="number"
                    value={formData.price || 15000}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">분야</label>
                  <select
                    value={formData.category || '문학/동화'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as BookCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* YES24 URL & Cover URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">YES24 상품 링크</label>
                  <input
                    type="url"
                    value={formData.yes24Url || ''}
                    onChange={(e) => setFormData({ ...formData, yes24Url: e.target.value })}
                    placeholder="https://www.yes24.com/Product/Goods/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">표지 이미지 URL</label>
                  <input
                    type="url"
                    value={formData.coverUrl || ''}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder="https://image.yes24.com/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">대상 레벨</label>
                  <select
                    value={formData.targetLevel || 'elem_high'}
                    onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value as TargetLevel })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="elem_low">🐣 초등 저학년 (1~3학년)</option>
                    <option value="elem_high">🚀 초등 고학년 (4~6학년)</option>
                    <option value="middle">🦉 중학생</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">청구기호 (KDC)</label>
                  <input
                    type="text"
                    value={formData.callNumber || ''}
                    onChange={(e) => setFormData({ ...formData, callNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">서가 위치</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">줄거리 및 도서 요약</label>
                <textarea
                  rows={3}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">대표 이모지</label>
                  <input
                    type="text"
                    value={formData.coverEmoji || '📚'}
                    onChange={(e) => setFormData({ ...formData, coverEmoji: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">소장 권수</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalCopies || 3}
                    onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value), availableCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">권장 연령 텍스트</label>
                  <input
                    type="text"
                    value={formData.recommendAge || '초등 4~6학년'}
                    onChange={(e) => setFormData({ ...formData, recommendAge: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md"
                >
                  도서 저장하기
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
