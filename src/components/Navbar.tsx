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
  Layers,
  Home,
  PlusCircle,
  Bookmark,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getStoredMembers, 
  getStoredApiKey, 
  saveStoredApiKey,
  getStoredLibraryConfig,
  saveStoredLibraryConfig
} from '@/lib/db';
import { Member, LibraryConfig } from '@/lib/types';
import StudentLoginModal from '@/components/StudentLoginModal';

export default function Navbar() {
  const pathname = usePathname();
  const [currentUser, setUserState] = useState<Member | null>(null);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
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

  const handleToggleMode = (newMode: 'public_library' | 'personal_library') => {
    if (!libConfig) return;
    const updated: LibraryConfig = {
      ...libConfig,
      appMode: newMode,
      libraryName: newMode === 'personal_library' 
        ? `${currentUser?.name || '독서가'}의 나만의 AI 서재` 
        : '별빛 북스페이스 작은도서관',
      subTitle: newMode === 'personal_library'
        ? '나만을 위한 1인 AI 도서관 & 독서 연구소'
        : '초·중학생을 위한 AI 독서 메이트 & 스마트 작은도서관',
    };
    saveStoredLibraryConfig(updated);
    setLibConfig(updated);
    setIsModeModalOpen(false);
    window.location.reload();
  };

  const isPersonalMode = libConfig?.appMode === 'personal_library';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                  isPersonalMode 
                    ? 'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-amber-500/20' 
                    : 'bg-gradient-to-tr from-brand-600 to-cosmic-500 shadow-brand-500/20'
                }`}>
                  {isPersonalMode ? '🛋️' : <BookOpen className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-xl font-black bg-gradient-to-r from-slate-900 via-brand-800 to-indigo-900 bg-clip-text text-transparent">
                    {libConfig?.libraryName || (isPersonalMode ? '나만의 AI 서재' : '별빛 북스페이스')}
                  </span>
                  <span className={`hidden sm:inline-block ml-2 text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    isPersonalMode 
                      ? 'bg-amber-50 text-amber-800 border-amber-300' 
                      : 'bg-brand-50 text-brand-700 border-brand-200'
                  }`}>
                    {isPersonalMode ? '🛋️ 1인 나만의 서재' : '🏛️ AI 작은도서관'}
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
                <span>{isPersonalMode ? '내 서재 도서들' : '도서 탐색'}</span>
              </Link>

              {isPersonalMode ? (
                <Link
                  href="/admin/books"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith('/admin/books')
                      ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200'
                      : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  <span>+ 내 책 등록 (YES24 연동)</span>
                </Link>
              ) : (
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
              )}

              <Link
                href="/my-library"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/my-library')
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                <span>{isPersonalMode ? '독서장 & AI 생각노트' : '내 독서 통장'}</span>
              </Link>

              {/* Admin Menu */}
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="관리자 설정 & 도서관 운영"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>{isPersonalMode ? '서재 관리' : '사서 LMS'}</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-mono">🔒</span>
              </Link>
            </nav>

            {/* Right Actions (Mode Switcher + API Key + Profile) */}
            <div className="flex items-center space-x-2">
              
              {/* Mode Switcher Button */}
              <button
                onClick={() => setIsModeModalOpen(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border ${
                  isPersonalMode
                    ? 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                }`}
                title="작은도서관 운영 모드 ⇄ 1인 나만의 서재 모드 전환"
              >
                <span>{isPersonalMode ? '🛋️ 1인 서재 모드' : '🏛️ 도서관 모드'}</span>
                <span className="text-[10px] opacity-75">전환</span>
              </button>

              {/* API Key Modal Button */}
              <button
                onClick={() => setIsApiModalOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg text-xs flex items-center space-x-1 transition"
                title="Google AI Studio Gemini 키 설정"
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline text-slate-600">AI 설정</span>
              </button>

              {/* Current User Profile */}
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
            <span>{isPersonalMode ? '내서재' : '도서탐색'}</span>
          </Link>
          <Link href="/my-library" className={`flex flex-col items-center py-1 ${pathname.startsWith('/my-library') ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
            <BookmarkCheck className="w-4 h-4" />
            <span>{isPersonalMode ? '생각노트' : '독서통장'}</span>
          </Link>
          <Link href="/admin/books" className={`flex flex-col items-center py-1 ${pathname.startsWith('/admin/books') ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
            <PlusCircle className="w-4 h-4" />
            <span>+도서등록</span>
          </Link>
          <Link href="/admin" className={`flex flex-col items-center py-1 ${pathname.startsWith('/admin') ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>{isPersonalMode ? '서재설정' : '사서LMS'}</span>
          </Link>
        </div>
      </header>

      {/* Mode Switcher Modal */}
      {isModeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>🔄 도서관 운영 모드 선택</span>
              </h3>
              <button onClick={() => setIsModeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              노트북 1대로 작은도서관을 운영하시나요, 아니면 개인 노트북에 나만의 1인 서재를 구축하시나요? 목적에 맞게 인터페이스를 즉시 전환할 수 있습니다.
            </p>

            <div className="grid grid-cols-1 gap-3 text-left">
              
              {/* Mode 1: Public Small Library */}
              <button
                type="button"
                onClick={() => handleToggleMode('public_library')}
                className={`p-4 rounded-2xl border-2 transition text-left space-y-1.5 ${
                  !isPersonalMode
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>🏛️</span>
                    <span>작은도서관 운영 모드</span>
                  </span>
                  {!isPersonalMode && <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">현재 적용 중</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  마을/학교/아파트 작은도서관용. 다수 회원 관리, 대출/반납 카운터, 바코드 회원증, 장서 점검 기능 활성화.
                </p>
              </button>

              {/* Mode 2: Personal 1-Person Library */}
              <button
                type="button"
                onClick={() => handleToggleMode('personal_library')}
                className={`p-4 rounded-2xl border-2 transition text-left space-y-1.5 ${
                  isPersonalMode
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>🛋️</span>
                    <span>1인 나만의 AI 서재 모드</span>
                  </span>
                  {isPersonalMode && <span className="text-xs font-bold text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full">현재 적용 중</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  개인 노트북/서재용. 내가 소장한 책·읽고 싶은 책 YES24 원클릭 등록, 1:1 AI 독서 코치 및 심층 대화 스크랩 집중.
                </p>
              </button>

            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

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
