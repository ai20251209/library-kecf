import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPromptForLevel, getSimulatedAIResponse } from '@/lib/gemini';
import { TargetLevel, Book } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, level = 'elem_high', bookContext, userApiKey } = body as {
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
      level: TargetLevel;
      bookContext?: Partial<Book>;
      userApiKey?: string;
    };

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    // If no API Key is set, return rich simulated response
    if (!apiKey) {
      const simulatedText = getSimulatedAIResponse(latestUserMessage, level, bookContext);
      return NextResponse.json({
        reply: simulatedText,
        isSimulated: true,
        notice: '💡 Gemini API 키를 설정하면 실시간 초거대 생성형 AI로 대화할 수 있습니다 (현재는 고성능 스마트 시뮬레이션 모드 작동 중).'
      });
    }

    // Call Real Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemPromptForLevel(level, bookContext),
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: history.length > 0 ? history : undefined,
    });

    const result = await chat.sendMessage(latestUserMessage);
    const responseText = result.response.text();

    return NextResponse.json({
      reply: responseText,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({
      reply: '잠시 AI 연결에 문제가 발생하여 스마트 시뮬레이션 모드로 답변합니다. 책에 대해 궁금한 점을 더 물어보세요! ✨',
      isSimulated: true,
      error: error.message
    });
  }
}
