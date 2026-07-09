import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          ✨ Add New Notice
        </h1>
        <p className="text-gray-600 text-lg">Fill in the details below to create a new notice.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <NoticeForm />
      </div>
    </Layout>
  );
}