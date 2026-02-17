## YANSO's Blog
http://yanlog.yanbert.com

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 새 포스트 작성

```bash
npm run new:post <slug> [locale]
```

- `slug`: 포스트 식별자 (필수) - `{slug}-{yyyymmdd}` 형식 필수
- `locale`: `ko` (기본) 또는 `en`

예시:
```bash
npm run new:post my-first-post-20260126        # 한국어 포스트
npm run new:post my-first-post-20260126 en     # 영어 포스트
```

`draft: true` 상태로 생성되며, 발행 시 `draft` 필드를 제거하거나 `false`로 변경하세요.

## RSS Feeds

구독하여 새 글을 자동으로 받아보세요!

### 전체 블로그 피드
- 한국어: https://yanlog.yanbert.com/ko/rss.xml
- 영어: https://yanlog.yanbert.com/en/rss.xml

### 태그별 피드
- AWS (한국어): https://yanlog.yanbert.com/ko/tag/aws/rss.xml
- Kiro (한국어): https://yanlog.yanbert.com/ko/tag/kiro/rss.xml
- 기타 태그: `https://yanlog.yanbert.com/{locale}/tag/{tag}/rss.xml`

Feedly, Inoreader, NetNewsWire 등 모든 RSS 리더에서 구독 가능합니다.