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
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📢 Notices</h1>
        <p className="text-gray-600 text-lg">
          {notices.length === 0 ? 'No notices yet' : `${notices.length} notice${notices.length !== 1 ? 's' : ''} total`}
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-7xl mb-6">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No notices yet</h2>
          <p className="text-gray-600 mb-8 text-lg">Get started by creating your first notice.</p>
          <button
            onClick={() => router.push('/notices/new')}
            className="btn-gradient inline-flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl shadow-lg text-lg"
          >
            <span>+</span>
            <span>Create Notice</span>
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