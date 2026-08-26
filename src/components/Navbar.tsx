'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Sparkles, 
  User, 
  Settings, 
  ShieldCheck, 
  BookmarkCheck, 
  Compass, 
  Key, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { getCurrentUser, setCurrentUser, getStoredMembers, getStoredApiKey, saveStoredApiKey } from '@/lib/db';
import { Member } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setUserState] = useState<Member | null>(null);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setUserState(user);
    setMembersList(getStoredMembers());
    setApiKeyInput(getStoredApiKey());
  }, [pathname]);

  const handleSelectUser = (m: Member) => {
    setCurrentUser(m);
    setUserState(m);
    setIsUserModalOpen(false);
    window.location.reload();
  };

  const handleSaveApiKey = () => {
    saveStoredApiKey(apiKeyInput.trim());
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setIsApiModalOpen(false);
    }, 1200);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cosmic-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-brand-700 via-cosmic-600 to-indigo-600 bg-clip-text text-transparent">
                    별빛 북스페이스
                  </span>
                  <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium border border-brand-200">
                    AI 작은도서관
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/books"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/books')
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>도서 탐색</span>
              </Link>

              <Link
                href="/ai-lounge"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/ai-lounge')
                    ? 'bg-cosmic-50 text-cosmic-700 font-semibold'
                    : 'text-slate-600 hover:text-cosmic-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cosmic-500" />
                <span>AI 독서 라운지</span>
              </Link>

              <Link
                href="/my-library"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/my-library')
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                <span>내 독서 통장</span>
              </Link>

              {/* Admin Menu */}
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>관리자(사서) LMS</span>
              </Link>
            </nav>

            {/* Right Actions (API key + User Switcher) */}
            <div className="flex items-center space-x-2">
              
              {/* API Key Modal Button */}
              <button
                onClick={() => setIsApiModalOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg text-xs flex items-center space-x-1 transition"
                title="Gemini AI API Key 설정"
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline text-slate-600">AI 설정</span>
              </button>

              {/* Current User Switcher Button */}
              {currentUser && (
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs transition border border-slate-200"
                >
                  <span className="text-base">{currentUser.avatarEmoji}</span>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-none">
                      {currentUser.grade}
                    </div>
                  </div>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-200 bg-white text-xs">
          <Link href="/books" className={`flex flex-col items-center py-1 ${pathname.startsWith('/books') ? 'text-brand-600 font-bold' : 'text-slate-600'}`}>
            <Compass className="w-4 h-4" />
            <span>도서탐색</span>
          </Link>
          <Link href="/ai-lounge" className={`flex flex-col items-center py-1 ${pathname.startsWith('/ai-lounge') ? 'text-cosmic-600 font-bold' : 'text-slate-600'}`}>
            <Sparkles className="w-4 h-4" />
            <span>AI라운지</span>
          </Link>
          <Link href="/my-library" className={`flex flex-col items-center py-1 ${pathname.startsWith('/my-library') ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
            <BookmarkCheck className="w-4 h-4" />
            <span>독서통장</span>
          </Link>
          <Link href="/admin" className={`flex flex-col items-center py-1 ${pathname.startsWith('/admin') ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>사서LMS</span>
          </Link>
        </div>
      </header>

      {/* User Switcher Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                사용자 전환 (체험 모드)
              </h3>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 my-3">
              초등 저학년, 고학년, 중학생 및 사서 선생님 계정으로 즉시 전환하여 맞춤형 화면을 체험해보세요.
            </p>

            <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
              {membersList.map((m) => {
                const isSelected = currentUser?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectUser(m)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{m.avatarEmoji}</span>
                      <div>
                        <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                          {m.name}
                          {m.role === 'admin' && (
                            <span className="text-[10px] bg-slate-800 text-white px-1.5 py-0.5 rounded font-normal">
                              사서
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.schoolName} · {m.grade} (바코드: {m.barcode})
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-brand-600 font-bold">Lv.{m.level}</div>
                      <div className="text-[11px] text-slate-400">{m.totalBooksRead}권 완독</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gemini API Key Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                Google Gemini API Key 설정
              </h3>
              <button 
                onClick={() => setIsApiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 text-xs text-slate-600 space-y-2">
              <p>
                💡 <strong>API 키 없이도 스마트 시뮬레이션 엔진이 즉시 작동</strong>하여 모든 AI 대화와 퀴즈를 체험할 수 있습니다.
              </p>
              <p>
                실제 Google Gemini 1.5 Flash 모델의 실시간 생성 답변을 원하시면 아래에 API Key를 입력하세요 (브라우저 로컬스토리지에만 안전하게 저장됩니다).
              </p>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gemini API Key (AI Studio 발급키)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setApiKeyInput('');
                  saveStoredApiKey('');
                  setIsApiModalOpen(false);
                }}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                키 초기화
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-md hover:from-amber-600 hover:to-orange-600 flex items-center gap-1.5"
              >
                {apiKeySaved ? <Check className="w-4 h-4" /> : null}
                {apiKeySaved ? '저장 완료!' : '저장하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
