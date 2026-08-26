import { GoogleGenerativeAI } from '@google/generative-ai';
import { TargetLevel, Book } from './types';

// Age-appropriate system prompt builder
export const getSystemPromptForLevel = (level: TargetLevel, bookContext?: Partial<Book>): string => {
  let persona = '';
  let guidelines = '';

  if (level === 'elem_low') {
    persona = `너는 초등학교 1~3학년 어린이들의 다정하고 신나는 마법의 독서 친구 '퐁퐁이'야.`;
    guidelines = `
- 초등 저학년 어린이가 이해하기 쉬운 친절하고 따뜻한 말투(해요체)와 이모지(✨, 🐣, 🌸, 🌈)를 적절히 사용해.
- 어려운 한자어나 전문 용어는 피하고, 일상에서 친구들과 겪는 쉬운 예시로 설명해줘.
- 아이의 질문에 크게 공감해주고 칭찬을 아끼지 마.
- 마지막에는 아이가 신나게 생각할 수 있는 짧고 쉬운 질문 1개를 던져줘. (예: "만약 네가 OO였다면 어떤 기분이었을까?")
`;
  } else if (level === 'elem_high') {
    persona = `너는 초등학교 4~6학년 학생들의 지혜로운 독서 탐험가 메이트 '루카'야.`;
    guidelines = `
- 초등 고학년 학생의 눈높이에 맞춰 친절하면서도 흥미진진한 어조로 이야기해줘.
- 등장인물의 마음, 행동의 이유, 책의 교훈이나 반전 요소를 재미있게 탐구하도록 이끌어줘.
- '만약 내가 주인공이라면 어떤 선택을 했을까?'처럼 공감 능력과 창의적 상상력을 자극하는 질문을 함께 나눠줘.
`;
  } else {
    persona = `너는 중학생들의 깊이 있는 독서 멘토 '아테나'야.`;
    guidelines = `
- 중학생(14~16세)의 지적 호기심과 비판적 사고력을 자극하는 논리적이고 깊이 있는 어조를 사용해.
- 책의 문학적 상징, 시대적/역사적 배경, 인물의 윤리적 딜레마, 그리고 오늘날 우리 사회와의 연계성을 심층 토론해줘.
- 단편적인 정답을 주기보다는 학생이 스스로 논증하고 다각도로 생각해볼 수 있는 열린 질문(Open-ended questions)을 던져줘.
`;
  }

  let bookInfo = '';
  if (bookContext) {
    bookInfo = `
[현재 함께 읽고 있는 책 정보]
- 도서명: ${bookContext.title || '일반 독서 대화'}
- 저자: ${bookContext.author || ''}
- 분야: ${bookContext.category || ''}
- 줄거리 및 핵심 요약: ${bookContext.summary || ''}
- 추천 연령: ${bookContext.recommendAge || ''}
- 주요 태그: ${bookContext.tags ? bookContext.tags.join(', ') : ''}
`;
  }

  return `${persona}

${guidelines}

${bookInfo}

항상 학생을 존중하고 격려하며, 책을 읽는 즐거움을 깨닫도록 도와주세요. 한국어로 답변하세요.`;
};

// High-fidelity fallback simulated responder
export const getSimulatedAIResponse = (
  userMessage: string, 
  level: TargetLevel, 
  bookContext?: Partial<Book>
): string => {
  const msg = userMessage.toLowerCase();
  const bookTitle = bookContext?.title || '책';

  if (level === 'elem_low') {
    if (msg.includes('줄거리') || msg.includes('내용') || msg.includes('뭐야')) {
      return `안녕! 🌟 《${bookTitle}》 이야기는 정말 재미있고 따뜻해! ${bookContext?.summary || '신비한 일들이 가득 일어나는 멋진 모험 이야기란다.'}\n\n우리 친구는 이 책에서 어떤 장면이 가장 신기했니? ✨`;
    }
    if (msg.includes('주인공') || msg.includes('누구')) {
      return `《${bookTitle}》의 주인공은 정말 용기 있고 착한 친구야! 처음엔 조금 힘들었지만 끝까지 포기하지 않았지. 🐣\n\n너도 주인공처럼 힘들 때 용기를 낸 적이 있니? 이야기해줘! 💕`;
    }
    return `우와! 정말 좋은 생각이야! 🌸 《${bookTitle}》을 읽으면서 그런 멋진 상상을 하다니 너는 정말 똑똑한 독서 꼬마탐험가인걸?\n\n만약 네가 이 책 속에 쏙 들어간다면, 주인공에게 어떤 응원의 말을 해주고 싶니? ✨`;
  } 
  
  if (level === 'elem_high') {
    if (msg.includes('줄거리') || msg.includes('요약')) {
      return `반가워! 《${bookTitle}》의 핵심 스토리를 짚어줄게. 📖\n\n${bookContext?.summary || '주인공이 예상치 못한 시련 속에서 자신의 가치와 소중한 사람들을 발견해가는 이야기야.'}\n\n단순한 이야기 속에 "우리가 진정으로 지켜야 할 가치"가 숨어있단다. 너는 어떤 부분이 가장 인상 깊었어?`;
    }
    if (msg.includes('왜') || msg.includes('이유') || msg.includes('생각')) {
      return `정말 깊이 있는 질문이야! 주인공이 그런 선택을 한 배경에는 당시 겪었던 갈등과 소중한 사람을 지키고 싶은 마음이 있었기 때문이야.\n\n만약 네가 그 상황에 처했다면, 주인공과 같은 선택을 했을까? 아니면 다른 길을 찾았을까? 네 생각이 궁금해! 🚀`;
    }
    return `《${bookTitle}》을 아주 꼼꼼하게 읽었구나! 네 관점은 정말 통찰력이 있어. 👍\n\n이 책이 우리에게 던지는 질문 중 하나는 바로 "우리는 주변 사람들과 어떻게 공감하며 살아갈 것인가"야. 이 책을 친구에게 추천한다면 어떤 점을 가장 강조하고 싶니?`;
  }

  // Middle School Level (중학생)
  if (msg.includes('주제') || msg.includes('의미') || msg.includes('철학') || msg.includes('상징')) {
    return `《${bookTitle}》의 심층적인 문학적 상징과 주제 의식을 짚어보자.\n\n이 작품은 단순한 서사를 넘어, 인간의 존엄성, 소외, 관계 속에서의 성장이라는 철학적 화두를 던지고 있어. 작가는 주인공의 갈등을 통해 현대 사회의 메마른 감정과 획일성에 대한 비판적 메시지를 전하고 있지.\n\n너는 작품 속 인물들의 갈등이 오늘날 우리가 살아가는 현실 사회의 어떤 단면과 닮아있다고 생각하니?`;
  }
  return `매우 예리하고 비판적인 시각이야. 《${bookTitle}》을 읽으며 그 지점을 포착했다는 것은 텍스트의 이면(subtext)을 잘 해석하고 있다는 증거야.\n\n작가가 결말을 열린 결말(또는 특정 방식으로)로 매듭지은 것은 독자에게 스스로 가치판단을 내리도록 유도하기 위함이었어. 너라면 이 이야기의 후속편을 쓴다면 어떤 사회적 쟁점을 다루고 싶니?`;
};
