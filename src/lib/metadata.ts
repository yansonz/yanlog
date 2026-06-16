import { Metadata } from 'next';
import { PostFrontmatter, Locale } from '@/types/post';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yanlog.yanbert.com';
const SITE_NAME = "YAN SO's Blog";
const AUTHOR_NAME = "YAN SO";
const AUTHOR_URL = `${BASE_URL}/ko/about`;

// MDX 콘텐츠에서 첫 번째 이미지 URL 추출
export function extractFirstImage(content: string): string | null {
  // ![alt](url) 형식
  const mdImageMatch = content.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  if (mdImageMatch) return mdImageMatch[1];

  // <img src="url" /> 형식
  const htmlImageMatch = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/);
  if (htmlImageMatch) return htmlImageMatch[1];

  return null;
}

interface GenerateMetadataOptions {
  title: string;
  description: string;
  locale: Locale;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  tags?: string[];
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path = '',
  image,
  type = 'website',
  publishedTime,
  tags,
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/og-image.png`;
  
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${BASE_URL}/ko${path.replace(`/${locale}`, '')}`,
        en: `${BASE_URL}/en${path.replace(`/${locale}`, '')}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime && {
        publishedTime,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generatePostMetadata(
  frontmatter: PostFrontmatter,
  locale: Locale,
  image?: string
): Metadata {
  return generatePageMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    locale,
    path: `/${locale}/blog/${frontmatter.slug}`,
    image: image ?? frontmatter.image,
    type: 'article',
    publishedTime: frontmatter.date,
    tags: frontmatter.tags,
  });
}

// ─── JSON-LD Structured Data ────────────────────────────────────────────────

/** 사이트 전체 WebSite 스키마 (홈/루트 레이아웃용) */
export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: "기술 관련 글과 좋아하는 활동을 아카이빙하기 위한 공간입니다.",
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    inLanguage: ['ko', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/ko/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** 블로그 포스트 BlogPosting 스키마 */
export function generateBlogPostingJsonLd(
  frontmatter: PostFrontmatter,
  locale: Locale,
  image?: string
) {
  const url = `${BASE_URL}/${locale}/blog/${frontmatter.slug}`;
  const ogImage = image || frontmatter.image || `${BASE_URL}/og-image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    url,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    image: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: frontmatter.tags?.join(', '),
  };
}

/** 포스트 상세 페이지 BreadcrumbList 스키마 */
export function generatePostBreadcrumbJsonLd(
  title: string,
  slug: string,
  locale: Locale
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'ko' ? '홈' : 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'ko' ? '블로그' : 'Blog',
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${BASE_URL}/${locale}/blog/${slug}`,
      },
    ],
  };
}

/** 컬렉션 상세 페이지 ItemList + BreadcrumbList 스키마 */
export function generateCollectionJsonLd(
  collectionSlug: string,
  collectionName: string,
  collectionDescription: string,
  posts: Array<{ slug: string; title: string }>,
  locale: Locale
) {
  const collectionUrl = `${BASE_URL}/${locale}/collection/${collectionSlug}`;

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: collectionName,
    description: collectionDescription,
    url: collectionUrl,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.title,
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'ko' ? '홈' : 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'ko' ? '컬렉션' : 'Collections',
        item: `${BASE_URL}/${locale}/collection`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: collectionName,
        item: collectionUrl,
      },
    ],
  };

  return { itemList, breadcrumb };
}
