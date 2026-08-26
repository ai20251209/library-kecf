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
  Upload
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

  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
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
        confetti({ particleCount: 40, spread: 50 });
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

        <div className="flex items-center space-x-2">
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
            <span>도서 신규 등록 (AI 지원)</span>
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
                <th className="p-3.5 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{b.coverEmoji}</span>
                      <div>
                        <div className="font-bold text-slate-900">{b.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">ISBN: {b.isbn}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div>{b.author}</div>
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

      {/* Book Registration / Edit Modal with AI Auto-Fill */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                {formData.id ? '도서 정보 수정' : '도서 신규 등록 (AI 어시스턴트 지원)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-cosmic-50 to-brand-50 border border-cosmic-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-left">
                <div className="text-xs font-bold text-cosmic-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cosmic-600" />
                  AI 도서 메타데이터 자동 완성
                </div>
                <div className="text-[11px] text-slate-600">
                  도서명만 입력하고 버튼을 누르면 줄거리, 청구기호, 권장학년, 심층질문, 퀴즈를 AI가 자동 작성합니다.
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiLoading || !formData.title?.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow ${
                  isAiLoading || !formData.title?.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cosmic-600 to-brand-600 text-white hover:brightness-110'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiLoading ? 'AI 생성 중...' : 'AI 자동 완성'}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">도서명 *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="예: 마당을 나온 암탉"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">출판사</label>
                  <input
                    type="text"
                    value={formData.publisher || ''}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

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
                  <label className="block font-semibold text-slate-700 mb-1">청구기호</label>
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
