import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import BlogNavWrapper from './BlogNavWrapper';

export const metadata: Metadata = {
  title: 'Blog | Patrick Herbert',
  description: 'Technical writing on machine learning, deep learning architectures, and research.',
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blog | Patrick Herbert',
    description: 'Technical writing on machine learning, deep learning architectures, and research.',
    siteName: 'Patrick Herbert',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Blog | Patrick Herbert',
    description: 'Technical writing on machine learning, deep learning architectures, and research.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <BlogNavWrapper />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-[#1A1A1A] mb-4">
          Blog
        </h1>
        <p className="text-[#787570] mb-12 text-lg leading-relaxed">
          Technical writing on ML research, deep learning architectures, and engineering.
        </p>

        <div className="space-y-0 divide-y divide-[#E5E2D9]">
          {posts.map((post) => (
            <article key={post.slug} className="group py-8 citation-hover rounded-lg px-4 -mx-4">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-xl font-serif font-medium text-[#1A1A1A] group-hover:text-[#3A4D39] transition-colors">
                    {post.title}
                  </h2>
                  <time className="text-xs font-mono text-[#787570] ml-4 shrink-0">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </time>
                </div>
                <p className="text-[#4A4A4A] leading-relaxed text-sm mb-3">
                  {post.excerpt}
                </p>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase text-[#787570] bg-[#F4F2ED] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
