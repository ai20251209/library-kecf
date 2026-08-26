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
import { 
  getCurrentUser, 
  setCurrentUser, 
  getStoredMembers, 
  getStoredApiKey, 
  saveStoredApiKey,
  getStoredLibraryConfig
} from '@/lib/db';
import { Member, LibraryConfig } from '@/lib/types';
import StudentLoginModal from '@/components/StudentLoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setUserState] = useState<Member | null>(null);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [libConfig, setLibConfig] = useState<LibraryConfig | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setUserState(user);
    setMembersList(getStoredMembers());
    setApiKeyInput(getStoredApiKey());
    setLibConfig(getStoredLibraryConfig());
  }, [pathname]);

  const handleSaveApiKey = () => {
    saveStoredApiKey(apiKeyInput.trim());
    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setIsApiModalOpen(false);
    }, 1200);
  };

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
                    {libConfig?.libraryName || '별빛 북스페이스'}
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

              {/* Admin Menu with Lock indicator */}
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="사서 관리자 LMS (비밀번호 잠금)"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>사서 LMS</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono">🔒</span>
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
            <span>사서LMS 🔒</span>
          </Link>
        </div>
      </header>

      {/* Student Login & Profile Modal */}
      <StudentLoginModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onLoginSuccess={(m) => {
          setUserState(m);
        }}
      />

      {/* Gemini API Key Modal */}
      {isApiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Google AI Studio API Key 설정
              </h3>
              <button onClick={() => setIsApiModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Google AI Studio에서 무료로 발급받은 Gemini API 키를 입력하시면 우리 도서관 전용 실시간 AI 토론 및 메타데이터 자동 작성이 즉시 활성화됩니다.
            </p>

            <div className="space-y-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>입력한 키는 브라우저 로컬 저장소에만 안전하게 보관됩니다.</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline font-medium"
                >
                  무료 키 발급 ↗
                </a>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsApiModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition flex items-center gap-1.5"
              >
                {apiKeySaved ? <Check className="w-4 h-4" /> : null}
                <span>{apiKeySaved ? '저장 완료!' : '키 저장하기'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
