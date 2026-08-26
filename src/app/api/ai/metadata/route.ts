import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { title, isbn, userApiKey, userModel } = await req.json();
    const apiKey = (userApiKey && userApiKey.trim() !== '') ? userApiKey.trim() : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return smart simulated auto-completed metadata
      return NextResponse.json({
        title: title || '새로운 추천 도서',
        author: '추천 작가',
        publisher: '별빛출판사',
        publishYear: 2024,
        category: '문학/동화',
        targetLevel: 'elem_high',
        callNumber: '813.8-별24ㅅ',
        location: '초등문학 A-12',
        summary: `《${title || '도서'}》는 꿈과 용기를 찾아 떠나는 주인공의 흥미진진한 여정을 다룬 작품입니다. 교훈과 감동을 동시에 선사합니다.`,
        recommendAge: '초등 4~6학년',
        tags: ['감동', '성장', '모험', '우정'],
        deepQuestions: [
          { question: '주인공의 선택에서 가장 용기 있었던 순간은 언제였나요?', focus: '인물심리' },
          { question: '내가 주인공의 친구였다면 어떤 조언을 해주었을까요?', focus: '도덕적판단' }
        ],
        sampleQuizzes: [
          {
            question: '이야기의 주인공이 가장 이루고 싶었던 꿈은 무엇이었나요?',
            options: ['자유를 찾는 것', '보물 상자를 여는 것', '대회에서 우승하는 것'],
            answerIndex: 0,
            explanation: '주인공은 시련을 극복하고 진정한 자유를 얻고자 했습니다.'
          }
        ],
        isSimulated: true
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = [
      userModel,
      process.env.GEMINI_MODEL,
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-002',
    ].filter(Boolean) as string[];

    const prompt = `
도서명 "${title}" (ISBN: ${isbn || '미정'})에 대한 작은도서관 LMS 메타데이터를 한국 초등/중학생 수준에 맞춰 반드시 유효한 JSON 형식으로만 생성해줘:
{
  "title": "${title}",
  "author": "작가명",
  "publisher": "출판사명",
  "publishYear": 2023,
  "category": "문학/동화",
  "targetLevel": "elem_high",
  "callNumber": "813.8-홍12ㄱ",
  "location": "초등문학 A-04",
  "summary": "초/중학생이 흥미를 가질 만한 3줄 요약",
  "recommendAge": "초등 5학년 ~ 중학생",
  "tags": ["키워드1", "키워드2", "키워드3"],
  "deepQuestions": [
    {"question": "사고력을 넓혀주는 심층 질문 1", "focus": "인물심리"},
    {"question": "사고력을 넓혀주는 심층 질문 2", "focus": "도덕적판단"}
  ],
  "sampleQuizzes": [
    {
      "question": "내용 확인 퀴즈",
      "options": ["보기1", "보기2", "보기3"],
      "answerIndex": 0,
      "explanation": "해설"
    }
  ]
}
`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);
        return NextResponse.json({ ...data, isSimulated: false });
      } catch (err: any) {
        console.warn(`Metadata gen with ${modelName} failed:`, err.message);
      }
    }

    // Fallback if all models fail
    return NextResponse.json({
      title: title || '추천 도서',
      author: '지은이',
      publisher: '도서출판 별빛',
      publishYear: 2024,
      category: '문학/동화',
      targetLevel: 'elem_high',
      callNumber: '813.8-별24',
      location: '초등서가 B-01',
      summary: `《${title}》의 감동적인 스토리와 지혜를 담은 추천 도서입니다.`,
      recommendAge: '초·중등 권장',
      tags: ['우정', '성장', '상상력'],
      deepQuestions: [
        { question: '주인공의 결정을 보고 어떤 생각이 들었나요?', focus: '인물심리' }
      ],
      sampleQuizzes: [
        { question: '주인공이 겪은 가장 큰 시련은?', options: ['모험', '시험', '이사'], answerIndex: 0, explanation: '모험을 통해 성장합니다.' }
      ],
      isSimulated: true
    });

  } catch (error: any) {
    console.error('Metadata generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
