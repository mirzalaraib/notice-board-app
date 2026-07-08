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
    if (!formData.publishDate) clientErrors.push('Publish date is required');

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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <ul className="list-disc list-inside text-sm">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Enter notice title"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Body *
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          value={formData.body}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
          placeholder="Enter notice body"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
          Publish Date *
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          value={formData.publishDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (optional)
        </label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Notice' : 'Create Notice'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-2.5 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}