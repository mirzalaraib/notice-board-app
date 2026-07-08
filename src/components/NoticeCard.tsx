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
    Exam: 'bg-purple-100 text-purple-800',
    Event: 'bg-green-100 text-green-800',
    General: 'bg-blue-100 text-blue-800',
  };

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {priority === 'Urgent' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              ● Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[category] || categoryColors.General
            }`}
          >
            {category}
          </span>
          <span className="text-xs text-gray-500 ml-auto">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{body}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            href={`/notices/${id}`}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}