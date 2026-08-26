import { Book, Member } from '../lib/types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    isbn: '9788971968710',
    title: '마당을 나온 암탉',
    author: '황선미 글 / 김환영 그림',
    publisher: '사계절',
    publishYear: 2000,
    price: 11000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788971968710.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788971968710',
    category: '문학/동화',
    targetLevel: 'elem_high',
    callNumber: '813.8-황53ㅁ',
    location: '초등문학 B-02',
    summary: '양계장 좁은 철장에 갇혀 알만 낳던 암탉 \'잎싹\'. 자신의 알을 직접 품어 병아리를 탄생시키겠다는 간절한 소망을 품고 마당을 탈출합니다. 숲속에서 버려진 청둥오리 알을 품어 아기 오리 \'초록머리\'를 낳아 기르며, 천적 족제비의 위협 속에서 목숨을 바쳐 자식을 지켜냅니다. 모성애와 자유, 그리고 자연의 순환에 대한 깊은 철학적 울림을 전하는 대한민국 아동문학의 불멸의 고전입니다.',
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
    price: 12000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434120.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936434120',
    category: '문학/동화',
    targetLevel: 'middle',
    callNumber: '813.7-손65ㅇ',
    location: '청소년문학 A-01',
    summary: '뇌 속 편도체(아몬드) 크기가 작아 분노도 공포도 느끼지 못하는 알렉시티미아(감정표현불능증)를 앓는 16세 소년 윤재. 비극적인 사고로 가족을 잃고 세상에 홀로 남겨진 윤재 앞에, 어두운 상처로 가득 찬 소년 \'곤이\'와 맑은 영혼의 소녀 \'도라\'가 나타납니다. 서로의 결핍을 마주하며 타인의 고통에 공감하는 법을 배워가는 뭉클한 청소년 필독 성장 소설입니다.',
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
    isbn: '9788932917245',
    title: '어린 왕자 (The Little Prince)',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    publishYear: 2015,
    price: 9800,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788932917245.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788932917245',
    category: '철학/인성',
    targetLevel: 'elem_high',
    callNumber: '863-생84ㅇ',
    location: '세계문학 C-05',
    summary: '사하라 사막에 불시착한 비행사가 B612 소행성에서 온 어린 왕자를 만나며 시작되는 이야기. 장미꽃 한 송이를 사랑했지만 떠나올 수밖에 없었던 순수한 왕자가 여우를 만나 "가장 중요한 것은 눈에 보이지 않고 마음으로 보아야 한다"는 진리를 깨달아가는 불후의 세계 명작입니다.',
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
    isbn: '9788936442804',
    title: '푸른 사자 와니니 1',
    author: '이현 글 / 오윤화 그림',
    publisher: '창비',
    publishYear: 2015,
    price: 10800,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936442804.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936442804',
    category: '문학/동화',
    targetLevel: 'elem_high',
    callNumber: '813.8-이94ㅍ',
    location: '초등문학 A-04',
    summary: '세렝게티 초원의 마디바 사자 무리에서 가장 작고 약하게 태어난 어린 암사자 와니니. 무리의 규칙을 어겼다는 억울한 오해를 받고 홀로 거친 초원에 쫓겨납니다. 굶주림과 하이에나, 거대한 수사자들의 위협 속에서 와니니는 자신처럼 무리에서 밀려난 외톨이 친구들(아산테, 잠보, 말라피)을 만나 작은 무리를 이룹니다. 서로의 약점을 감싸 안으며 초원의 사계절을 버텨내고 마침내 스스로의 힘으로 진정한 용기와 연대의 가치를 증명해내는 대한민국 대표 아동문학 성장 걸작입니다.',
    coverEmoji: '🦁',
    coverColor: 'from-amber-500 to-yellow-600',
    status: 'available',
    totalCopies: 5,
    availableCopies: 3,
    recommendAge: '초등 4~6학년',
    tags: ['성장', '모험', '우정', '자존감', '동물'],
    deepQuestions: [
      {
        question: '와니니가 무리에서 쫓겨났을 때 느꼈을 감정은 무엇이었을까요?',
        focus: '인물심리'
      },
      {
        question: '내가 생각하는 진정한 강함이란 무엇인지 와니니의 행동을 통해 이야기해 봅시다.',
        focus: '도덕적판단'
      }
    ],
    sampleQuizzes: [
      {
        question: '주인공 암사자 와니니가 살아가는 주 무대인 아프리카의 대초원 이름은?',
        options: ['세렝게티 초원', '사하라 사막', '아마존 정글'],
        answerIndex: 0,
        explanation: '와니니는 아프리카 탄자니아의 세렝게티 초원을 배경으로 모험을 펼칩니다.'
      }
    ]
  },
  {
    id: 'book-5',
    isbn: '9788954677189',
    title: '긴긴밤',
    author: '루리 글/그림',
    publisher: '문학동네',
    publishYear: 2021,
    price: 11500,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954677189.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788954677189',
    category: '문학/동화',
    targetLevel: 'elem_high',
    callNumber: '813.8-루28ㄱ',
    location: '초등문학 A-01',
    summary: '지구상에 마지막 하나 남은 흰바위코뿔소 \'노든\'과 버려진 알에서 태어난 어린 펭귄의 눈물겨운 동행. 코끼리 무리에서 자라나 가족을 잃고 인간의 전쟁과 동물원을 거치며 깊은 상처를 입은 노든이, 어린 펭귄을 푸른 바다로 데려가기 위해 험난한 사막과 긴긴밤을 건넙니다. 수많은 존재들의 숭고한 사랑과 희생으로 마침내 자신만의 바다에 도달하는 찬란한 생명의 연대를 노래한 감동 대작입니다.',
    coverEmoji: '🦏',
    coverColor: 'from-blue-600 to-indigo-900',
    status: 'available',
    totalCopies: 4,
    availableCopies: 3,
    recommendAge: '초등 4학년 ~ 중학생',
    tags: ['감동', '생명', '연대', '동행', '용기'],
    deepQuestions: [
      {
        question: '코뿔소 노든과 어린 펭귄이 서로 다른 모습임에도 깊은 가족이 될 수 있었던 이유는 무엇일까요?',
        focus: '도덕적판단'
      }
    ],
    sampleQuizzes: [
      {
        question: '마지막 남은 흰바위코뿔소의 이름은 무엇인가요?',
        options: ['노든', '앙가부', '치쿠'],
        answerIndex: 0,
        explanation: '주인공 코뿔소의 이름은 노든입니다.'
      }
    ]
  },
  {
    id: 'book-6',
    isbn: '9791161571188',
    title: '불편한 편의점 1',
    author: '김호연',
    publisher: '나무옆의자',
    publishYear: 2021,
    price: 14000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9791161571188',
    category: '문학/동화',
    targetLevel: 'middle',
    callNumber: '813.7-김94ㅂ',
    location: '중등문학 B-02',
    summary: '서울 청파동 골목 모퉁이에 자리 잡은 낡고 불편한 ALWAYS 편의점. 지갑을 잃어버린 70대 전직 교사 염 여사는 자신의 지갑을 지켜준 노숙인 \'독고\'에게 야간 아르바이트 자리를 제안합니다. 말도 어눌하고 잃어버린 기억 속에 갇혀 있던 독고가 편의점을 오가는 지친 이웃들(취준생, 고단한 가장, 갈등을 겪는 모자 등)의 사연을 따뜻하게 들어주고 온기를 건네며, 편의점은 사람들의 상처를 치유하는 기적과 위로의 공간으로 탈바꿈합니다.',
    coverEmoji: '🏪',
    coverColor: 'from-amber-600 to-yellow-800',
    status: 'available',
    totalCopies: 4,
    availableCopies: 2,
    recommendAge: '초등 6학년 ~ 중학생',
    tags: ['힐링', '이웃', '감동', '인간관계'],
    deepQuestions: [
      {
        question: '독고 씨의 따뜻한 관심이 편의점을 찾는 이웃들의 삶을 어떻게 바꾸어 놓았나요?',
        focus: '인물심리'
      }
    ],
    sampleQuizzes: [
      {
        question: '소설 속 작은 편의점의 야간 알바생으로 일하게 된 주인공의 이름은?',
        options: ['독고', '만수', '철수'],
        answerIndex: 0,
        explanation: '기억을 잃은 노숙인 출신의 독고 씨가 야간 알바생으로 일하며 이웃들을 치유합니다.'
      }
    ]
  },
  {
    id: 'book-7',
    isbn: '9788949110271',
    title: '강아지 똥',
    author: '권정생 글 / 정승각 그림',
    publisher: '길벗어린이',
    publishYear: 1996,
    price: 11000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788949110271.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788949110271',
    category: '문학/동화',
    targetLevel: 'elem_low',
    callNumber: '813.8-권74ㄱ',
    location: '초등그림책 A-01',
    summary: '길가에 버려져 참새, 흙덩이 등 모두에게 더럽다고 놀림받던 강아지 똥. 자신이 세상에 아무 쓸모도 없는 존재라며 슬퍼하던 중, 봄비 속에서 노란 민들레 싹을 만납니다. 민들레 꽃을 아름답게 피우기 위해 기꺼이 자신의 몸을 녹여 거름이 되는 강아지 똥의 숭고한 사랑과 생명의 고귀한 가치를 전하는 한국 대표 그림책입니다.',
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
    id: 'book-8',
    isbn: '9788936458515',
    title: '만복이네 떡집',
    author: '김리리 글 / 이승현 그림',
    publisher: '비룡소',
    publishYear: 2010,
    price: 11000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936458515.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936458515',
    category: '문학/동화',
    targetLevel: 'elem_low',
    callNumber: '813.8-김28ㅁ',
    location: '초등문학 A-05',
    summary: '마음과 달리 입만 열면 나쁜 말과 심술을 부려 외톨이가 된 초등학생 만복이. 어느 날 길모퉁이에서 착한 일과 칭찬, 웃음으로만 값을 치를 수 있는 신비한 떡집을 발견합니다. 찹쌀떡, 꿀떡 등 신비한 마법 떡을 먹으며 친구의 마음을 이해하고 고운 말을 사용하는 따뜻한 아이로 변해가는 인기 베스트셀러 창작동화입니다.',
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
    id: 'book-9',
    isbn: '9788934986706',
    title: '코스모스 (청소년을 위한)',
    author: '칼 세이건',
    publisher: '사이언스북스',
    publishYear: 2021,
    price: 18000,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788934986706.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788934986706',
    category: '과학/우주',
    targetLevel: 'middle',
    callNumber: '440-세68ㅋ',
    location: '과학 B-07',
    summary: '광대한 우주의 탄생과 별의 진화, 지구와 인류의 기원을 감동적으로 탐구한 20세기 최고의 과학 교양서. 칼 세이건 특유의 시적이고 인문학적인 통찰을 통해 우리 인간이 모두 우주의 별먼지(Stardust)에서 비롯되었음을 일깨우며, 하나뿐인 보금자리 지구의 소중함을 역설합니다.',
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
    id: 'book-10',
    isbn: '9788954685320',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    publisher: '팩토리나인',
    publishYear: 2020,
    price: 13800,
    coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788954685320.jpg',
    yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788954685320',
    category: '판타지/모험',
    targetLevel: 'elem_high',
    callNumber: '813.7-이38ㄷ',
    location: '청소년/어린이 판타지 D-01',
    summary: '잠들어야만 입장할 수 있는 신비로운 마을의 중심, 온갖 꿈을 파는 \'달러구트 꿈 백화점\'. 하늘을 나는 꿈, 좋아하던 사람을 만나는 꿈, 그리고 과거의 아픔을 극복하게 해주는 악몽까지. 손님들이 꿈을 꾼 후 느끼는 감정으로 값을 치르는 독특한 세계관 속에서 지친 현대인들의 마음을 따뜻하게 안아주는 힐링 판타지 소설입니다.',
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
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    barcode: 'STU-2026-0001',
    name: '김민준',
    birthDate: '0512',
    grade: '초등 5학년',
    schoolName: '별빛초등학교',
    role: 'student',
    avatarEmoji: '🦊',
    readingPoints: 480,
    level: 3,
    totalBooksRead: 14,
    activeLoansCount: 1,
    maxLoans: 3,
    badges: [
      { id: 'b1', name: '첫 독서 시작', icon: '🌱', description: '첫 번째 도서를 대출했습니다.', unlockedAt: '2025-03-02' },
      { id: 'b2', name: '과학 탐험가', icon: '🚀', description: '과학/우주 도서를 5권 이상 완독했습니다.', unlockedAt: '2025-05-18' }
    ],
    joinedAt: '2025-03-02'
  },
  {
    id: 'mem-2',
    barcode: 'STU-2026-0002',
    name: '이서아',
    birthDate: '1103',
    grade: '초등 2학년',
    schoolName: '별빛초등학교',
    role: 'student',
    avatarEmoji: '🐰',
    readingPoints: 890,
    level: 5,
    totalBooksRead: 32,
    activeLoansCount: 2,
    maxLoans: 5,
    badges: [
      { id: 'b1', name: '첫 독서 시작', icon: '🌱', description: '첫 번째 도서를 대출했습니다.', unlockedAt: '2025-04-10' },
      { id: 'b3', name: '다독왕', icon: '👑', description: '30권 이상 완독했습니다.', unlockedAt: '2025-09-01' }
    ],
    joinedAt: '2025-04-10'
  },
  {
    id: 'mem-3',
    barcode: 'TEA-2026-0001',
    name: '김수진',
    birthDate: '0315',
    grade: '사서교사',
    schoolName: '별빛 작은도서관',
    role: 'admin',
    avatarEmoji: '👩‍🏫',
    readingPoints: 2400,
    level: 10,
    totalBooksRead: 120,
    activeLoansCount: 0,
    maxLoans: 10,
    badges: [
      { id: 'b-master', name: '마스터 사서', icon: '⭐', description: '도서관 총괄 운영자', unlockedAt: '2025-01-01' }
    ],
    joinedAt: '2025-01-01'
  }
];
