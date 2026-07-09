import React from 'react';
import Link from 'next/link';

interface NoticeCardProps {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl?: string | null;
  onDelete: (id: number) => void;
}

export default function NoticeCard({
  id,
  title,
  body,
  category,
  priority,
  publishDate,
  imageUrl,
  onDelete,
}: NoticeCardProps) {
  const categoryColors: Record<string, string> = {
    Exam: 'bg-purple-50 text-purple-700 border-purple-200/60',
    Event: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    General: 'bg-sky-50 text-sky-700 border-sky-200/60',
  };

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isUrgent = priority === 'Urgent';

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col h-full
      ${isUrgent 
        ? 'border-rose-200 shadow-sm hover:shadow-rose-100 hover:shadow-xl hover:border-rose-300' 
        : 'border-slate-200/80 shadow-sm hover:shadow-slate-100 hover:shadow-xl hover:border-indigo-200'
      }`}
    >
      {/* Visual Accent Top Bar for Urgent notices */}
      {isUrgent && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-orange-500 z-10" />
      )}

      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Card Header Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse-urgent">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              categoryColors[category] || categoryColors.General
            }`}
          >
            {category}
          </span>
          <span className="text-xs font-semibold text-slate-400 ml-auto">{formattedDate}</span>
        </div>

        {/* Card Content */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3 flex-grow">
          {body}
        </p>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <Link
            href={`/notices/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Notice
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}