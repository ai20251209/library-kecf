'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Bookmark, CheckCircle2, AlertCircle, BookCheck } from 'lucide-react';
import { Book, Member } from '@/lib/types';
import { borrowBook, getCurrentUser } from '@/lib/db';
import confetti from 'canvas-confetti';

interface BookCardProps {
  book: Book;
  onBookUpdated?: () => void;
}

export default function BookCard({ book, onBookUpdated }: BookCardProps) {
  const [borrowMessage, setBorrowMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentUser = getCurrentUser();

  const handleQuickBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) return;
    const res = borrowBook(book.id, currentUser.id);

    setIsSuccess(res.success);
    setBorrowMessage(res.message);

    if (res.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      if (onBookUpdated) onBookUpdated();
    }

    setTimeout(() => {
      setBorrowMessage(null);
    }, 3000);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'elem_low':
        return { label: '초등 저학년', emoji: '🐣', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'elem_high':
        return { label: '초등 고학년', emoji: '🚀', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'middle':
        return { label: '중학생 추천', emoji: '🦉', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: '전체', emoji: '📚', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const badge = getLevelBadge(book.targetLevel);
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-brand-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Visual Book Cover Area */}
      <Link href={`/books/${book.id}`} className="block relative overflow-hidden">
        <div className={`h-48 w-full bg-gradient-to-br ${book.coverColor} p-5 flex flex-col justify-between text-white relative transition-transform duration-300 group-hover:scale-[1.02]`}>
          
          {/* Top badges */}
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              {book.category}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.8 rounded-full border flex items-center gap-1 ${badge.bg} shadow-sm`}>
              <span>{badge.emoji}</span>
              <span>{badge.label}</span>
            </span>
          </div>

          {/* Center Emoji + Decorative Book Spine */}
          <div className="flex items-center justify-center my-auto">
            <span className="text-6xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">
              {book.coverEmoji}
            </span>
          </div>

          {/* Bottom Title & Author in Cover */}
          <div className="z-10 bg-black/25 backdrop-blur-sm -mx-5 -mb-5 p-3 px-4 border-t border-white/10">
            <h3 className="font-bold text-base leading-tight truncate text-white drop-shadow">
              {book.title}
            </h3>
            <p className="text-xs text-white/80 truncate mt-0.5">
              {book.author} · {book.publisher}
            </p>
          </div>
        </div>
      </Link>

      {/* Body / Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Summary Snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {book.summary}
        </p>

        {/* Location & Call Number Tag */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
          <span className="truncate">📍 {book.location}</span>
          <span className="font-mono font-medium text-slate-700 ml-1">{book.callNumber}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {book.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        {/* Loan Status & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
            <span className={isAvailable ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-medium'}>
              {isAvailable ? `대출가능 (${book.availableCopies}/${book.totalCopies})` : '대출중 (예약가능)'}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* AI Companion Button */}
            <Link
              href={`/books/${book.id}#ai-buddy`}
              className="p-2 text-cosmic-600 hover:text-white hover:bg-cosmic-600 rounded-lg bg-cosmic-50 transition border border-cosmic-200"
              title="AI 북버디와 대화하기"
            >
              <Sparkles className="w-4 h-4" />
            </Link>

            {/* Quick Borrow Button */}
            <button
              onClick={handleQuickBorrow}
              disabled={!isAvailable}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm ${
                isAvailable
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <BookCheck className="w-3.5 h-3.5" />
              <span>대출</span>
            </button>
          </div>

        </div>

        {/* Borrow feedback toast */}
        {borrowMessage && (
          <div className={`text-[11px] p-2 rounded-lg flex items-center gap-1.5 animate-fade-in ${
            isSuccess ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {isSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
            <span className="truncate">{borrowMessage}</span>
          </div>
        )}

      </div>

    </div>
  );
}
