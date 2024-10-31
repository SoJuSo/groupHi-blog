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

Write your content here.
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

  const publicDir = join(rootDir, 'public', issueNumber.toString())
  if (!existsSync(publicDir)) {
    try {
      mkdirSync(publicDir, { recursive: true })
      console.log(`Created public directory for issue ${issueNumber}: ${publicDir}`)
    } catch (error) {
      console.error(`Failed to create public directory: ${error.message}`)
      process.exit(1)
    }
  }

  const issueFilePath = join(publicDir, `${issueNumber}.md`)
  try {
    writeFileSync(issueFilePath, `${issueNumber}에 대한 사진 저장 경로`, 'utf8')
    console.log(`Created empty file: ${issueFilePath}`)
  } catch (error) {
    console.error(`Failed to create issue file: ${error.message}`)
    process.exit(1)
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
