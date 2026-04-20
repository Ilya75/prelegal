'use client';

import { useState } from 'react';
import { defaultFormData, NdaFormData } from '@/lib/types';
import NdaForm from './NdaForm';
import NdaPreview from './NdaPreview';
import DownloadButton from './DownloadButton';

interface Props {
  standardTerms: string;
}

export default function NdaCreator({ standardTerms }: Props) {
  const [formData, setFormData] = useState<NdaFormData>(() => ({
    ...defaultFormData,
    effectiveDate: new Date().toISOString().split('T')[0],
  }));

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-indigo-600 rounded" />
          <span className="text-lg font-semibold text-gray-900">Prelegal</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">Mutual NDA Creator</span>
        </div>
        <DownloadButton />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/5 overflow-y-auto bg-gray-50 border-r border-gray-200">
          <NdaForm data={formData} onChange={setFormData} />
        </div>
        <div className="w-3/5 overflow-y-auto bg-white">
          <NdaPreview data={formData} standardTerms={standardTerms} />
        </div>
      </div>
    </div>
  );
}
