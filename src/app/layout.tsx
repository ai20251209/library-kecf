import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: '별빛 북스페이스 | 초·중학생 맞춤형 AI 작은도서관 LMS',
  description: '초등·중학생의 눈높이에 맞춘 AI 독서 메이트, 심층 사고력 질문, 게이미피케이션 독서통장과 10,000권 규모의 스마트 작은도서관 관리 시스템.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div>
              <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                <span>별빛 북스페이스 작은도서관</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                초·중학생의 꿈과 상상력을 키우는 차세대 AI 스마트 도서관입니다. 책을 매개로 AI와 함께 더 깊은 생각의 세계로 여행을 떠나요.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">작은도서관 LMS 주요 기능</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>• 초/중등 3단계 맞춤 AI 북버디 (BookBuddy)</li>
                <li>• 10,000권 도서 및 3,000명 회원 바코드 관리</li>
                <li>• AI 도서 메타데이터 자동 생성 & 퀴즈 챌린지</li>
                <li>• Vercel + GitHub + Supabase 클라우드 아키텍처</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">시스템 안내</h4>
              <p className="text-slate-400 leading-relaxed mb-3">
                GitHub + Vercel 서버리스로 운영되며, Supabase PostgreSQL 클라우드 DB와 연동 가능합니다.
              </p>
              <div className="flex items-center space-x-1 text-slate-500">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>for Young Readers & Librarians</span>
              </div>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}
