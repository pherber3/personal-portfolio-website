import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime?: number;
  slug: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPostSlugs(): string[] {
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return {
    meta: { ...data, slug } as BlogPostMeta,
    content,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map(slug => getPostBySlug(slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
