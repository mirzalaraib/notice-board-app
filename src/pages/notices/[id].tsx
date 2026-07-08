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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Notice</h1>
        <p className="text-gray-600 mt-1">Update the notice details below.</p>
      </div>
      {error ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Notice not found</h2>
          <p className="text-gray-500">{error}</p>
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