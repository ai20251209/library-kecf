import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSystemPromptForLevel, getSimulatedAIResponse } from '@/lib/gemini';
import { TargetLevel, Book } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, level = 'elem_high', bookContext, userApiKey, userModel } = body as {
      messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
      level: TargetLevel;
      bookContext?: Partial<Book>;
      userApiKey?: string;
      userModel?: string;
    };

    const apiKey = (userApiKey && userApiKey.trim() !== '') ? userApiKey.trim() : process.env.GEMINI_API_KEY;
    const latestUserMessage = messages[messages.length - 1]?.content || '';

    // If no API Key is set, return rich simulated response
    if (!apiKey) {
      const simulatedText = getSimulatedAIResponse(latestUserMessage, level, bookContext);
      return NextResponse.json({
        reply: simulatedText,
        isSimulated: true,
        notice: '💡 Gemini API 키를 설정하면 실시간 초거대 생성형 AI로 대화할 수 있습니다.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = getSystemPromptForLevel(level, bookContext);

    // List of candidate models prioritizing gemini-3.6-flash and gemini-3.5-flash
    const candidateModels = [
      userModel,
      process.env.GEMINI_MODEL,
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.0-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ].filter(Boolean) as string[];

    let responseText = '';
    let detailedErrors: string[] = [];

    for (const modelName of candidateModels) {
      try {
        // Attempt 1: getGenerativeModel with systemInstruction
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        });

        const fullPrompt = `${latestUserMessage}`;
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        if (text && text.trim()) {
          responseText = text.trim();
          break;
        }
      } catch (err1: any) {
        // Attempt 2: fallback without systemInstruction (prepend system prompt directly)
        try {
          const modelSimple = genAI.getGenerativeModel({ model: modelName });
          const combinedPrompt = `[시스템 지침]\n${systemPrompt}\n\n[사용자 질문]\n${latestUserMessage}`;
          const result2 = await modelSimple.generateContent(combinedPrompt);
          const text2 = result2.response.text();
          if (text2 && text2.trim()) {
            responseText = text2.trim();
            break;
          }
        } catch (err2: any) {
          detailedErrors.push(`${modelName}: ${err2.message}`);
        }
      }
    }

    if (responseText) {
      return NextResponse.json({
        reply: responseText,
        isSimulated: false,
      });
    }

    // If all real API calls fail, return helpful feedback + simulated fallback
    console.error('All Gemini model calls failed:', detailedErrors);
    const simulatedText = getSimulatedAIResponse(latestUserMessage, level, bookContext);
    return NextResponse.json({
      reply: `${simulatedText}\n\n*(💡 Gemini API 안내: ${detailedErrors[0] || 'API 키 또는 모델 버전을 확인해주세요'})*`,
      isSimulated: true,
      errors: detailedErrors
    });

  } catch (error: any) {
    console.error('AI Chat Global Error:', error);
    return NextResponse.json({
      reply: 'AI 통신을 확인하고 있습니다. 잠시 후 다시 질문해 주세요! ✨',
      isSimulated: true,
      error: error.message
    });
  }
}
