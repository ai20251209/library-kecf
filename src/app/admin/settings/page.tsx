'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Sparkles, 
  Key, 
  Building2, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Upload, 
  ExternalLink,
  ShoppingCart,
  Zap,
  HelpCircle
} from 'lucide-react';
import { 
  getStoredLibraryConfig, 
  saveStoredLibraryConfig, 
  getStoredApiKey, 
  saveStoredApiKey,
  getStoredBooks,
  saveStoredBooks,
  getStoredMembers,
  saveStoredMembers,
  getStoredLoans,
  saveStoredLoans,
  getStoredReadingLogs,
  saveStoredReadingLogs
} from '@/lib/db';
import { LibraryConfig } from '@/lib/types';
import confetti from 'canvas-confetti';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<LibraryConfig>({
    libraryName: '별빛 북스페이스 작은도서관',
    subTitle: '초·중학생을 위한 AI 독서 메이트 & 스마트 작은도서관',
    contactPhone: '02-1234-5678',
    location: '마을 커뮤니티 센터 2층',
    adminPin: '1234',
    enableYes24Sync: true,
  });

  const [apiKey, setApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedConfig = getStoredLibraryConfig();
    setConfig(loadedConfig);
    const loadedKey = getStoredApiKey();
    setApiKey(loadedKey);
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredLibraryConfig(config);
    saveStoredApiKey(apiKey);
    confetti({ particleCount: 50, spread: 60 });
    setToastMessage('도서관 설정이 성공적으로 저장되었습니다!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      alert('테스트할 Gemini API Key를 입력해주세요.');
      return;
    }

    setIsTestingKey(true);
    setKeyTestStatus(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: '안녕! 너는 누구니?' }],
          userApiKey: apiKey.trim(),
          systemPersona: 'elementary_low'
        })
      });

      if (res.ok) {
        setKeyTestStatus({
          success: true,
          message: '🎉 Google Gemini API 키가 정상적으로 연결되었습니다! (초고속 AI 독서 메이트 및 YES24 메타데이터 활성화)'
        });
        confetti({ particleCount: 60, spread: 70 });
      } else {
        const errorData = await res.json();
        setKeyTestStatus({
          success: false,
          message: `API 키 검증 실패: ${errorData.error || '유효하지 않은 API 키입니다.'}`
        });
      }
    } catch (e: any) {
      setKeyTestStatus({
        success: false,
        message: `통신 오류: ${e.message || 'API 호출에 실패했습니다.'}`
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  // Full Backup (JSON)
  const handleExportBackup = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config: getStoredLibraryConfig(),
      books: getStoredBooks(),
      members: getStoredMembers(),
      loans: getStoredLoans(),
      readingLogs: getStoredReadingLogs(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.libraryName.replace(/\s+/g, '_')}_전체데이터백업_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Full Restore (JSON)
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.books) saveStoredBooks(parsed.books);
          if (parsed.members) saveStoredMembers(parsed.members);
          if (parsed.loans) saveStoredLoans(parsed.loans);
          if (parsed.readingLogs) saveStoredReadingLogs(parsed.readingLogs);
          if (parsed.config) {
            saveStoredLibraryConfig(parsed.config);
            setConfig(parsed.config);
          }
          alert('데이터가 성공적으로 복원되었습니다!');
          window.location.reload();
        } catch (err) {
          alert('백업 파일 형식이 올바르지 않습니다.');
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link href="/admin" className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>관리자 대시보드로 돌아가기</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-brand-600" />
            작은도서관 맞춤 설정 & AI 연동
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            전국 6,000개 작은도서관이 각자의 이름과 비밀번호, Gemini API 키로 독립 운영할 수 있습니다.
          </p>
        </div>

        <Link
          href="https://github.com/ai20251209/library-kecf/blob/main/DEPLOYMENT_GUIDE_FOR_SMALL_LIBRARIES.md"
          target="_blank"
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-brand-600" />
          <span>3분 원클릭 독립 설치 가이드</span>
        </Link>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-8">
        
        {/* Section 1: Library Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. 우리 도서관 기본 정보</h2>
              <p className="text-xs text-slate-500">도서관 화면 상단 및 영수증, 바코드증에 표시될 정보입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">도서관 이름 *</label>
              <input
                type="text"
                required
                value={config.libraryName}
                onChange={(e) => setConfig({ ...config, libraryName: e.target.value })}
                placeholder="예: 별빛마을 작은도서관"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">도서관 슬로건 / 한 줄 소개</label>
              <input
                type="text"
                value={config.subTitle}
                onChange={(e) => setConfig({ ...config, subTitle: e.target.value })}
                placeholder="예: 책과 함께 꿈을 키우는 마을 도서관"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">도서관 위치 / 주소</label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                placeholder="예: 서울시 마포구 독서로 12"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">문의 연락처</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                placeholder="예: 02-1234-5678"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Google AI Studio Gemini API Key */}
        <div className="bg-gradient-to-br from-white via-cosmic-50/30 to-brand-50/30 rounded-3xl p-6 sm:p-8 border border-cosmic-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cosmic-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cosmic-600 to-brand-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>2. Google AI Studio (Gemini) 연동</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    무료 지원
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  구글 계정(Gmail)으로 AI Studio에서 무료 API Key를 발급받아 입력하시면 월 수만 건의 AI 서비스를 완전 무료로 이용할 수 있습니다.
                </p>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cosmic-600 hover:bg-cosmic-700 text-white text-xs font-bold rounded-xl transition shadow"
            >
              <span>🔑 AI Studio에서 무료 Key 발급</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Google Gemini API Key
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... (Google AI Studio에서 복사한 키)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-cosmic-500 shadow-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isTestingKey || !apiKey.trim()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTestingKey ? '검증 중...' : '연결 테스트'}</span>
              </button>
            </div>

            {keyTestStatus && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                keyTestStatus.success 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {keyTestStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">!</div>
                )}
                <span>{keyTestStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Librarian Master PIN & YES24 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Master PIN */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">사서 마스터 보안 PIN</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                관리자 접근 비밀번호 (현재: {config.adminPin})
              </label>
              <input
                type="password"
                required
                maxLength={8}
                value={config.adminPin}
                onChange={(e) => setConfig({ ...config, adminPin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center tracking-widest font-bold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                관리자 대시보드 및 도서/회원 관리 진입 시 필요한 비밀번호입니다.
              </p>
            </div>
          </div>

          {/* YES24 Integration */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900">YES24 공개 서지 연동</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableYes24Sync}
                  onChange={(e) => setConfig({ ...config, enableYes24Sync: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  YES24 서지정보 자동 불러오기 및 구매 링크 활성화
                </span>
              </label>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                비회원 상태에서도 YES24 도서명/ISBN 서지 데이터를 실시간으로 가져오고, 학생 및 주민이 책을 직접 구입할 수 있는 링크를 표시합니다.
              </p>
            </div>
          </div>

        </div>

        {/* Section 4: Data Backup and Restore */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">도서관 전체 데이터 백업 및 복원</h3>
              <p className="text-xs text-slate-500">소장도서, 회원명부, 대출기록을 JSON 파일로 보관하거나 다른 기기로 이전할 수 있습니다.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>전체 데이터 JSON 내보내기 (백업)</span>
            </button>

            <label className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-brand-600" />
              <span>백업 파일 복원하기 (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl transition transform hover:scale-[1.02] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>설정 저장하기</span>
          </button>
        </div>

      </form>

    </div>
  );
}
