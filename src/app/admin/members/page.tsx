'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  Barcode, 
  CheckCircle2, 
  Trophy,
  Filter,
  Plus
} from 'lucide-react';
import { getStoredMembers, saveStoredMembers } from '@/lib/db';
import { Member } from '@/lib/types';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');

  useEffect(() => {
    setMembers(getStoredMembers());
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.barcode.toLowerCase().includes(q) || m.schoolName.toLowerCase().includes(q);
    const matchGrade = gradeFilter === 'all' || (
      gradeFilter === 'elem' ? m.grade.includes('초등') :
      gradeFilter === 'middle' ? m.grade.includes('중학') : true
    );
    return matchSearch && matchGrade;
  });

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
            <Users className="w-7 h-7 text-purple-600" />
            회원 명부 관리 (3,000명 규모)
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            총 등록 회원: <strong className="text-slate-900">3,000명</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="회원 이름, 바코드번호, 학교명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs self-start sm:self-auto">
          <span className="text-slate-400">구분:</span>
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setGradeFilter('elem')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'elem' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            초등학생 (65%)
          </button>
          <button
            onClick={() => setGradeFilter('middle')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'middle' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            중학생 (35%)
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{m.avatarEmoji}</span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  Lv.{m.level}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  {m.name}
                  {m.role === 'admin' && (
                    <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded">사서</span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">{m.schoolName} · {m.grade}</p>
                <p className="font-mono text-[11px] text-slate-400 mt-1">코드: {m.barcode}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>완독 권수:</span>
                <strong className="text-slate-900">{m.totalBooksRead}권</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>독서 포인트:</span>
                <strong className="text-amber-600">{m.readingPoints} P</strong>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>현재 대출중:</span>
                <strong className={m.activeLoansCount > 0 ? 'text-brand-600' : 'text-slate-400'}>
                  {m.activeLoansCount} / {m.maxLoans}권
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
