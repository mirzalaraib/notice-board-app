import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface NoticeFormData {
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string;
}

interface NoticeFormProps {
  initialData?: NoticeFormData;
  isEditing?: boolean;
  noticeId?: number;
}

export default function NoticeForm({ initialData, isEditing, noticeId }: NoticeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<NoticeFormData>({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: initialData?.publishDate
      ? new Date(initialData.publishDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    imageUrl: initialData?.imageUrl || '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);

    // Client-side validation
    const clientErrors: string[] = [];
    if (!formData.title.trim()) clientErrors.push('Title is required');
    if (!formData.body.trim()) clientErrors.push('Body is required');

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      setSubmitting(false);
      return;
    }

    try {
      const url = isEditing ? `/api/notices/${noticeId}` : '/api/notices';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.imageUrl.trim() || null,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setErrors([result.error || 'Failed to save notice']);
        setSubmitting(false);
        return;
      }

      router.push('/');
    } catch {
      setErrors(['Network error. Please try again.']);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-8 shadow-xl shadow-slate-100/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-xl animate-shake">
            <ul className="list-disc list-inside text-sm font-medium">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Notice Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-medium"
            placeholder="e.g. Mid-term Exam Schedule Announcement"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Detailed Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            rows={5}
            value={formData.body}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-medium resize-none"
            placeholder="Provide all details regarding this notice here..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-semibold appearance-none"
              >
                <option value="General">📌 General</option>
                <option value="Exam">📚 Exam</option>
                <option value="Event">🎉 Event</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Priority Level
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-semibold appearance-none"
              >
                <option value="Normal">🟢 Normal</option>
                <option value="Urgent">🔴 Urgent</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="publishDate" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Publish Date
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-semibold"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Cover Image URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-slate-900 text-sm font-medium"
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex-grow sm:flex-grow-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Announcement' : 'Publish Notice'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 text-slate-700 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}