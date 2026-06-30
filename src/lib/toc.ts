// Table of Contents 생성 유틸리티

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Markdown 콘텐츠에서 헤딩 추출
export function extractHeadings(content: string): TocItem[] {
  // 코드 블록 내부의 내용을 제거하여 heading으로 오인하지 않도록 함
  const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
  
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ id, text, level });
  }
  
  return headings;
}

// 슬러그 생성 (rehype-slug와 동일한 방식)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-');
}
