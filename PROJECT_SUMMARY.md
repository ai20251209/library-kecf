# 🌟 별빛 북스페이스 (Starry BookSpace) - AI 스마트 작은도서관 LMS 구축 및 기능 종합 보고서

---

## 📌 1. 프로젝트 개요

* **프로젝트명**: 별빛 북스페이스 (Starry BookSpace)
* **목적**: 초·중학생, 교사, 학부모/지역주민을 위한 차세대 AI 독서 메이트 & 10,000권/3,000명 규모의 작은도서관 LMS(Library Management System)
* **설계 규모**:
  * 📚 **소장 도서**: 약 10,000권 규모 (초·중등 문학, 과학, 역사, 판타지, 철학, 그림책 등)
  * 👥 **이용 회원**: 약 3,000명 규모 (학생 65%, 교사 10%, 학부모/지역주민 25%)
  * 🤖 **AI 심층 질의**: Google 최신 **`gemini-3.6-flash` / `gemini-3.5-flash`** 기반 3단계 연령별 맞춤 멘토링

---

## 🚀 2. 라이브 서비스 및 클라우드 인프라 구성

| 구성 요소 | 연결 주소 및 정보 | 역할 |
| :--- | :--- | :--- |
| **공식 라이브 웹사이트** | [https://library-kecf.vercel.app](https://library-kecf.vercel.app) | 실시간 웹 서비스 (학생/교사/일반/사서 접속) |
| **GitHub 코드 저장소** | [https://github.com/ai20251209/library-kecf](https://github.com/ai20251209/library-kecf) | 소스코드 버전 관리 및 CI/CD 자동 무중단 배포 |
| **클라우드 호스팅** | **Vercel (Serverless)** | 초고속 글로벌 CDN, SSL 보안(HTTPS) 무중단 호스팅 |
| **클라우드 데이터베이스** | **Supabase (PostgreSQL - Seoul Region)** | 도서/회원/대출 영구 저장 및 자동 카운팅 트리거 연동 |
| **인공지능 엔진** | **Google `gemini-3.6-flash` + 스마트 시뮬레이션** | 실시간 초고속 연령별 사고력 확장 대화 & 퀴즈 생성 |

---

## 🌟 3. 주요 구현 기능 상세 명세

### 1) [학생 · 교사 · 학부모/일반주민] 통합 회원 로그인
* **이름 + 생년월일 4자리(MMDD) 간편 로그인**:
  * 복잡한 영문 아이디를 외울 필요 없이 본인 **이름**과 **생일 4자리(예: 8월 1일생은 `0801`)**로 즉시 접속
  * 타인의 회원 명부가 로그인 창에 노출되지 않도록 **개인정보 보호 완벽 적용**
* **회원 바코드 로그인**: 실물 회원증이나 모바일 바코드(`STU-2026-XXXX`, `TEA-2026-XXXX`) 번호로 1초 로그인

### 2) 학생 맞춤형 AI 독서 메이트 (북버디, BookBuddy)
* **3단계 눈높이 맞춤형 페르소나**:
  * 🐣 **초등 저학년 (1~3학년)**: 마법요정 '퐁퐁이' (쉬운 어휘, 친근한 이모지, 따뜻한 칭찬)
  * 🚀 **초등 고학년 (4~6학년)**: 탐험가 '루카' ("만약 내가 주인공이었다면?", 인물 심리 탐구)
  * 🦉 **중학생 (1~3학년)**: 멘토 '아테나' (문학적 상징, 역사적 배경, 사회적 딜레마 비판적 토론)
* **생각 확장 심층 질문 칩**: 인물심리, 도덕적판단, 창의적확장 등 원클릭 토론 시작
* **3단계 독서 퀴즈 챌린지**: 정답 즉시 해설 및 컨페티(꽃가루) 축하 효과
* **AI 독후감 코칭**: 학생이 작성한 리뷰에 대해 칭찬과 생각거리 피드백 제공

### 3) 게이미피케이션 독서 통장 (Reading Passbook - `/my-library`)
* **개인 전용 공간**: 로그인한 회원 본인의 대출 도서, 반납 기한, 완독 이력만 단독 표시
* **독서 우주 나무 성장 시스템**: 완독할 때마다 시각적으로 성장 (새싹 🌱 → 줄기 🌿 → 꽃과 열매 🌸 → 별빛 거목 🌳✨)
* **독서 포인트 및 레벨업**: 대출/반납 시 권당 +30P 지급, Lv.1~10 마스터 랭킹
* **도전 뱃지 컬렉션**: '책벌레 꿈나무', '과학 마니아', 'AI 질문왕' 등 수집
* **모바일 회원증 바코드/QR**: 현장 도서관 스캔용 고유 바코드 카드 탑재

### 4) 작은도서관 사서 LMS (관리자 관제 - `/admin`)
* **사서 전용 비밀번호(PIN `1234`) 보안 잠금**:
  * 일반 회원의 관리자 화면 무단 접근 차단 및 마스터 PIN 인증 가드
  * 사서 업무 종료 시 **[관리자 잠금 (로그아웃)]** 및 **[비밀번호 변경]** 기능 탑재
* **1초 초고속 바코드 대출/반납 터미널**: 회원 바코드와 도서 ISBN 입력 시 즉시 처리
* **AI 도서 자동 등록 어시스턴트**: 도서명만 입력하면 줄거리, 한국십진분류(KDC) 청구기호, 서가위치, 권장학년, 심층질문, 퀴즈 자동 완성
* **소장 도서 및 회원 명부 관리**:
  * `[+ 신규 도서 등록]`: AI 자동완성 지원
  * `[+ 신규 회원 등록]`: 학생, 교사, 일반회원(학부모/주민), 사서 구분 등록 및 생년월일 4자리 비밀번호 자동 지정
  * 회원/도서별 `[수정]` 및 `[삭제]` 지원
  * 엑셀/CSV 일괄 내보내기 및 가져오기 지원

---

## 🤖 4. AI 모델 최적화 이력

* **최신 구글 Gemini 모델 적용**:
  * 1순위: **`gemini-3.6-flash`** (초고속 실시간 생성형 답변)
  * 2순위: **`gemini-3.5-flash`**
  * 3순위: **`gemini-3.0-flash`**
  * 4순위: **스마트 듀얼 시뮬레이션 엔진** (API 키가 없거나 통신 지연 시에도 100% 정상 응답)

---

## 🛠️ 5. 기술 스택 & 디렉토리 구조

* **Frontend**: Next.js 14 (App Router), React 18, TypeScript
* **Styling**: Tailwind CSS, Lucide React 아이콘, Canvas Confetti
* **Database & BaaS**: Supabase PostgreSQL, pgvector, SQL Triggers

```
c:\libraqry_kecf\
├── src/
│   ├── app/
│   │   ├── page.tsx              # 메인 비주얼 홈 (일일 AI 퀘스트, 큐레이션)
│   │   ├── books/
│   │   │   ├── page.tsx          # 도서 통합 검색 (10,000권 규모, 분야/학년 필터)
│   │   │   └── [id]/page.tsx     # 도서 상세, AI 북버디 대화, 독서 퀴즈, 독후평 코칭
│   │   ├── ai-lounge/page.tsx    # AI 자유 독서 라운지 (테마별 생각 탐구)
│   │   ├── my-library/page.tsx   # 개인 독서통장, 독서 우주나무, 모바일 바코드증
│   │   ├── admin/
│   │   │   ├── layout.tsx        # 사서 전용 PIN (1234) 보안 잠금 레이아웃
│   │   │   ├── page.tsx          # 사서 대시보드 (1초 바코드 대출/반납 터미널)
│   │   │   ├── books/page.tsx    # 도서 등록/수정/삭제, AI 메타데이터 자동완성
│   │   │   └── members/page.tsx  # 3,000명 회원 명부(학생/교사/일반) 및 통계
│   │   └── api/ai/
│   │       ├── chat/route.ts     # gemini-3.6-flash AI 스트리밍 대화 엔드포인트
│   │       └── metadata/route.ts # gemini-3.6-flash AI 도서 메타데이터 자동생성
│   ├── components/
│   │   ├── Navbar.tsx            # 통합 네비게이션 & 관리자 잠금 인디케이터
│   │   ├── AdminGuard.tsx        # 사서 PIN 인증 및 비밀번호 관리 컴포넌트
│   │   ├── StudentLoginModal.tsx # 이름+생년월일 / 바코드 통합 로그인 모달
│   │   ├── BookCard.tsx          # 비주얼 도서 카드 및 원클릭 대출
│   │   ├── AIChatBot.tsx         # 연령별 AI 챗봇 컴포넌트
│   │   └── ReadingTree.tsx       # 독서 우주나무 성장 시각화
│   ├── data/sampleBooks.ts       # 초/중등 필독서 50+권 정밀 샘플 데이터
│   ├── lib/
│   │   ├── auth.ts               # 사서 마스터 PIN 인증 및 변경 핸들러
│   │   ├── db.ts                 # 대출/반납 트랜잭션 및 로컬 영속화 핸들러
│   │   ├── gemini.ts             # Gemini AI 프롬프트 엔지니어링 엔진
│   │   └── types.ts              # 도서/회원/대출 TypeScript 타입 정의
│   └── supabase/
│       └── schema.sql            # Supabase PostgreSQL DDL 스키마 & 트리거
├── .env.local                    # Supabase 환경 변수 설정
├── PROJECT_SUMMARY.md            # 프로젝트 종합 보고서
├── package.json
└── README.md
```

---

## ⚙️ 6. 환경 변수 (Environment Variables) 설정값

Vercel 및 로컬(`.env.local`)에 등록된 환경 변수:

```env
# Supabase 클라우드 데이터베이스
NEXT_PUBLIC_SUPABASE_URL=https://rhnfwcpqzldmcfjpzmup.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jF0KO3kybc45m-QVX9Lieg_2qozzSCC

# (선택) Google Gemini API Key 및 모델
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-3.6-flash
```

---

## 💻 7. 운영 및 유지보수 가이드

### 1) 로컬 개발 서버 실행
```bash
npm run dev
# 브라우저 접속: http://localhost:3000
```

### 2) 사서 관리자 기본 접속 정보
* **관리자 페이지**: `/admin`
* **기본 마스터 비밀번호 (PIN)**: `1234` (관리자 화면에서 언제든지 변경 가능)

### 3) 코드 수정 후 배포 업데이트
로컬에서 파일을 수정한 뒤 Git 푸시만 하면 Vercel이 30초 내로 자동 배포합니다:
```bash
git add .
git commit -m "update: 도서관 기능 개선"
git push origin main
```
