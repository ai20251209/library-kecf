import { Book, Member } from '../lib/types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    isbn: '9788936445585',
    title: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    publishYear: 2000,
    category: '문학/동화',
    targetLevel: 'elem_high',
    callNumber: '813.8-황53ㅁ',
    location: '초등문학 B-02',
    summary: '양계장에 갇혀 알만 낳던 암탉 잎싹이 마당을 나와 자신의 꿈과 자유를 찾아가는 감동적인 모험과 모성애의 이야기.',
    coverEmoji: '🐔',
    coverColor: 'from-amber-400 to-orange-500',
    status: 'available',
    totalCopies: 5,
    availableCopies: 3,
    recommendAge: '초등 4~6학년',
    tags: ['자유', '생명', '모성애', '모험', '성장'],
    deepQuestions: [
      {
        question: '잎싹이가 안전한 양계장을 박차고 마당 밖으로 나간 결정은 어떤 용기가 필요했을까요?',
        focus: '인물심리'
      },
      {
        question: '잎싹과 초록머리는 종이 다른 동물인데도 서로를 진정한 가족으로 여겼습니다. 가족의 진정한 의미는 무엇일까요?',
        focus: '도덕적판단'
      },
      {
        question: '마지막에 족제비에게 자신을 내어준 잎싹의 마음은 어떠했을까요? 자연의 순환과 연결해 생각해 볼까요?',
        focus: '창의적확장'
      }
    ],
    sampleQuizzes: [
      {
        question: '주인공 암탉 "잎싹"이 간절히 바랐던 첫 번째 꿈은 무엇이었나요?',
        options: ['자신의 알을 직접 품어 병아리로 깨우는 것', '양계장 사료를 배불리 먹는 것', '하늘을 날아 여행하는 것'],
        answerIndex: 0,
        explanation: '잎싹은 자신이 낳은 알을 스스로 품어 병아리를 탄생시키고 싶어 했습니다.'
      },
      {
        question: '잎싹이 지켜낸 아기 청둥오리의 이름은 무엇인가요?',
        options: ['날쌘돌이', '초록머리', '나그네'],
        answerIndex: 1,
        explanation: '머리에 푸른 깃털을 가진 오리여서 "초록머리"라는 이름을 붙여주었습니다.'
      }
    ]
  },
  {
    id: 'book-2',
    isbn: '9788936434120',
    title: '아몬드 (Almond)',
    author: '손원평',
    publisher: '창비',
    publishYear: 2017,
    category: '문학/동화',
    targetLevel: 'middle',
    callNumber: '813.7-손65ㅇ',
    location: '청소년문학 A-01',
    summary: '감정을 느끼지 못하는 소년 윤재가 특별한 친구 곤이와 도라를 만나며 타인의 아픔에 공감하고 사랑을 배워가는 청소년 필독 성장 소설.',
    coverEmoji: '🌰',
    coverColor: 'from-emerald-400 to-teal-700',
    status: 'available',
    totalCopies: 4,
    availableCopies: 2,
    recommendAge: '중학교 1~3학년',
    tags: ['공감', '성장', '우정', '감정', '청소년'],
    deepQuestions: [
      {
        question: '감정을 느끼지 못하는 윤재에게 세상 사람들은 왜 오히려 더 차갑고 가혹했을까요?',
        focus: '세계관/배경'
      },
      {
        question: '분노로 가득 찼던 곤이와 무감각한 윤재는 서로에게 어떤 존재가 되어주었나요?',
        focus: '인물심리'
      },
      {
        question: '오늘날 우리가 SNS나 일상에서 남의 고통을 무감각하게 지나치는 모습과 이 책은 어떤 연관이 있을까요?',
        focus: '창의적확장'
      }
    ],
    sampleQuizzes: [
      {
        question: '주인공 윤재가 감정을 느끼지 못하는 의학적 원인은 뇌의 어느 부위 때문인가요?',
        options: ['해마', '편도체(아몬드 크기)', '대뇌피질'],
        answerIndex: 1,
        explanation: '감정을 담당하는 편도체(아몬드 모양)가 보통 사람들보다 작아 알렉시티미아(감정표현불능증)를 겪습니다.'
      }
    ]
  },
  {
    id: 'book-3',
    isbn: '9788950920042',
    title: '어린 왕자 (The Little Prince)',
    author: '앙투안 드 생텍쥐페리',
    publisher: '아르테',
    publishYear: 1943,
    category: '철학/인성',
    targetLevel: 'elem_high',
    callNumber: '863-생84ㅇ',
    location: '세계문학 C-05',
    summary: '사하라 사막에 불시착한 조종사가 B612 소행성에서 온 어린 왕자를 만나 진정한 사랑과 관계, 길들임의 의미를 깨닫는 영원한 고전.',
    coverEmoji: '🪐',
    coverColor: 'from-blue-500 to-indigo-800',
    status: 'available',
    totalCopies: 6,
    availableCopies: 4,
    recommendAge: '초등 5학년 ~ 중학생',
    tags: ['철학', '우정', '마음', '상상력', '고전'],
    deepQuestions: [
      {
        question: '"가장 중요한 것은 눈에 보이지 않아"라는 여우의 말은 우리의 인간관계에서 무엇을 의미할까요?',
        focus: '도덕적판단'
      },
      {
        question: '어린 왕자가 수많은 장미꽃 밭에서 자신의 장미꽃이 특별하다고 느낀 이유는 무엇일까요?',
        focus: '인물심리'
      }
    ],
    sampleQuizzes: [
      {
        question: '여우가 어린 왕자에게 "서로에게 특별한 존재가 되는 것"을 표현한 단어는 무엇인가요?',
        options: ['길들이다', '지배하다', '명령하다'],
        answerIndex: 0,
        explanation: '여우는 "네가 나를 길들이면 우리는 서로에게 이 세상에서 오직 하나뿐인 존재가 된다"고 말했습니다.'
      }
    ]
  },
  {
    id: 'book-4',
    isbn: '9788949110271',
    title: '강아지 똥',
    author: '권정생',
    publisher: '길벗어린이',
    publishYear: 1996,
    category: '문학/동화',
    targetLevel: 'elem_low',
    callNumber: '813.8-권74ㄱ',
    location: '초등그림책 A-01',
    summary: '길가에 버려져 모두에게 놀림받던 강아지 똥이 아름다운 민들레 꽃의 거름이 되어 자신만의 소중한 가치를 꽃피우는 따뜻한 이야기.',
    coverEmoji: '🌱',
    coverColor: 'from-yellow-400 to-amber-600',
    status: 'available',
    totalCopies: 4,
    availableCopies: 4,
    recommendAge: '초등 1~3학년',
    tags: ['자존감', '생명', '배려', '자연', '감동'],
    deepQuestions: [
      {
        question: '강아지 똥은 처음엔 왜 슬퍼했을까요? 자신이 쓸모없다고 생각했던 친구에게 어떤 말을 해주고 싶나요?',
        focus: '인물심리'
      },
      {
        question: '민들레 꽃을 피우기 위해 자신을 온전히 녹여낸 강아지 똥의 마음은 어땠을까요?',
        focus: '도덕적판단'
      }
    ],
    sampleQuizzes: [
      {
        question: '강아지 똥이 마침내 도움을 주어 아름다운 꽃을 피우게 한 식물은 무엇인가요?',
        options: ['해바라기', '민들레', '장미꽃'],
        answerIndex: 1,
        explanation: '강아지 똥은 민들레 싹의 거름이 되어 노란 민들레 꽃을 피워냈습니다.'
      }
    ]
  },
  {
    id: 'book-5',
    isbn: '9788934986706',
    title: '코스모스 (청소년을 위한)',
    author: '칼 세이건',
    publisher: '사이언스북스',
    publishYear: 2021,
    category: '과학/우주',
    targetLevel: 'middle',
    callNumber: '440-세68ㅋ',
    location: '과학 B-07',
    summary: '우주의 탄생부터 별의 일생, 지구와 인류의 기원까지 과학적 상상력과 인문학적 성찰이 결합된 우주 과학의 대명작.',
    coverEmoji: '✨',
    coverColor: 'from-purple-600 to-slate-950',
    status: 'available',
    totalCopies: 3,
    availableCopies: 1,
    recommendAge: '중학교 1~3학년',
    tags: ['우주', '천문학', '과학탐구', '진화', '미래'],
    deepQuestions: [
      {
        question: '"우리는 모두 별의 먼지로 만들어졌다"는 칼 세이건의 말은 어떤 과학적, 철학적 의미를 담고 있을까요?',
        focus: '창의적확장'
      },
      {
        question: '광대한 우주 속에서 지구라는 작은 창백한 푸른 점(Pale Blue Dot)을 바라볼 때 우리는 어떤 태도로 지구를 지켜야 할까요?',
        focus: '도덕적판단'
      }
    ],
    sampleQuizzes: [
      {
        question: '보이저 1호가 60억 km 밖에서 지구를 찍었을 때, 칼 세이건이 지구를 부른 유명한 별칭은?',
        options: ['푸른 보석', '창백한 푸른 점', '빛나는 오아시스'],
        answerIndex: 1,
        explanation: '창백한 푸른 점(Pale Blue Dot)은 인류의 보금자리인 지구의 소중함을 깨닫게 해준 사진입니다.'
      }
    ]
  },
  {
    id: 'book-6',
    isbn: '9788936458515',
    title: '만복이네 떡집',
    author: '김리리',
    publisher: '비룡소',
    publishYear: 2010,
    category: '문학/동화',
    targetLevel: 'elem_low',
    callNumber: '813.8-김28ㅁ',
    location: '초등문학 A-05',
    summary: '입만 열면 나쁜 말이 나와 외톨이가 된 만복이가 신기한 소원 떡을 먹으며 고운 말과 따뜻한 친구 관계를 맺어가는 초등 저학년 인기 창작동화.',
    coverEmoji: '🍡',
    coverColor: 'from-pink-400 to-rose-600',
    status: 'available',
    totalCopies: 5,
    availableCopies: 2,
    recommendAge: '초등 1~3학년',
    tags: ['바른말', '우정', '마법', '학교생활', '성장'],
    deepQuestions: [
      {
        question: '만복이는 왜 마음과 달리 친구들에게 짓궂은 말과 행동을 했을까요?',
        focus: '인물심리'
      },
      {
        question: '내가 만약 신비한 떡집을 만난다면, 어떤 맛있는 소원 떡을 주문하고 싶나요?',
        focus: '창의적확장'
      }
    ],
    sampleQuizzes: [
      {
        question: '만복이가 떡을 사기 위해 지불해야 했던 신비한 "돈"은 무엇이었나요?',
        options: ['백 원 동전', '아이들의 웃음이나 착한 일', '반짝이는 조개껍데기'],
        answerIndex: 1,
        explanation: '만복이네 떡집에서는 돈 대신 착한 일, 웃음, 칭찬으로 떡 값을 치렀습니다.'
      }
    ]
  },
  {
    id: 'book-7',
    isbn: '9788954685320',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    publisher: '팩토리나인',
    publishYear: 2020,
    category: '판타지/모험',
    targetLevel: 'elem_high',
    callNumber: '813.7-이38ㄷ',
    location: '청소년/어린이 판타지 D-01',
    summary: '잠들어야만 입장할 수 있는 독특한 마을, 온갖 꿈을 판매하는 달러구트 꿈 백화점에서 벌어지는 가슴 뭉클하고 환상적인 힐링 판타지.',
    coverEmoji: '🌙',
    coverColor: 'from-indigo-600 to-purple-800',
    status: 'available',
    totalCopies: 5,
    availableCopies: 3,
    recommendAge: '초등 5학년 ~ 중학생',
    tags: ['꿈', '힐링', '판타지', '위로', '희망'],
    deepQuestions: [
      {
        question: '악몽(힘든 기억의 꿈)도 사람에게 긍정적인 힘을 줄 수 있을까요? 책에서는 악몽을 왜 팔았을까요?',
        focus: '도덕적판단'
      },
      {
        question: '내가 꿈 백화점의 직원이라면 내일 시험이나 걱정이 있는 친구에게 어떤 꿈을 추천하고 싶나요?',
        focus: '창의적확장'
      }
    ],
    sampleQuizzes: [
      {
        question: '꿈 백화점에서 손님들이 꿈값을 지불하는 방식은 무엇인가요?',
        options: ['골드 코인', '꿈을 꾸고 난 뒤 느끼는 감정의 설렘/자신감', '꿈속의 보물'],
        answerIndex: 1,
        explanation: '손님들은 꿈을 꾼 후 일어났을 때 느끼는 감정(자신감, 호기심, 감동 등)으로 값을 치릅니다.'
      }
    ]
  },
  {
    id: 'book-8',
    isbn: '9788936456078',
    title: '시간을 파는 상점',
    author: '김선영',
    publisher: '자음과모음',
    publishYear: 2012,
    category: '문학/동화',
    targetLevel: 'middle',
    callNumber: '813.7-김64ㅅ',
    location: '청소년문학 B-03',
    summary: '소방관 아버지를 여읜 온조가 인터넷 카페 "시간을 파는 상점"을 열고 다양한 사람들의 의뢰를 해결하며 시간의 소중함과 사람의 온기를 깨달아가는 이야기.',
    coverEmoji: '⏳',
    coverColor: 'from-amber-600 to-stone-800',
    status: 'available',
    totalCopies: 4,
    availableCopies: 4,
    recommendAge: '중학교 1~3학년',
    tags: ['시간', '상처치유', '가족', '우정', '자음과모음문학상'],
    deepQuestions: [
      {
        question: '시간을 사고판다는 생각은 과연 가능할까요? 온조가 상점을 통해 전하고 싶었던 진짜 가치는 무엇일까요?',
        focus: '도덕적판단'
      },
      {
        question: '과거의 후회나 미래의 불안 대신 지금 현재의 순간(크로노스와 카이로스)을 살아가는 방법은 무엇일까요?',
        focus: '세계관/배경'
      }
    ],
    sampleQuizzes: [
      {
        question: '온조가 만든 인터넷 카페의 닉네임은 시간의 신 이름을 딴 무엇이었나요?',
        options: ['크로노스', '제우스', '아폴로'],
        answerIndex: 0,
        explanation: '온조는 그리스 신화 속 시간의 신 "크로노스"라는 이름으로 상점을 운영했습니다.'
      }
    ]
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    barcode: 'STU-2026-0101',
    name: '김하늘',
    grade: '초등 4학년',
    schoolName: '별빛초등학교',
    role: 'student',
    avatarEmoji: '🦊',
    readingPoints: 480,
    level: 4,
    totalBooksRead: 16,
    activeLoansCount: 1,
    maxLoans: 5,
    joinedAt: '2025-03-02',
    badges: [
      { id: 'b1', name: '책벌레 꿈나무', icon: '🐛', description: '첫 5권 완독', unlockedAt: '2025-04-10' },
      { id: 'b2', name: '상상력 탐험가', icon: '🚀', description: '판타지/동화 5권 완독', unlockedAt: '2025-06-15' },
      { id: 'b3', name: 'AI 질문왕', icon: '🤖', description: 'AI 북버디와 심층 대화 10회 돌파', unlockedAt: '2025-09-01' }
    ]
  },
  {
    id: 'mem-2',
    barcode: 'STU-2026-0205',
    name: '박준서',
    grade: '중학교 2학년',
    schoolName: '은하중학교',
    role: 'student',
    avatarEmoji: '🦁',
    readingPoints: 850,
    level: 7,
    totalBooksRead: 32,
    activeLoansCount: 2,
    maxLoans: 5,
    joinedAt: '2024-03-02',
    badges: [
      { id: 'b1', name: '책벌레 꿈나무', icon: '🐛', description: '첫 5권 완독', unlockedAt: '2024-04-01' },
      { id: 'b4', name: '과학 마니아', icon: '🔬', description: '과학/우주 도서 5권 완독', unlockedAt: '2024-08-20' },
      { id: 'b5', name: '독서 마라토너', icon: '🏃', description: '30권 완독 달성', unlockedAt: '2025-11-12' }
    ]
  },
  {
    id: 'mem-3',
    barcode: 'STU-2026-0312',
    name: '이지우',
    grade: '초등 2학년',
    schoolName: '별빛초등학교',
    role: 'student',
    avatarEmoji: '🐰',
    readingPoints: 210,
    level: 2,
    totalBooksRead: 7,
    activeLoansCount: 0,
    maxLoans: 5,
    joinedAt: '2025-09-01',
    badges: [
      { id: 'b1', name: '책벌레 꿈나무', icon: '🐛', description: '첫 5권 완독', unlockedAt: '2025-10-15' }
    ]
  },
  {
    id: 'mem-admin',
    barcode: 'LIB-ADMIN-01',
    name: '김사서 (선생님)',
    grade: '작은도서관 사서',
    schoolName: '별빛 작은도서관',
    role: 'admin',
    avatarEmoji: '🦉',
    readingPoints: 9999,
    level: 10,
    totalBooksRead: 500,
    activeLoansCount: 0,
    maxLoans: 20,
    joinedAt: '2024-01-01',
    badges: [
      { id: 'b-master', name: '도서관의 수호자', icon: '👑', description: '도서관 관리 마스터' }
    ]
  }
];
