#!/usr/bin/env node

/**
 * 새 블로그 포스트 생성 스크립트
 * 사용법: node scripts/new-post.js <slug> [locale]
 * 예시: node scripts/new-post.js my-new-post ko
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const slug = args[0];
const locale = args[1] || 'ko';

if (!slug) {
  console.error('❌ slug를 입력해주세요.');
  console.log('사용법: node scripts/new-post.js <slug> [locale]');
  console.log('예시: node scripts/new-post.js my-new-post-20260126 ko');
  process.exit(1);
}

// slug 형식 검증: {slug}-{yyyymmdd}
const slugPattern = /^[a-z0-9-]+-\d{8}$/;
if (!slugPattern.test(slug)) {
  console.error('❌ slug 형식이 올바르지 않습니다.');
  console.log('규칙: {slug}-{yyyymmdd}');
  console.log('예시: my-new-post-20260126');
  process.exit(1);
}

if (!['ko', 'en'].includes(locale)) {
  console.error('❌ locale은 ko 또는 en만 가능합니다.');
  process.exit(1);
}

const dateMatch = slug.match(/(\d{4})(\d{2})(\d{2})$/);
const today = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
const fileName = `${slug}.mdx`;
const filePath = path.join(process.cwd(), 'content/posts', locale, fileName);

// 파일 존재 여부 확인
if (fs.existsSync(filePath)) {
  console.error(`❌ 이미 존재하는 파일입니다: ${filePath}`);
  process.exit(1);
}

const template = `---
title: ""
date: "${today}"
description: ""
tags: []
locale: "${locale}"
slug: "${slug}"
draft: true
---

여기에 내용을 작성하세요.
`;

// 디렉토리 확인 및 생성
const dir = path.dirname(filePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(filePath, template, 'utf-8');

console.log(`✅ 새 포스트가 생성되었습니다: ${filePath}`);
console.log(`📝 draft: true 상태로 생성됨 (발행 시 draft 필드 제거 또는 false로 변경)`);
