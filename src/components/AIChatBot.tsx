'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Award, 
  Lightbulb, 
  Flame, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { Book, TargetLevel } from '@/lib/types';
import { getStoredApiKey, getCurrentUser } from '@/lib/db';
import confetti from 'canvas-confetti';

interface AIChatBotProps {
  book?: Book;
  initialLevel?: TargetLevel;
  mode?: 'dialogue' | 'quiz' | 'essay';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}

export default function AIChatBot({ book, initialLevel = 'elem_high', mode = 'dialogue' }: AIChatBotProps) {
  const currentUser = getCurrentUser();
  const [level, setLevel] = useState<TargetLevel>(book?.targetLevel || initialLevel);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'deepQuestions'>('chat');
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const greeting = level === 'elem_low'
      ? `안녕! 🐣 나는 마법의 독서 요정 '퐁퐁이'야! ${book ? `《${book.title}》 이야기를 함께 나누어볼까? 궁금한 게 있으면 무엇이든 물어봐!` : '오늘 어떤 재미있는 책 이야기를 나누고 싶니? ✨'}`
      : level === 'elem_high'
      ? `반가워! 🚀 나는 독서 탐험 메이트 '루카'야. ${book ? `《${book.title}》의 흥미진진한 장면과 등장인물의 마음에 대해 깊이 파헤쳐보자!` : '궁금한 책이나 나누고 싶은 생각이 있다면 편하게 이야기해줘!'}`
      : `반갑습니다. 🦉 독서 멘토 '아테나'입니다. ${book ? `《${book.title}》의 문학적 상징과 주제의식에 대해 비판적이고 심도 있는 토론을 나눠봅시다.` : '책을 통해 더 넓은 시야와 깊이 있는 통찰을 탐구해봅시다.'}`;

    return [
      {
        id: 'msg-init',
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = getStoredApiKey();
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          level,
          bookContext: book,
          userApiKey: apiKey,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSimulated: data.isSimulated,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: '이야기를 나누는 중에 잠시 통신이 지연되었습니다. 다시 한 번 물어봐주세요! ✨',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted || !book?.sampleQuizzes) return;
    setSelectedOption(optionIdx);
    setQuizSubmitted(true);

    const isCorrect = optionIdx === book.sampleQuizzes[currentQuizIndex].answerIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  const nextQuiz = () => {
    if (!book?.sampleQuizzes) return;
    if (currentQuizIndex + 1 < book.sampleQuizzes.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      // Finished all quizzes!
      setActiveTab('chat');
      handleSendMessage(`🎉 《${book.title}》 독서 퀴즈를 모두 풀었습니다! 내 점수: ${quizScore + (selectedOption === book.sampleQuizzes[currentQuizIndex].answerIndex ? 0 : 0)}점! 칭찬과 함께 다음 독서 팁을 알려줘!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col h-[650px] max-h-[85vh]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cosmic-500 to-brand-500 flex items-center justify-center shadow-lg shadow-cosmic-500/30 animate-pulse-subtle">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
                AI 북버디 (BookBuddy)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cosmic-500/20 text-cosmic-300 border border-cosmic-500/30">
                심층 생각 확장기
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {book ? `📖 《${book.title}》 함께 읽기 중` : '자유로운 독서 탐색 & 생각 나누기'}
            </p>
          </div>
        </div>

        {/* Age Level Selector Pills */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setLevel('elem_low')}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              level === 'elem_low'
                ? 'bg-emerald-500 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🐣</span>
            <span className="hidden sm:inline">초등 저학년</span>
          </button>
          <button
            onClick={() => setLevel('elem_high')}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              level === 'elem_high'
                ? 'bg-blue-500 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🚀</span>
            <span className="hidden sm:inline">초등 고학년</span>
          </button>
          <button
            onClick={() => setLevel('middle')}
            className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
              level === 'middle'
                ? 'bg-purple-500 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🦉</span>
            <span className="hidden sm:inline">중학생</span>
          </button>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition ${
            activeTab === 'chat'
              ? 'bg-white text-brand-600 border-b-2 border-brand-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI 심층 대화</span>
        </button>

        {book?.deepQuestions && book.deepQuestions.length > 0 && (
          <button
            onClick={() => setActiveTab('deepQuestions')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition ${
              activeTab === 'deepQuestions'
                ? 'bg-white text-cosmic-600 border-b-2 border-cosmic-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>생각 확장 질문 ({book.deepQuestions.length})</span>
          </button>
        )}

        {book?.sampleQuizzes && book.sampleQuizzes.length > 0 && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition ${
              activeTab === 'quiz'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span>독서 퀴즈 챌린지</span>
          </button>
        )}
      </div>

      {/* Main Content Areas */}
      {activeTab === 'chat' && (
        <>
          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm shrink-0 ${
                      isUser
                        ? 'bg-brand-600 text-white'
                        : 'bg-gradient-to-tr from-cosmic-600 to-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? (currentUser?.avatarEmoji || <User className="w-4 h-4" />) : '🤖'}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        isUser ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.isSimulated && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-medium">
                          스마트시뮬레이션
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmic-600 to-indigo-600 text-white flex items-center justify-center text-sm shadow-sm">
                  🤖
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cosmic-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 pl-1">생각하는 중...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" /> 추천 질문:
            </span>
            <button
              onClick={() => handleSendMessage('주인공의 심리와 결정을 알기 쉽게 설명해줘!')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 shrink-0 border border-slate-200 transition"
            >
              💭 주인공의 심리는?
            </button>
            <button
              onClick={() => handleSendMessage('만약 내가 이 상황이었다면 어떤 선택을 할 수 있었을까?')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 shrink-0 border border-slate-200 transition"
            >
              🌟 만약 내가 주인공이라면?
            </button>
            <button
              onClick={() => handleSendMessage('이 책의 가장 핵심적인 교훈과 상징은 뭐야?')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 shrink-0 border border-slate-200 transition"
            >
              🔍 핵심 교훈과 상징
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`${book ? `《${book.title}》에 대해` : '책에 대해'} 궁금한 점을 물어보세요...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                isLoading || !input.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-cosmic-600 text-white shadow-md hover:from-brand-700 hover:to-cosmic-700'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">전송</span>
            </button>
          </form>
        </>
      )}

      {/* Deep Questions Tab */}
      {activeTab === 'deepQuestions' && book?.deepQuestions && (
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <span>질문을 클릭하면 AI 북버디와 즉시 심층 대화를 시작할 수 있습니다!</span>
          </div>

          <div className="space-y-3">
            {book.deepQuestions.map((q, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage(`질문: ${q.question}\n이 질문에 대해 어떻게 생각해야 할지 토론해보고 싶어!`);
                }}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cosmic-400 shadow-sm hover:shadow-md cursor-pointer transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cosmic-50 text-cosmic-700 border border-cosmic-200">
                    {q.focus}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-cosmic-600 transition flex items-center gap-1">
                    대화하기 →
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {q.question}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Tab */}
      {activeTab === 'quiz' && book?.sampleQuizzes && book.sampleQuizzes.length > 0 && (
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                문제 {currentQuizIndex + 1} / {book.sampleQuizzes.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                현재 획득 점수: <strong className="text-emerald-600">{quizScore}점</strong>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-base font-bold text-slate-900 mb-4 leading-snug">
                {book.sampleQuizzes[currentQuizIndex].question}
              </h4>

              <div className="space-y-2.5">
                {book.sampleQuizzes[currentQuizIndex].options.map((opt, optIdx) => {
                  const isAnswer = optIdx === book.sampleQuizzes[currentQuizIndex].answerIndex;
                  const isSelected = selectedOption === optIdx;

                  let optClass = 'border-slate-200 hover:border-brand-400 hover:bg-slate-50';
                  if (quizSubmitted) {
                    if (isAnswer) optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    else if (isSelected && !isAnswer) optClass = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={quizSubmitted}
                      onClick={() => handleQuizAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${optClass}`}
                    >
                      <span>{optIdx + 1}. {opt}</span>
                      {quizSubmitted && isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 animate-fade-in">
                  <div className="font-bold text-slate-900 mb-1">💡 해설</div>
                  {book.sampleQuizzes[currentQuizIndex].explanation}
                </div>
              )}
            </div>
          </div>

          {quizSubmitted && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={nextQuiz}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                {currentQuizIndex + 1 < book.sampleQuizzes.length ? '다음 문제 풀기 →' : '퀴즈 완료 & AI 피드백 받기 🏆'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
