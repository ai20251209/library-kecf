'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Compass, 
  MessageSquare, 
  HelpCircle, 
  Flame, 
  BookOpen, 
  Bot, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import AIChatBot from '@/components/AIChatBot';
import { TargetLevel } from '@/lib/types';

function AILoungeContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const TOPIC_CHIPS = [
    { emoji: '🚀', title: '우주와 미래 과학', query: '우주 탐사와 미래 인공지능에 대한 흥미진진한 책을 추천해주고 함께 이야기 나눠보자!' },
    { emoji: '🤝', title: '친구 관계와 마음 성장', query: '친구와의 갈등이나 오해를 풀고 마음이 따뜻해지는 도서를 추천하고 핵심 질문을 던져줘.' },
    { emoji: '🏰', title: '판타지와 모험 세계관', query: '해리포터나 달러구트 꿈 백화점처럼 상상력이 폭발하는 판타지 소설에 대해 토론해보자!' },
    { emoji: '🕵️', title: '추리 미스터리와 논리', query: '추리 소설의 범인을 찾는 논리적 추론 과정과 과학 수사 이야기를 나누고 싶어!' },
    { emoji: '🌿', title: '환경과 생명 존중', query: '지구 온난화와 멸종 위기 동물을 지키는 따뜻한 생명 동화나 과학책을 소개해줘.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cosmic-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-cosmic-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cosmic-500/20 text-cosmic-300 border border-cosmic-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 생각 확장 라운지</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black">
            AI 북버디와 함께하는 자유 독서 토론
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            특정 책에 국한되지 않고, 좋아하는 주제, 고민, 가상 인물 인터뷰 등 무엇이든 자유롭게 질문해보세요!
          </p>
        </div>

        {/* Decorative sparkles */}
        <div className="absolute right-6 top-6 text-4xl opacity-30 animate-pulse">✨</div>
      </div>

      {/* Recommended Topics */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          추천 탐구 토픽 (클릭 시 자동 대화 시작)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {TOPIC_CHIPS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTopic(topic.query)}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-cosmic-400 hover:bg-cosmic-50/50 shadow-sm text-left transition flex items-center space-x-2.5 group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{topic.emoji}</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-cosmic-700 truncate">
                {topic.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main AI Chat Area */}
      <div className="pt-2">
        <AIChatBot initialLevel="elem_high" />
      </div>

    </div>
  );
}

export default function AILoungePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">AI 독서 라운지 준비 중...</div>}>
      <AILoungeContent />
    </Suspense>
  );
}
