import { GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

interface EditNoticeProps {
  notice: {
    id: number;
    title: string;
    body: string;
    category: string;
    priority: string;
    publishDate: string;
    imageUrl: string | null;
  } | null;
  error?: string;
}

export default function EditNotice({ notice, error }: EditNoticeProps) {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3 animate-slide-in">
          ✏️ Edit Mode
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none mb-3">
          Edit Announcement
        </h1>
        <p className="text-slate-500 font-medium">Modify the fields below to update the published notice.</p>
      </div>
      {error ? (
        <div className="text-center py-24 bg-white/45 backdrop-blur-sm rounded-3xl border border-slate-200/50 max-w-4xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Notice not found</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">{error}</p>
        </div>
      ) : notice ? (
        <NoticeForm
          initialData={{
            title: notice.title,
            body: notice.body,
            category: notice.category,
            priority: notice.priority,
            publishDate: notice.publishDate,
            imageUrl: notice.imageUrl || '',
          }}
          isEditing
          noticeId={notice.id}
        />
      ) : null}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const noticeId = parseInt(id as string, 10);

    if (isNaN(noticeId)) {
      return {
        props: {
          notice: null,
          error: 'Invalid notice ID.',
        },
      };
    }

    const notice = await prisma.notice.findUnique({
      where: { id: noticeId },
    });

    if (!notice) {
      return {
        props: {
          notice: null,
          error: 'Notice not found.',
        },
      };
    }

    return {
      props: {
        notice: JSON.parse(JSON.stringify(notice)),
        error: null,
      },
    };
  } catch {
    return {
      props: {
        notice: null,
        error: 'Failed to load notice.',
      },
    };
  }
};