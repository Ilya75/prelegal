'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { defaultFormData, defaultGenericFormData, NdaFormData } from '@/lib/types';
import AiChat from './AiChat';
import NdaPreview from './NdaPreview';
import GenericPreview from './GenericPreview';
import DownloadButton from './DownloadButton';

const NDA_OPENING =
  "Hi! I'll help you fill in your Mutual NDA. Let's start — what is the purpose of this agreement? For example: evaluating a potential business partnership.";

function genericOpening(documentName: string): string {
  return `Hi! I'll help you create your ${documentName}. Let's start — what are the names of the two parties? Please provide the service provider's company name first.`;
}

interface Props {
  slug: string;
  documentName: string;
  standardTerms: string;
}

export default function DocumentCreator({ slug, documentName, standardTerms }: Props) {
  const { user, loading, logout } = useAuth();
  const isNda = slug === 'mutual-nda';

  const [fields, setFields] = useState<Record<string, string>>(() => {
    if (isNda) {
      return {
        ...defaultFormData,
        effectiveDate: new Date().toISOString().split('T')[0],
      };
    }
    return {
      ...defaultGenericFormData,
      effectiveDate: new Date().toISOString().split('T')[0],
    };
  });

  useEffect(() => {
    if (!loading && !user) window.location.href = '/login';
  }, [user, loading]);

  if (loading || !user) return null;

  const openingMessage = isNda ? NDA_OPENING : genericOpening(documentName);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="w-6 h-6 bg-[#ecad0a] rounded flex-shrink-0" title="All documents" />
          <span className="text-lg font-semibold text-[#032147]">Prelegal</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">{documentName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#888888]">{user.email}</span>
          <button onClick={logout} className="text-sm text-[#888888] hover:text-[#032147]">Sign out</button>
          <DownloadButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 overflow-hidden bg-gray-50 border-r border-gray-200">
          <AiChat
            documentType={slug}
            openingMessage={openingMessage}
            fields={fields}
            onFieldsChange={setFields}
          />
        </div>
        <div className="w-3/5 overflow-y-auto bg-white">
          {isNda ? (
            <NdaPreview data={fields as unknown as NdaFormData} standardTerms={standardTerms} />
          ) : (
            <GenericPreview
              documentName={documentName}
              fields={fields}
              standardTerms={standardTerms}
            />
          )}
        </div>
      </div>
    </div>
  );
}
