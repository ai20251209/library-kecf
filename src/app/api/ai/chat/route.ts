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

    // Call Real Google Gemini API with fallback models
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = getSystemPromptForLevel(level, bookContext);

    // Filter valid history: must start with 'user' and alternate roles
    const validHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
    for (const m of messages.slice(0, -1)) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      // Skip if first history item is 'model' (Gemini requirement)
      if (validHistory.length === 0 && role === 'model') {
        continue;
      }
      validHistory.push({
        role,
        parts: [{ text: m.content }]
      });
    }

    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-pro'
    ];

    let responseText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        if (validHistory.length > 0) {
          const chat = model.startChat({ history: validHistory });
          const result = await chat.sendMessage(latestUserMessage);
          responseText = result.response.text();
        } else {
          const result = await model.generateContent(latestUserMessage);
          responseText = result.response.text();
        }

        if (responseText) {
          break; // Success!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Attempt with model ${modelName} failed:`, err.message);
      }
    }

    if (responseText) {
      return NextResponse.json({
        reply: responseText,
        isSimulated: false,
      });
    }

    // If Gemini API threw an error (e.g. invalid API key or quota exceeded), return simulated with helpful alert
    console.error('All Gemini model calls failed:', lastError);
    const simulatedText = getSimulatedAIResponse(latestUserMessage, level, bookContext);
    return NextResponse.json({
      reply: `${simulatedText}\n\n*(⚠️ Gemini API 오류: ${lastError?.message || 'API 키를 다시 확인해주세요'})*`,
      isSimulated: true,
      error: lastError?.message
    });

  } catch (error: any) {
    console.error('AI Chat Global Error:', error);
    return NextResponse.json({
      reply: 'AI 통신 연결을 확인하고 있습니다. 잠시 후 다시 질문해 주세요! ✨',
      isSimulated: true,
      error: error.message
    });
  }
}
