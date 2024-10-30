import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '../')

const formatDate = (date) => {
  return date.toISOString().split('T')[0].replace(/-/g, '-').slice(2)
}

const createPost = (issueNumber, title, tags = '', summary = '', authors = []) => {
  const date = formatDate(new Date())
  const tagList = tags
    .split(',')
    .map((tag) => tag.trim())
    .join(', ')
  const authorList = authors.length > 0 ? 'default' + authors.join(', ') : 'default'

  const content = `---
title: "${title}"
date: "${date}"
lastmod: "${date}"
tags: [${tagList}]
summary: "${summary}"
authors: [${authorList}]
draft: false
---

Write your content here.
`

  const blogDir = join(rootDir, 'data', 'blog')
  console.log(blogDir)
  if (!existsSync(blogDir)) {
    console.error("Error: 'data/blog' 폴더가 존재하지 않습니다!")
    process.exit(1)
  }

  const staticDir = join(rootDir, 'public', 'static', 'blogs', issueNumber)
  console.log(staticDir)
  if (!existsSync(staticDir)) {
    mkdirSync(staticDir, { recursive: true })
    console.log(`Created directory: ${staticDir}`)
  } else {
    console.error('이미 폴더가 존재합니다!!')
  }

  const slug = `${issueNumber}th-blog`
  const filePath = join(blogDir, `${slug}.md`)

  writeFileSync(filePath, content, 'utf8')
  console.log(`Created new post: ${filePath}`)
}

const args = process.argv.slice(2)
const [issueNumber, title, tags, summary, ...authors] = args
if (issueNumber && title) {
  createPost(issueNumber, title, tags, summary, authors)
} else {
  console.error('Please provide both an issue number and a post title.')
}
