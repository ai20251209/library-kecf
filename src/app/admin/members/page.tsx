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
  Plus,
  FileSpreadsheet,
  Edit3,
  Trash2,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getStoredMembers, saveStoredMembers } from '@/lib/db';
import { Member } from '@/lib/types';
import confetti from 'canvas-confetti';

const AVATAR_OPTIONS = ['🦊', '🐰', '🦁', '🐼', '🐨', '🦄', '🐱', '🐶', '🐯', '🦉'];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    grade: '초등 3학년',
    schoolName: '별빛초등학교',
    barcode: '',
    role: 'student',
    avatarEmoji: '🦊',
    readingPoints: 0,
    level: 1,
    totalBooksRead: 0,
    activeLoansCount: 0,
    maxLoans: 5,
    badges: []
  });

  const loadMembers = () => {
    setMembers(getStoredMembers());
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const generateNewBarcode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const prefix = formData.role === 'admin' ? 'LIB-ADMIN' : formData.role === 'teacher' ? 'TEA' : 'STU';
    return `${prefix}-${year}-${randomNum}`;
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      grade: '초등 4학년',
      schoolName: '별빛초등학교',
      barcode: generateNewBarcode(),
      role: 'student',
      avatarEmoji: '🦊',
      readingPoints: 0,
      level: 1,
      totalBooksRead: 0,
      activeLoansCount: 0,
      maxLoans: 5,
      badges: [
        { id: 'b-new', name: '새내기 독서가', icon: '🌱', description: '도서관 회원 가입 완료' }
      ]
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const newMember: Member = {
      id: formData.id || `mem-${Date.now()}`,
      barcode: formData.barcode || generateNewBarcode(),
      name: formData.name.trim(),
      birthDate: formData.birthDate || '0512',
      grade: formData.grade || '초등 4학년',
      schoolName: formData.schoolName || '별빛초등학교',
      role: formData.role || 'student',
      avatarEmoji: formData.avatarEmoji || '🦊',
      readingPoints: Number(formData.readingPoints) || 0,
      level: Number(formData.level) || 1,
      totalBooksRead: Number(formData.totalBooksRead) || 0,
      activeLoansCount: Number(formData.activeLoansCount) || 0,
      maxLoans: Number(formData.maxLoans) || 5,
      joinedAt: formData.joinedAt || new Date().toISOString().split('T')[0],
      badges: formData.badges || [
        { id: 'b-new', name: '새내기 독서가', icon: '🌱', description: '도서관 회원 가입 완료' }
      ]
    };

    const currentMembers = getStoredMembers();
    const existingIdx = currentMembers.findIndex(m => m.id === newMember.id);
    let updated: Member[];

    if (existingIdx !== -1) {
      updated = [...currentMembers];
      updated[existingIdx] = newMember;
    } else {
      updated = [newMember, ...currentMembers];
    }

    saveStoredMembers(updated);
    setMembers(updated);
    setIsModalOpen(false);

    confetti({ particleCount: 50, spread: 60 });
    setToastMessage(`"${newMember.name}" 회원이 성공적으로 등록/수정되었습니다!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (!confirm(`"${name}" 회원을 정말로 삭제하시겠습니까?`)) return;
    const filtered = members.filter(m => m.id !== id);
    saveStoredMembers(filtered);
    setMembers(filtered);
    setToastMessage(`"${name}" 회원이 삭제되었습니다.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = () => {
    const headers = ['ID', '바코드', '이름', '학교명', '학년/구분', '구분', '독서포인트', '레벨', '완독권수', '현재대출수', '최대대출한도', '가입일'];
    const rows = members.map(m => [
      m.id, `"${m.barcode}"`, `"${m.name}"`, `"${m.schoolName}"`, `"${m.grade}"`, m.role, m.readingPoints, m.level, m.totalBooksRead, m.activeLoansCount, m.maxLoans, m.joinedAt
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `작은도서관_회원명부_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.barcode.toLowerCase().includes(q) || m.schoolName.toLowerCase().includes(q);
    const matchGrade = gradeFilter === 'all' || (
      gradeFilter === 'student' ? m.role === 'student' :
      gradeFilter === 'teacher' ? m.role === 'teacher' :
      gradeFilter === 'general' ? m.role === 'general' : true
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
            회원 명부 관리 (학생 · 교사 · 일반/학부모)
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV 회원명부 내보내기</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>신규 회원 등록</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="회원 이름, 바코드번호, 소속/학교 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs self-start sm:self-auto flex-wrap gap-1">
          <span className="text-slate-400 font-medium">구분 필터:</span>
          <button
            onClick={() => setGradeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            전체 ({members.length}명)
          </button>
          <button
            onClick={() => setGradeFilter('student')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'student' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            학생
          </button>
          <button
            onClick={() => setGradeFilter('teacher')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'teacher' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            교사
          </button>
          <button
            onClick={() => setGradeFilter('general')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              gradeFilter === 'general' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            일반/학부모
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{m.avatarEmoji}</span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                  Lv.{m.level}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  {m.name}
                  {m.role === 'admin' && (
                    <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded">사서</span>
                  )}
                  {m.role === 'teacher' && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">교사</span>
                  )}
                  {m.role === 'general' && (
                    <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded">일반/학부모</span>
                  )}
                  {m.role === 'student' && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded">학생</span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">{m.schoolName} · {m.grade}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>생일: <strong className="text-slate-700">{m.birthDate || '0512'}</strong></span>
                  <span className="font-mono">{m.barcode}</span>
                </div>
              </div>
            </div>

            <div>
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
                  <strong className={m.activeLoansCount > 0 ? 'text-brand-600 font-bold' : 'text-slate-400'}>
                    {m.activeLoansCount} / {m.maxLoans}권
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-1">
                <button
                  onClick={() => {
                    setFormData(m);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                  title="회원 정보 수정"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(m.id, m.name)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="회원 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Registration / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                {formData.id ? '회원 정보 수정' : '신규 회원 등록'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              
              {/* Avatar Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">대표 캐릭터 (아바타)</label>
                <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarEmoji: emoji })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition ${
                        formData.avatarEmoji === emoji
                          ? 'bg-white shadow-md border-2 border-purple-500 scale-110'
                          : 'hover:bg-slate-200/60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">회원 이름 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 김민우"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">회원 구분</label>
                  <select
                    value={formData.role || 'student'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="student">학생 (초등/중등)</option>
                    <option value="teacher">교사 / 선생님</option>
                    <option value="general">일반회원 (학부모/지역주민)</option>
                    <option value="admin">사서 관리자</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">소속 / 학교명</label>
                  <input
                    type="text"
                    value={formData.schoolName || ''}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="예: 별빛초등학교 또는 별빛마을주민"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">학년 / 회원 분류</label>
                  <select
                    value={formData.grade || '초등 4학년'}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="초등 1학년">초등 1학년</option>
                    <option value="초등 2학년">초등 2학년</option>
                    <option value="초등 3학년">초등 3학년</option>
                    <option value="초등 4학년">초등 4학년</option>
                    <option value="초등 5학년">초등 5학년</option>
                    <option value="초등 6학년">초등 6학년</option>
                    <option value="중학교 1학년">중학교 1학년</option>
                    <option value="중학교 2학년">중학교 2학년</option>
                    <option value="중학교 3학년">중학교 3학년</option>
                    <option value="교사">교사</option>
                    <option value="학부모">학부모</option>
                    <option value="지역주민(일반)">지역주민 (일반)</option>
                    <option value="작은도서관 사서">작은도서관 사서</option>
                  </select>
                </div>
              </div>

              {/* Barcode, BirthDate & Max Loans */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">회원 바코드 *</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, barcode: generateNewBarcode() })}
                      className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-3 h-3" /> 자동 생성
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.barcode || ''}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="STU-2026-0001"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">생년월일 4자리 (비밀번호) *</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={formData.birthDate || '0512'}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    placeholder="예: 0512 (5월12일)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">최대 대출 한도 (권)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.maxLoans || 5}
                    onChange={(e) => setFormData({ ...formData, maxLoans: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md"
                >
                  회원 저장하기
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
