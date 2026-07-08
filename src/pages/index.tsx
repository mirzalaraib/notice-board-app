import { useState } from 'react';
import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import Layout from '@/components/Layout';
import NoticeCard from '@/components/NoticeCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRouter } from 'next/router';

interface Notice {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string | null;
}

interface HomeProps {
  notices: Notice[];
}

export default function Home({ notices }: HomeProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleteId === null) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/notices/${deleteId}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (result.success) {
        router.replace(router.asPath);
      } else {
        alert(result.error || 'Failed to delete notice');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
        <p className="text-gray-600 mt-1">
          {notices.length} notice{notices.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No notices yet</h2>
          <p className="text-gray-500 mb-6">Get started by creating your first notice.</p>
          <button
            onClick={() => router.push('/notices/new')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Notice
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              {...notice}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: 'asc' },
        { publishDate: 'desc' },
      ],
    });

    return {
      props: {
        notices: JSON.parse(JSON.stringify(notices)),
      },
    };
  } catch (error) {
    console.error('Error fetching notices:', error);
    return {
      props: {
        notices: [],
      },
    };
  }
};