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

  const urgentCount = notices.filter((n) => n.priority === 'Urgent').length;

  return (
    <Layout>
      {/* Dashboard Hero Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
            Institutional Board
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none mb-3">
            Reno IT Park Announcements
          </h1>
          <p className="text-slate-500 font-medium">
            Stay up to date with the latest interviews, events, and general notices.
          </p>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-slate-200/50 shadow-sm">
          <div className="px-4 py-2 border-r border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xl font-extrabold text-slate-800">{notices.length}</span>
          </div>
          <div className="px-4 py-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Urgent</span>
            <span className="text-xl font-extrabold text-rose-600 flex items-center gap-1">
              {urgentCount}
              {urgentCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      {notices.length === 0 ? (
        <div className="text-center py-24 bg-white/45 backdrop-blur-sm rounded-3xl border border-slate-200/50 max-w-4xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
            📭
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No active announcements</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Your board is currently empty. Get started by publishing your first notice.
          </p>
          <button
            onClick={() => router.push('/notices/new')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Create First Notice
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        title="Delete Announcement"
        message="Are you sure you want to delete this notice? This action is permanent and cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete Permanently'}
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