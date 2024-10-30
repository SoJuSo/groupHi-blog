import { writeFileSync } from 'fs'
import { join } from 'path'

const formatDate = (date) => {
  return date.toISOString().split('T')[0].replace(/-/g, '-').slice(2)
}

const createPost = (title, tags = '', summary = '', authors = []) => {
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

  const blogDir = join(__dirname, 'data', 'blog')
  if (!existsSync(blogDir)) {
    console.error("Error: 'data/blog' 폴더가 존재하지 않습니다!")
    process.exit(1)
  }

  const staticDir = join(__dirname, 'public', 'static', 'blogs', issueNumber)
  if (!existsSync(staticDir)) {
    mkdirSync(staticDir, { recursive: true })
    console.log(`Created directory: ${staticDir}`)
  } else {
    console.error('이미 폴더가 존재합니다!!')
  }

  const slug = `${issueNumber})${title.toLowerCase().replace(/ /g, '-')}`
  const filePath = join(blogDir, `${slug}.md`)

  writeFileSync(filePath, content, 'utf8')
  console.log(`Created new post: ${filePath}`)
}

const args = process.argv.slice(2)
const [title, tags, summary, ...authors] = args
if (title) {
  createPost(title, tags, summary, authors)
} else {
  console.error('Please provide a post title.')
}
