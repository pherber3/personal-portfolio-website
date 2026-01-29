'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  activeTab?: 'home' | 'cv';
  onTabChange?: (tab: 'home' | 'cv') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const pathname = usePathname();
  const isOnBlog = pathname.startsWith('/blog');

  const pillClass = (active: boolean) =>
    `px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      active
        ? 'bg-[#3A4D39] text-white shadow-sm'
        : 'text-[#787570] hover:text-[#1A1A1A]'
    }`;

  return (
    <nav className={`${isOnBlog ? 'relative mt-6' : 'sticky top-6'} z-50 flex justify-center pointer-events-none`}>
      <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-[#E5E2D9] p-1 rounded-full shadow-sm flex gap-1">
        {isOnBlog ? (
          <>
            <Link href="/" className={pillClass(false)}>
              Overview
            </Link>
            <Link href="/" className={pillClass(false)}>
              Curriculum Vitae
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => onTabChange?.('home')}
              className={pillClass(activeTab === 'home')}
            >
              Overview
            </button>
            <button
              onClick={() => onTabChange?.('cv')}
              className={pillClass(activeTab === 'cv')}
            >
              Curriculum Vitae
            </button>
          </>
        )}
        <Link
          href="/blog"
          className={pillClass(isOnBlog)}
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}
