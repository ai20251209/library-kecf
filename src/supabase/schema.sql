-- ==============================================================================
-- 별빛 북스페이스 (Starry BookSpace) - 작은도서관 LMS Supabase PostgreSQL Schema
-- 지원: 도서 10,000권, 회원 3,000명, AI 벡터 검색(pgvector) 및 실시간 대출/반납
-- ==============================================================================

-- 1. 확장 기능 활성화 (UUID 및 벡터 검색)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- AI RAG 시맨틱 검색용

-- 2. 도서 테이블 (Books) - 10,000권 규모
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publish_year INT,
    category VARCHAR(50) NOT NULL,
    target_level VARCHAR(20) NOT NULL CHECK (target_level IN ('elem_low', 'elem_high', 'middle')),
    call_number VARCHAR(50) NOT NULL,
    location VARCHAR(100),
    summary TEXT,
    cover_emoji VARCHAR(10) DEFAULT '📚',
    cover_color VARCHAR(100) DEFAULT 'from-blue-500 to-indigo-700',
    cover_url TEXT,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'borrowed', 'reserved')),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    recommend_age VARCHAR(50),
    tags TEXT[],
    deep_questions JSONB DEFAULT '[]'::jsonb,
    sample_quizzes JSONB DEFAULT '[]'::jsonb,
    embedding vector(768), -- Gemini Text Embedding (RAG 도서 추천용)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 검색 인덱스 (도서명, 저자, ISBN)
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books (title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books (author);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON public.books (isbn);
CREATE INDEX IF NOT EXISTS idx_books_level ON public.books (target_level);

-- 3. 회원 테이블 (Members) - 3,000명 규모
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barcode VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    school_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_emoji VARCHAR(10) DEFAULT '🦊',
    reading_points INT DEFAULT 0,
    level INT DEFAULT 1,
    total_books_read INT DEFAULT 0,
    active_loans_count INT DEFAULT 0,
    max_loans INT DEFAULT 5,
    badges JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_members_barcode ON public.members (barcode);

-- 4. 대출 및 반납 기록 (Loans)
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    book_title VARCHAR(255) NOT NULL,
    book_category VARCHAR(50),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    member_name VARCHAR(100) NOT NULL,
    member_barcode VARCHAR(50) NOT NULL,
    borrowed_at DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
    returned_at DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_member ON public.loans (member_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON public.loans (status);

-- 5. 독서 기록 및 AI 코칭 피드백 (Reading Logs)
CREATE TABLE IF NOT EXISTS public.reading_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    book_title VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT NOT NULL,
    ai_feedback JSONB,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 6. AI 북버디 대화 로그 (AI Conversations)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL,
    user_prompt TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    is_simulated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 자동 대출 권수 카운팅 트리거 (PostgreSQL Function & Trigger)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_loan_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- 대출 시: 도서 대출 가능 권수 -1, 회원 대출 수 +1
        UPDATE public.books
        SET available_copies = GREATEST(0, available_copies - 1),
            status = CASE WHEN available_copies - 1 <= 0 THEN 'borrowed' ELSE 'available' END
        WHERE id = NEW.book_id;

        UPDATE public.members
        SET active_loans_count = active_loans_count + 1
        WHERE id = NEW.member_id;

    ELSIF (TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'returned') THEN
        -- 반납 시: 도서 대출 가능 권수 +1, 회원 완독 수 +1 및 포인트 +30
        UPDATE public.books
        SET available_copies = LEAST(total_copies, available_copies + 1),
            status = 'available'
        WHERE id = NEW.book_id;

        UPDATE public.members
        SET active_loans_count = GREATEST(0, active_loans_count - 1),
            total_books_read = total_books_read + 1,
            reading_points = reading_points + 30,
            level = LEAST(10, FLOOR((reading_points + 30) / 100) + 1)
        WHERE id = NEW.member_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_loan_sync
AFTER INSERT OR UPDATE OF status ON public.loans
FOR EACH ROW
EXECUTE FUNCTION public.handle_loan_transaction();
