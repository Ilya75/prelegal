'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { documentsApi } from '@/lib/api';
import { DocumentEntry } from '@/lib/types';

export default function Page() {
  const { user, loading, logout } = useAuth();
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login';
      return;
    }
    if (user) {
      documentsApi.list()
        .then((data) => setDocuments(data as DocumentEntry[]))
        .catch(() => setDocuments([]))
        .finally(() => setDocsLoading(false));
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#ecad0a] rounded" />
          <span className="text-lg font-semibold text-[#032147]">Prelegal</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#888888]">{user.email}</span>
          <button onClick={logout} className="text-sm text-[#888888] hover:text-[#032147]">
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-2xl font-bold text-[#032147] mb-2">Create a Legal Document</h1>
        <p className="text-sm text-[#888888] mb-8">
          Select a document type below. Our AI will guide you through filling in the details.
        </p>

        {docsLoading ? (
          <div className="text-sm text-gray-400">Loading documents...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <a
                key={doc.slug}
                href={`/document/?type=${doc.slug}`}
                className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-[#209dd7] hover:shadow-sm transition-all"
              >
                <div className="w-8 h-1 bg-[#ecad0a] rounded mb-3" />
                <h2 className="text-sm font-semibold text-[#032147] mb-2">{doc.name}</h2>
                <p className="text-xs text-[#888888] leading-relaxed">{doc.description}</p>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
