'use client';

import React, { useState } from 'react';
import { 
  User, 
  KeyRound, 
  Barcode, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  Calendar,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { getStoredMembers, setCurrentUser, getCurrentUser } from '@/lib/db';
import { Member } from '@/lib/types';
import confetti from 'canvas-confetti';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (member: Member) => void;
}

export default function StudentLoginModal({ isOpen, onClose, onLoginSuccess }: StudentLoginModalProps) {
  const [tab, setTab] = useState<'easy' | 'barcode'>('easy');
  const [memberName, setMemberName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const members = getStoredMembers();
  const currentUser = getCurrentUser();

  const handleEasyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameTrimmed = memberName.trim();
    const birthTrimmed = birthDate.trim();

    if (!nameTrimmed || !birthTrimmed) {
      setErrorMessage('이름과 생년월일 4자리를 모두 입력해주세요.');
      return;
    }

    // Find member by name and birthDate
    const matched = members.find(
      (m) => m.name.toLowerCase() === nameTrimmed.toLowerCase() && (m.birthDate === birthTrimmed || m.barcode.endsWith(birthTrimmed))
    );

    if (matched) {
      setCurrentUser(matched);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(matched);
      onClose();
    } else {
      setErrorMessage(`등록된 회원 정보를 찾을 수 없습니다.\n이름(${nameTrimmed})과 생년월일 4자리(${birthTrimmed})를 다시 확인해주세요.`);
    }
  };

  const handleBarcodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const code = barcodeInput.trim();
    if (!code) {
      setErrorMessage('회원 바코드 번호를 입력해주세요.');
      return;
    }

    const matched = members.find(
      (m) => m.barcode.toLowerCase() === code.toLowerCase() || m.id === code
    );

    if (matched) {
      setCurrentUser(matched);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(matched);
      onClose();
    } else {
      setErrorMessage(`바코드 번호 "${code}"에 해당하는 회원을 찾을 수 없습니다.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-purple-600 to-cosmic-600 flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">도서관 회원 로그인</h3>
              <p className="text-xs text-slate-500">학생 · 교사 · 학부모/일반회원 통합 로그인</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Type Badges Pill */}
        <div className="flex items-center justify-around bg-slate-50 p-2 rounded-2xl border border-slate-100 text-xs">
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span>🐣</span> 학생
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-semibold text-blue-700">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> 교사
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 font-semibold text-purple-700">
            <HeartHandshake className="w-3.5 h-3.5 text-purple-600" /> 일반/학부모
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => { setTab('easy'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'easy' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>이름 + 생년월일 간편 로그인</span>
          </button>

          <button
            onClick={() => { setTab('barcode'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'barcode' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Barcode className="w-4 h-4" />
            <span>회원 바코드 로그인</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 whitespace-pre-line animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Easy Login (Name + BirthDate 4 digits) */}
        {tab === 'easy' && (
          <form onSubmit={handleEasyLogin} className="space-y-4">
            <div className="bg-brand-50/70 border border-brand-200/80 p-3 rounded-2xl text-xs text-brand-900 leading-snug">
              💡 본인 <strong>이름</strong>과 <strong>생년월일 4자리(예: 8월 1일생이면 0801)</strong>만 입력하시면 본인 전용 독서통장으로 즉시 로그인됩니다.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">회원 이름 (성명)</label>
                <input
                  type="text"
                  required
                  placeholder="예: 김수진 (교사) 또는 김하늘 (학생)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">생년월일 4자리 (비밀번호 MMDD)</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="예: 0801 (8월 1일)"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-2xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>내 독서공간 로그인</span>
            </button>
          </form>
        )}

        {/* Tab 2: Barcode Login */}
        {tab === 'barcode' && (
          <form onSubmit={handleBarcodeLogin} className="space-y-4">
            <div className="bg-purple-50/70 border border-purple-200/80 p-3 rounded-2xl text-xs text-purple-900 leading-snug">
              📷 도서관 실물 회원증이나 모바일 바코드 번호(예: <code>TEA-2026-0801</code>, <code>STU-2026-0101</code>)를 입력해주세요.
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">회원 바코드 번호</label>
              <input
                type="text"
                required
                placeholder="TEA-2026-0801 또는 STU-2026-0101"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>바코드로 로그인</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
