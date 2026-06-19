---
name: insert-image-to-post
description: 블로그 포스트 MDX 본문에 이미지를 삽입할 때 사용. figure/figcaption 형식, alt 텍스트 작성 규칙 포함.
---

# 블로그 포스트 이미지 삽입 가이드

## 삽입 형식

MDX 본문에 이미지를 삽입할 때는 반드시 아래 형식을 사용한다:

```mdx
<figure>

![alt 텍스트](이미지 URL)
<figcaption>캡션 텍스트</figcaption>

</figure>
```

## 예시

```mdx
<figure>

![AWS Summit Seoul 2026 키노트에 등장한 민태님](https://images.yanbert.com/yanlog/images/kiro-user-interview-004-20260616/2026-06-17_13-35-02.webp)
<figcaption>AWS Summit Seoul 2026 키노트에 등장한 민태님</figcaption>

</figure>
```

## 규칙

- `<figure>` 태그 안에서 `![...]()` 이미지와 `<figcaption>`은 각각 별도 줄에 작성한다
- `<figure>` 여는 태그 다음과 `</figure>` 닫는 태그 전에 빈 줄을 추가한다
- alt 텍스트와 figcaption 텍스트는 동일하게 작성한다
- 캡션이 없는 경우 `<figcaption>`을 생략하고 `<figure>` 형식으로 작성한다
- 이미지 URL은 반드시 `https://images.yanbert.com` 호스팅 URL을 사용한다 (로컬 경로 사용 금지)
- 이미지 형식은 WebP를 사용한다
