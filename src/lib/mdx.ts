import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostFrontmatter, PostMeta, Locale } from '@/types/post';

const CONTENT_DIR = path.join(process.cwd(), 'content/posts');
const PAGES_DIR = path.join(process.cwd(), 'content/pages');

// MDX 파일 파싱
export function parseFile(filePath: string): Post {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  
  const frontmatter = data as PostFrontmatter;
  
  return {
    frontmatter,
    content,
    slug: frontmatter.slug,
  };
}

// 페이지 파일 읽기 (about 등)
export function getPageContent(pageName: string, locale: Locale): string | null {
  const filePath = path.join(PAGES_DIR, locale, `${pageName}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  
  return content;
}

// 특정 언어의 모든 포스트 가져오기
export function getAllPosts(locale: Locale): PostMeta[] {
  const localeDir = path.join(CONTENT_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx'));
  
  const posts = files.map(file => {
    const filePath = path.join(localeDir, file);
    const { frontmatter } = parseFile(filePath);
    
    return {
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.description,
      tags: frontmatter.tags,
      image: frontmatter.image,
      slug: frontmatter.slug,
      locale: frontmatter.locale,
      draft: frontmatter.draft,
    };
  });
  
  // draft가 true인 포스트 필터링 (기본값: false)
  const publishedPosts = posts.filter(post => post.draft !== true);
  
  // 날짜 기준 내림차순 정렬
  return publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// slug로 특정 포스트 가져오기
export function getPostBySlug(slug: string, locale: Locale): Post | null {
  const localeDir = path.join(CONTENT_DIR, locale);
  
  if (!fs.existsSync(localeDir)) {
    return null;
  }
  
  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(localeDir, file);
    const post = parseFile(filePath);
    
    if (post.slug === slug) {
      return post;
    }
  }
  
  return null;
}

// 모든 slug 가져오기 (정적 경로 생성용)
export function getAllSlugs(locale: Locale): string[] {
  const posts = getAllPosts(locale);
  return posts.map(post => post.slug);
}

// 번역된 버전이 있는지 확인
export function hasTranslation(slug: string, targetLocale: Locale): boolean {
  return getPostBySlug(slug, targetLocale) !== null;
}

// 컬렉션 관련 타입
export interface CollectionMeta {
  slug: string;
  postCount: number;
  latestDate: string;
}

// collections.json 타입
type CollectionsData = {
  [slug: string]: {
    ko: { name: string; description: string };
    en: { name: string; description: string };
    posts: string[]; // 순서대로 나열된 slug 배열
  };
};

const COLLECTIONS_FILE = path.join(process.cwd(), 'data/collections.json');

function loadCollectionsData(): CollectionsData {
  if (!fs.existsSync(COLLECTIONS_FILE)) return {};
  return JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf-8')) as CollectionsData;
}

// 특정 컬렉션에 속한 포스트 가져오기 (collections.json 배열 순서 기준)
export function getPostsByCollection(collectionSlug: string, locale: Locale): PostMeta[] {
  const data = loadCollectionsData();
  const collection = data[collectionSlug];
  if (!collection) return [];

  const allPosts = getAllPosts(locale);
  const postMap = new Map(allPosts.map(p => [p.slug, p]));

  return collection.posts
    .map(slug => postMap.get(slug))
    .filter((p): p is PostMeta => p !== undefined);
}

// 해당 locale의 모든 컬렉션 목록 가져오기
export function getAllCollections(locale: Locale): CollectionMeta[] {
  const data = loadCollectionsData();
  const allPosts = getAllPosts(locale);
  const postMap = new Map(allPosts.map(p => [p.slug, p]));

  return Object.entries(data).map(([slug, collection]) => {
    const posts = collection.posts
      .map(s => postMap.get(s))
      .filter((p): p is PostMeta => p !== undefined);

    const latestDate = posts.length > 0
      ? posts.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date
      : '';

    return { slug, postCount: posts.length, latestDate };
  }).filter(c => c.postCount > 0);
}

// 모든 컬렉션 slug 가져오기 (정적 경로 생성용)
export function getAllCollectionSlugs(locale: Locale): string[] {
  return getAllCollections(locale).map(c => c.slug);
}
