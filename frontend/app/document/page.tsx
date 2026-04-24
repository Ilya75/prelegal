'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { documentsApi } from '@/lib/api';
import DocumentCreator from '@/components/DocumentCreator';

interface DocumentMeta {
  slug: string;
  name: string;
}

function DocumentPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('type') || 'mutual-nda';

  const [meta, setMeta] = useState<DocumentMeta | null>(null);
  const [standardTerms, setStandardTerms] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [docs, templateData] = await Promise.all([
          documentsApi.list(),
          documentsApi.getTemplate(slug),
        ]);
        const found = (docs as DocumentMeta[]).find((d: DocumentMeta) => d.slug === slug);
        if (!found) {
          setError(`Unknown document type: ${slug}`);
          return;
        }
        setMeta(found);
        setStandardTerms(templateData.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      }
    }
    load();
  }, [slug]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-[#209dd7] hover:underline">Back to documents</a>
        </div>
      </div>
    );
  }

  if (!meta || standardTerms === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <DocumentCreator
      slug={slug}
      documentName={meta.name}
      standardTerms={standardTerms}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="text-sm text-gray-400">Loading...</div></div>}>
      <DocumentPage />
    </Suspense>
  );
}
