'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  ArrowRightLeft, 
  Sparkles, 
  Barcode, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  FileSpreadsheet,
  Cpu,
  Search,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { getStoredBooks, getStoredMembers, getStoredLoans, borrowBook, returnBook } from '@/lib/db';
import { Book, Member, LoanRecord } from '@/lib/types';
import confetti from 'canvas-confetti';

export default function AdminDashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>([]);

  // Fast Terminal State
  const [memberInput, setMemberInput] = useState('');
  const [bookInput, setBookInput] = useState('');
  const [terminalType, setTerminalType] = useState<'borrow' | 'return'>('borrow');
  const [terminalStatus, setTerminalStatus] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = () => {
    setBooks(getStoredBooks());
    setMembers(getStoredMembers());
    setLoans(getStoredLoans());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Terminal Process
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTerminalStatus(null);

    if (terminalType === 'borrow') {
      if (!memberInput || !bookInput) {
        setTerminalStatus({ success: false, message: '회원 바코드와 도서 ISBN/ID를 모두 입력해주세요.' });
        return;
      }

      // Find member by barcode or name or id
      const member = members.find(
        (m) => m.barcode.toLowerCase() === memberInput.toLowerCase() || m.id === memberInput || m.name.includes(memberInput)
      );
      if (!member) {
        setTerminalStatus({ success: false, message: `회원을 찾을 수 없습니다: "${memberInput}"` });
        return;
      }

      // Find book by ISBN or ID or Title
      const book = books.find(
        (b) => b.isbn === bookInput || b.id === bookInput || b.title.toLowerCase().includes(bookInput.toLowerCase())
      );
      if (!book) {
        setTerminalStatus({ success: false, message: `도서를 찾을 수 없습니다: "${bookInput}"` });
        return;
      }

      const res = borrowBook(book.id, member.id);
      setTerminalStatus(res);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setBookInput('');
        loadData();
      }
    } else {
      // Return process
      if (!bookInput) {
        setTerminalStatus({ success: false, message: '반납할 도서의 ISBN 또는 도서명을 입력해주세요.' });
        return;
      }

      // Find active loan for this book
      const book = books.find(
        (b) => b.isbn === bookInput || b.id === bookInput || b.title.toLowerCase().includes(bookInput.toLowerCase())
      );

      if (!book) {
        setTerminalStatus({ success: false, message: `도서를 찾을 수 없습니다: "${bookInput}"` });
        return;
      }

      const activeLoan = loans.find((l) => l.bookId === book.id && l.status === 'active');
      if (!activeLoan) {
        setTerminalStatus({ success: false, message: `"${book.title}" 도서는 현재 대출 중이 아닙니다.` });
        return;
      }

      const res = returnBook(activeLoan.id);
      setTerminalStatus(res);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setBookInput('');
        loadData();
      }
    }
  };

  const activeLoansCount = loans.filter((l) => l.status === 'active').length;
  const totalBooksStock = books.reduce((acc, b) => acc + b.totalCopies, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-900 text-white shadow-md">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              작은도서관 사서 관리자 LMS
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            소장 도서 10,000권 및 회원 3,000명 규모의 초고속 바코드 대출/반납 & AI 메타데이터 관제 시스템
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>도서관 맞춤 설정 & AI 키</span>
          </Link>
          <Link
            href="/admin/books"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>도서 관리 (YES24 연동)</span>
          </Link>
          <Link
            href="/admin/members"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>회원 관리</span>
          </Link>
        </div>
      </div>

      {/* 1. Statistics Cards (10,000 Books & 3,000 Members scale) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>총 소장 도서</span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {books.length.toLocaleString()} <span className="text-xs font-normal text-slate-400">종 ({totalBooksStock}권)</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">● 10,000권 확장 지원</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>등록 회원 수</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            3,000 <span className="text-xs font-normal text-slate-400">명</span>
          </div>
          <div className="text-[11px] text-purple-600 font-medium">초등 65% · 중등 35%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>현재 대출 중</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {activeLoansCount} <span className="text-xs font-normal text-slate-400">권</span>
          </div>
          <div className="text-[11px] text-slate-500">대출 회전율 94.2%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>AI 질의응답 건수</span>
            <Sparkles className="w-4 h-4 text-cosmic-600" />
          </div>
          <div className="text-2xl font-black text-cosmic-600 font-mono">
            1,248 <span className="text-xs font-normal text-slate-400">회</span>
          </div>
          <div className="text-[11px] text-cosmic-600 font-medium">AI 퀴즈 완료율 88%</div>
        </div>

      </div>

      {/* 2. Fast 1-Second Barcode Check-in / Check-out Terminal */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center">
              <Barcode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">현장 1초 바코드 대출/반납 터미널</h2>
              <p className="text-xs text-slate-400">사서 바코드 스캐너 또는 키보드 입력을 통해 즉시 처리됩니다.</p>
            </div>
          </div>

          {/* Terminal Mode Switch */}
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setTerminalType('borrow'); setTerminalStatus(null); }}
              className={`px-4 py-1.5 rounded-lg transition ${
                terminalType === 'borrow' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              대출 처리 (Check-out)
            </button>
            <button
              onClick={() => { setTerminalType('return'); setTerminalStatus(null); }}
              className={`px-4 py-1.5 rounded-lg transition ${
                terminalType === 'return' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              반납 처리 (Check-in)
            </button>
          </div>
        </div>

        {/* Terminal Input Form */}
        <form onSubmit={handleTerminalSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {terminalType === 'borrow' && (
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                회원 바코드 / 이름 (예: STU-2026-0101 또는 김하늘)
              </label>
              <input
                type="text"
                placeholder="STU-2026-0101"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          )}

          <div className={terminalType === 'borrow' ? "sm:col-span-5" : "sm:col-span-10"}>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              도서 ISBN / 도서명 (예: 9788936445585 또는 아몬드)
            </label>
            <input
              type="text"
              placeholder="9788936445585 또는 마당을 나온 암탉"
              value={bookInput}
              onChange={(e) => setBookInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 sm:self-end">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-lg ${
                terminalType === 'borrow'
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-brand-600/20'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
              }`}
            >
              {terminalType === 'borrow' ? '대출 승인' : '반납 승인'}
            </button>
          </div>

        </form>

        {/* Terminal Status Response */}
        {terminalStatus && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
            terminalStatus.success ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'
          }`}>
            {terminalStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{terminalStatus.message}</span>
          </div>
        )}

      </div>

      {/* 3. Recent Loans Feed & Quick Admin Action Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">실시간 대출/반납 현황</h3>
            <span className="text-xs text-slate-400">최근 {loans.length}건 기록</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {loans.map((loan) => (
              <div key={loan.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{loan.bookTitle}</div>
                  <div className="text-slate-500 text-[11px]">
                    대출자: {loan.memberName} ({loan.memberBarcode}) · {loan.borrowedAt}
                  </div>
                </div>

                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    loan.status === 'active' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {loan.status === 'active' ? `대출중 (~${loan.dueDate})` : '반납완료'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Toolkit */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">사서 스마트 툴킷</h3>
            <p className="text-xs text-slate-500 mt-1">
              AI를 활용해 도서 메타데이터를 3초 만에 생성하고 엑셀로 일괄 관리하세요.
            </p>

            <div className="space-y-2 mt-4">
              <Link
                href="/admin/books"
                className="p-3 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-slate-800">AI 도서 자동 등록 어시스턴트</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-brand-600">→</span>
              </Link>

              <Link
                href="/admin/books"
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">10,000권 도서 엑셀/CSV 일괄 업로드</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-emerald-600">→</span>
              </Link>

              <Link
                href="/admin/members"
                className="p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 flex items-center justify-between transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">3,000명 회원 명부 및 다독왕 통계</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-purple-600">→</span>
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            운영 인프라: Vercel Serverless + Supabase PostgreSQL
          </div>
        </div>

      </div>

    </div>
  );
}
