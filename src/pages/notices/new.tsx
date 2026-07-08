import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Notice</h1>
        <p className="text-gray-600 mt-1">Fill in the details below to create a new notice.</p>
      </div>
      <NoticeForm />
    </Layout>
  );
}