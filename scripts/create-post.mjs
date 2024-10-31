import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../')

const formatDate = (date) => {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]
}

const createPost = (issueNumber, title, tags = '', summary = '', authors = []) => {
  const date = formatDate(new Date())
  const tagList = tags
    .split(',')
    .map((tag) => `'${tag.trim()}'`)
    .join(', ')
  const authorList =
    authors.length > 0
      ? `['default', ${authors.map((author) => `'${author.trim()}'`).join(', ')}]`
      : `['default']`

  const content = `---
title: '${title}'
date: '${date}'
lastmod: '${date}'
tags: [${tagList}]
summary: '${summary}'
authors: ${authorList}
draft: false
---

<!-- 이미지 업로드 시 가이드 -->
<!-- 1. \`public/static/blogs/${issueNumber}\`라는 폴더를 만들어주세요. ex)public/static/blogs/22 -->
<!-- 2. 이후 해당 페이지에 이미지를 업로드합니다. 이미지 제목은 상관 없어요 -->
<!-- 3. 마크다운에서 사용 시 ![이미지_파일_ALT_텍스트](/static/blog/이미지_파일명.png) -->
<!-- 여기 아래로 글을 써주세요! 이 위 내용은 실제 배포에서는 보이지 않습니다. -->
`

  const blogDir = join(rootDir, 'data', 'blog')
  if (!existsSync(blogDir)) {
    try {
      mkdirSync(blogDir, { recursive: true })
      console.log(`Created blog directory: ${blogDir}`)
    } catch (error) {
      console.error(`Failed to create blog directory: ${error.message}`)
      process.exit(1)
    }
  }

  const slug = `${issueNumber}th-blog`
  const filePath = join(blogDir, `${slug}.mdx`)
  try {
    writeFileSync(filePath, content, 'utf8')
    console.log(`Created new post: ${filePath}`)
  } catch (error) {
    console.error(`Failed to create post file: ${error.message}`)
    process.exit(1)
  }
}

const args = process.argv.slice(2)
const [issueNumber, title, tags, summary, ...authors] = args
if (issueNumber && title) {
  createPost(issueNumber, title, tags, summary, authors)
} else {
  console.error('Please provide both an issue number and a post title.')
}
