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
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          ✏️ Edit Notice
        </h1>
        <p className="text-gray-600 text-lg">Update the notice details below.</p>
      </div>
      {error ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-7xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Notice not found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      ) : notice ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
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
        </div>
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