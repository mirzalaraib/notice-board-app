import Link from 'next/link';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
              <span className="text-3xl">📋</span>
              <span>Notice Board</span>
            </Link>
            <Link
              href="/notices/new"
              className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg"
            >
              <span className="text-xl">+</span>
              <span>Add Notice</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}