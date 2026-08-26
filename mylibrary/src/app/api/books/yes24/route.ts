import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SERIES_MASTER_DB: Record<string, any[]> = {
  '와니니': [
    {
      id: 'yes24-1',
      title: '푸른 사자 와니니 1',
      author: '이현 글 / 오윤화 그림',
      publisher: '창비',
      publishYear: 2015,
      isbn: '9788936442804',
      price: 10800,
      coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936442804.jpg',
      yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936442804',
      category: '문학/동화',
      summary: '세렝게티 초원의 마디바 사자 무리에서 가장 작고 약하게 태어난 어린 암사자 와니니. 무리의 규칙을 어겼다는 억울한 오해를 받고 홀로 거친 초원에 쫓겨납니다. 굶주림과 하이에나, 거대한 수사자들의 위협 속에서 와니니는 자신처럼 무리에서 밀려난 외톨이 친구들(아산테, 잠보, 말라피)을 만나 작은 무리를 이룹니다. 서로의 약점을 감싸 안으며 초원의 사계절을 버텨내고 마침내 스스로의 힘으로 진정한 용기와 연대의 가치를 증명해내는 대한민국 대표 아동문학 성장 걸작입니다.',
    },
    {
      id: 'yes24-2',
      title: '푸른 사자 와니니 2 : 검은 무리의 침입',
      author: '이현 글 / 오윤화 그림',
      publisher: '창비',
      publishYear: 2019,
      isbn: '9788936442996',
      price: 10800,
      coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936442996.jpg',
      yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936442996',
      category: '문학/동화',
      summary: '세렝게티의 평화를 위협하는 거대한 검은 사자 무리가 영토를 침범해 오면서 와니니 무리는 새로운 위기에 직면합니다. 초원의 오랜 지혜를 지키고 약한 동물들과 힘을 합쳐 위협에 맞서는 와니니의 지혜와 우정이 한층 더 깊어집니다.',
    },
    {
      id: 'yes24-3',
      title: '푸른 사자 와니니 3 : 맹수들의 밤',
      author: '이현 글 / 오윤화 그림',
      publisher: '창비',
      publishYear: 2021,
      isbn: '9788936443153',
      price: 10800,
      coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936443153.jpg',
      yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936443153',
      category: '문학/동화',
      summary: '가뭄과 굶주림이 초원을 덮치고 밤마다 맹수들의 처절한 생존 경쟁이 벌어집니다. 와니니 무리는 서로를 향한 굳건한 믿음으로 어둠의 공포를 이겨내며, 초원에서 가장 약했던 존재들이 어떻게 가장 단단한 연대를 이루는지 보여줍니다.',
    }
  ],
  '마당을 나온 암탉': [
    {
      id: 'yes24-m1',
      title: '마당을 나온 암탉',
      author: '황선미 글 / 김환영 그림',
      publisher: '사계절',
      publishYear: 2000,
      isbn: '9788971968710',
      price: 11000,
      coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788971968710.jpg',
      yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788971968710',
      category: '문학/동화',
      summary: '양계장 좁은 철장에 갇혀 알만 낳던 암탉 \'잎싹\'. 자신의 알을 직접 품어 병아리를 탄생시키겠다는 간절한 소망을 품고 마당을 탈출합니다. 숲속에서 버려진 청둥오리 알을 품어 아기 오리 \'초록머리\'를 낳아 기르며, 천적 족제비의 위협 속에서 목숨을 바쳐 자식을 지켜냅니다. 모성애와 자유, 그리고 자연의 순환에 대한 깊은 철학적 울림을 전하는 대한민국 아동문학의 불멸의 고전입니다.',
    }
  ],
  '아몬드': [
    {
      id: 'yes24-a1',
      title: '아몬드 (Almond)',
      author: '손원평',
      publisher: '창비',
      publishYear: 2017,
      isbn: '9788936434267',
      price: 12000,
      coverUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434267.jpg',
      yes24Url: 'https://www.yes24.com/Product/Search?domain=BOOK&query=9788936434267',
      category: '문학/소설',
      summary: '뇌 속 편도체(아몬드) 크기가 작아 분노도 공포도 느끼지 못하는 알렉시티미아(감정표현불능증)를 앓는 16세 소년 윤재. 비극적인 사고로 가족을 잃고 세상에 홀로 남겨진 윤재 앞에, 어두운 상처로 가득 찬 소년 \'곤이\'와 맑은 영혼의 소녀 \'도라\'가 나타납니다. 서로의 결핍을 마주하며 타인의 고통에 공감하는 법을 배워가는 뭉클한 청소년 필독 성장 소설입니다.',
    }
  ]
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || searchParams.get('query') || '').trim();

    if (!query) {
      return NextResponse.json({ success: true, items: [] });
    }

    const cleanQuery = query.replace(/\s+/g, '').toLowerCase();

    // 1. Series Master DB Check
    for (const [key, bookList] of Object.entries(SERIES_MASTER_DB)) {
      const cleanKey = key.replace(/\s+/g, '').toLowerCase();
      if (cleanQuery.includes(cleanKey) || cleanKey.includes(cleanQuery)) {
        return NextResponse.json({
          success: true,
          query,
          count: bookList.length,
          items: bookList,
        });
      }
    }

    // 2. Fetch Live YES24 Search (Scraping Fallback)
    const targetUrl = `https://www.yes24.com/Product/Search?domain=BOOK&query=${encodeURIComponent(query)}`;
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: true, items: [] });
    }

    const html = await res.text();
    const items: any[] = [];
    const itemBlockRegex = /<li\s+data-goods-no="(\d+)"[\s\S]*?<\/li>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemBlockRegex.exec(html)) !== null && items.length < 8) {
      const block = match[0];
      const goodsNo = match[1];

      const titleMatch = /<a[^>]*class="gd_name"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

      const authorMatch = /<span class="info_auth">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      const author = authorMatch ? authorMatch[1].replace(/<[^>]+>/g, '').trim() : '저자 미상';

      const pubMatch = /<span class="info_pub">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      const publisher = pubMatch ? pubMatch[1].replace(/<[^>]+>/g, '').trim() : '출판사';

      const priceMatch = /<strong class="txt_num">([\d,]+)<\/strong>원/i.exec(block);
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 12000;

      const imgMatch = /<img[^>]+class="lazy"[^>]+data-original="([^"]+)"/i.exec(block) || /<img[^>]+src="([^"]+)"/i.exec(block);
      let coverUrl = imgMatch ? imgMatch[1] : '';
      if (coverUrl.startsWith('//')) coverUrl = 'https:' + coverUrl;

      if (title) {
        items.push({
          id: `yes24-live-${goodsNo}`,
          title,
          author,
          publisher,
          price,
          coverUrl,
          yes24Url: `https://www.yes24.com/Product/Goods/${goodsNo}`,
          category: '문학/소설',
          summary: `《${title}》의 실시간 YES24 공식 서지정보입니다.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      query,
      count: items.length,
      items,
    });
  } catch (error: any) {
    console.error('YES24 Search API Error:', error);
    return NextResponse.json({ success: false, error: error.message, items: [] }, { status: 500 });
  }
}
