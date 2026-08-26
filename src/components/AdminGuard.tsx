'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { isAdminAuthenticated, loginAdmin, logoutAdmin, setAdminPin, getAdminPin } from '@/lib/auth';
import confetti from 'canvas-confetti';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setIsAuthenticated(true);
      setErrorMessage(null);
      confetti({ particleCount: 50, spread: 60 });
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      alert('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    setAdminPin(newPinInput.trim());
    setPinChangeSuccess(true);
    setTimeout(() => {
      setPinChangeSuccess(false);
      setIsChangingPin(false);
      setNewPinInput('');
    }, 1500);
  };

  // While checking auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-xs">
        보안 인증 확인 중...
      </div>
    );
  }

  // Not authenticated: Show PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-6 animate-fade-in">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/30">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              사서 전용 관리자 인증
            </h2>
            <p className="text-xs text-slate-500">
              작은도서관 LMS 관제 시스템에 접근하려면 사서 비밀번호(PIN)를 입력하세요.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                placeholder="비밀번호 입력 (기본: 1234)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMessage(null);
                }}
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3.5 px-4 bg-slate-50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>관리자 모드 접속</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800 flex items-center gap-1 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>학생 화면으로 돌아가기</span>
            </Link>
            <span className="text-[11px] text-slate-400">초기 기본 암호: 1234</span>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated: Render children with admin control bar
  return (
    <div>
      {/* Admin Top Status Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-emerald-400">사서 관리자 인증 완료</span>
          <span className="hidden sm:inline text-slate-400">| 도서관 관제 모드 작동 중</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>비밀번호 변경</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-slate-800 transition flex items-center gap-1 font-bold"
          >
            <LogOut className="w-3 h-3" />
            <span>관리자 잠금 (로그아웃)</span>
          </button>
        </div>
      </div>

      {/* Change PIN Dropdown Banner */}
      {isChangingPin && (
        <div className="bg-slate-800 text-white p-4 border-b border-slate-700 animate-fade-in">
          <form onSubmit={handleChangePinSubmit} className="max-w-md mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder="새 비밀번호 입력 (4자리 이상)"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shrink-0"
            >
              {pinChangeSuccess ? '변경 완료!' : '변경 저장'}
            </button>
            <button
              type="button"
              onClick={() => setIsChangingPin(false)}
              className="px-2 py-1.5 text-slate-400 hover:text-white text-xs"
            >
              취소
            </button>
          </form>
        </div>
      )}

      {children}
    </div>
  );
}
