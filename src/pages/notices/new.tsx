import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3 animate-slide-in">
          ✨ Publish
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none mb-3">
          Create New Notice
        </h1>
        <p className="text-slate-500 font-medium">Fill in the fields below to broadcast your announcement.</p>
      </div>
      <NoticeForm />
    </Layout>
  );
}