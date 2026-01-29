import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import BlogNavWrapper from '../BlogNavWrapper';
import { mdxComponents } from './mdx-components';

export function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: `${post.meta.title} | Patrick Herbert`,
      description: post.meta.excerpt,
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <>
      <BlogNavWrapper />
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/blog"
          className="text-xs font-mono uppercase text-[#787570] hover:text-[#3A4D39] transition-colors mb-8 inline-block"
        >
          &larr; Back to Blog
        </Link>

        <header className="mb-12 border-b border-[#E5E2D9] pb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#1A1A1A] mb-4 leading-tight">
            {post.meta.title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-[#787570]">
            <time>{new Date(post.meta.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}</time>
            {post.meta.readingTime && (
              <>
                <span className="text-[#E5E2D9]">|</span>
                <span>{post.meta.readingTime} min read</span>
              </>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {post.meta.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono uppercase text-[#787570] bg-[#F4F2ED] px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none
          prose-headings:font-serif prose-headings:text-[#1A1A1A]
          prose-p:text-[#4A4A4A] prose-p:leading-relaxed
          prose-a:text-[#3A4D39] prose-a:underline prose-a:underline-offset-4
          prose-strong:text-[#1A1A1A]
          prose-code:font-mono prose-code:text-sm prose-code:bg-[#F4F2ED] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-[#1A1A1A] prose-pre:text-[#F4F2ED]
          prose-blockquote:border-l-[#3A4D39] prose-blockquote:text-[#787570]
          prose-img:rounded-lg prose-img:border prose-img:border-[#E5E2D9]
        ">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeSlug, rehypeKatex],
              },
            }}
            components={mdxComponents}
          />
        </div>
      </article>
    </>
  );
}
