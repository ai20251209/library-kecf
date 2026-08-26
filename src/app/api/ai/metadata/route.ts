import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { title, isbn, userApiKey } = await req.json();
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

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
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const prompt = `
도서명 "${title}" (ISBN: ${isbn || '미정'})에 대한 작은도서관 LMS 메타데이터를 한국 초등/중학생 수준에 맞춰 JSON으로 생성해줘.
반드시 아래 JSON 스키마를 만족해야 해:
{
  "title": "${title}",
  "author": "작가명",
  "publisher": "출판사명",
  "publishYear": 2023,
  "category": "문학/동화" 또는 "과학/우주" 또는 "역사/사회" 또는 "판타지/모험" 또는 "철학/인성",
  "targetLevel": "elem_low" (초1-3) 또는 "elem_high" (초4-6) 또는 "middle" (중학생),
  "callNumber": "한국십진분류 청구기호 예: 813.8-홍12ㄱ",
  "location": "서가 위치 예: 초등문학 A-04",
  "summary": "초/중학생이 흥미를 가질 만한 3줄 요약",
  "recommendAge": "권장 연령대 예: 초등 5학년 ~ 중학생",
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

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text());
    return NextResponse.json({ ...data, isSimulated: false });
  } catch (error: any) {
    console.error('Metadata generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
