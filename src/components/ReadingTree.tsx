'use client';

import React from 'react';
import { Sparkles, Trophy, BookOpen, Star, Zap } from 'lucide-react';
import { Member } from '@/lib/types';

interface ReadingTreeProps {
  member: Member;
}

export default function ReadingTree({ member }: ReadingTreeProps) {
  const points = member.readingPoints;
  const level = member.level;
  const nextLevelPoints = level * 100;
  const progressPercent = Math.min(100, Math.floor(((points % 100) / 100) * 100));

  // Determine tree stage visuals
  const getTreeVisual = () => {
    if (level <= 2) {
      return {
        stage: '새싹 단계 (Sprout)',
        emoji: '🌱',
        title: '호기심 가득한 아기 새싹',
        desc: '책을 읽을 때마다 새싹에 따스한 별빛이 내립니다.',
        glow: 'from-emerald-400 to-teal-500',
        bgGradient: 'from-emerald-950 via-slate-900 to-emerald-900',
      };
    } else if (level <= 5) {
      return {
        stage: '줄기 성장 단계 (Young Tree)',
        emoji: '🌿',
        title: '푸른 꿈을 키우는 독서 나무',
        desc: '상상력의 가지가 쑥쑥 자라나고 있어요!',
        glow: 'from-teal-400 to-cyan-500',
        bgGradient: 'from-slate-950 via-teal-950 to-slate-900',
      };
    } else if (level <= 8) {
      return {
        stage: '꽃과 열매 단계 (Flowering)',
        emoji: '🌸',
        title: '지혜의 꽃이 만개한 우주 나무',
        desc: '다양한 지식과 통찰이 탐스러운 열매를 맺고 있습니다.',
        glow: 'from-pink-400 to-purple-500',
        bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
      };
    } else {
      return {
        stage: '별빛 거목 단계 (Starry World Tree)',
        emoji: '🌳✨',
        title: '세상을 밝히는 전설의 별빛 지혜나무',
        desc: '도서관의 모든 별들이 당신의 지혜를 우러러봅니다.',
        glow: 'from-amber-400 to-yellow-500',
        bgGradient: 'from-slate-950 via-indigo-950 to-amber-950',
      };
    }
  };

  const tree = getTreeVisual();

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${tree.bgGradient} text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/10`}>
      
      {/* Decorative ambient cosmic background stars */}
      <div className="absolute top-4 right-6 text-2xl animate-pulse opacity-70">✨</div>
      <div className="absolute bottom-6 left-8 text-xl animate-float opacity-50">⭐</div>
      <div className="absolute top-1/2 right-12 text-sm animate-bounce-slow opacity-40">🌟</div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Tree Avatar Animation */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr ${tree.glow} p-1 shadow-2xl animate-float flex items-center justify-center`}>
              <div className="w-full h-full rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
                <span className="text-6xl sm:text-7xl drop-shadow-2xl">
                  {tree.emoji}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300">
              Lv.{level} 마스터
            </div>
          </div>

          <div className="mt-4 text-xs font-semibold text-teal-300 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/30">
            {tree.stage}
          </div>
        </div>

        {/* Right: Progress & Stats */}
        <div className="md:col-span-8 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> 나의 독서 성장 우주
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {member.name} 님의 {tree.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {tree.desc}
            </p>
          </div>

          {/* Level Progress Bar */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                다음 레벨까지 ({progressPercent}%)
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {points} / {nextLevelPoints} P
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${tree.glow} transition-all duration-700`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Quick counters */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" /> 완독 권수
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-0.5 font-mono">
                {member.totalBooksRead} <span className="text-xs font-normal text-slate-400">권</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> 보유 포인트
              </div>
              <div className="text-lg sm:text-xl font-bold text-amber-300 mt-0.5 font-mono">
                {member.readingPoints} <span className="text-xs font-normal text-slate-400">P</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-purple-400" /> 획득 뱃지
              </div>
              <div className="text-lg sm:text-xl font-bold text-purple-300 mt-0.5 font-mono">
                {member.badges.length} <span className="text-xs font-normal text-slate-400">개</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
