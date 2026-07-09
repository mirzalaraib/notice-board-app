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
    Exam: 'bg-purple-100 text-purple-800 border-purple-200',
    Event: 'bg-green-100 text-green-800 border-green-200',
    General: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const categoryEmojis: Record<string, string> = {
    Exam: '📚',
    Event: '🎉',
    General: '📌',
  };

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card-hover bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {priority === 'Urgent' && (
            <span className="animate-pulse-urgent inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              🔥 Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[category] || categoryColors.General}`}
          >
            <span>{categoryEmojis[category] || '📌'}</span>
            <span>{category}</span>
          </span>
          <span className="text-xs text-gray-500 ml-auto font-medium">📅 {formattedDate}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{body}</p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/notices/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:scale-105"
          >
            <span>✏️</span>
            <span>Edit</span>
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all hover:scale-105"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}