import { writeFileSync, existsSync, mkdirSync, chmodSync } from 'fs'
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

Write your content here.
`

  // blog 디렉토리 설정 및 생성
  const blogDir = join(rootDir, 'data', 'blog')
  if (!existsSync(blogDir)) {
    try {
      mkdirSync(blogDir, { recursive: true })
      chmodSync(blogDir, 0o755)
      console.log(`Created blog directory: ${blogDir}`)
    } catch (error) {
      console.error(`Failed to create blog directory: ${error.message}`)
      process.exit(1)
    }
  }

  const staticDir = join(rootDir, 'public', 'static', 'blogs')
  if (!existsSync(staticDir)) {
    try {
      mkdirSync(staticDir, { recursive: true })
      chmodSync(staticDir, 0o755)
      console.log(`Created blogs directory: ${staticDir}`)
    } catch (error) {
      console.error(`Failed to create blogs directory: ${error.message}`)
      process.exit(1)
    }
  }

  const issueDir = join(staticDir, issueNumber.toString())
  if (!existsSync(issueDir)) {
    try {
      mkdirSync(issueDir, { recursive: true })
      chmodSync(issueDir, 0o755)
      const emptyFilePath = join(issueDir, `${issueNumber}.md`)
      writeFileSync(emptyFilePath, `${issueNumber}에 대한 사진 저장 경로`, 'utf8')
      chmodSync(emptyFilePath, 0o644)
      console.log(`Created empty file: ${emptyFilePath}`)
    } catch (error) {
      console.error(`Failed to create issue directory or file: ${error.message}`)
      process.exit(1)
    }
  } else {
    console.error('Issue directory already exists!')
  }

  const slug = `${issueNumber}th-blog`
  const filePath = join(blogDir, `${slug}.mdx`)
  try {
    writeFileSync(filePath, content, 'utf8')
    chmodSync(filePath, 0o644)
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
