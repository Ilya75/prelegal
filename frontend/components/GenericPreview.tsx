'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import { substituteGenericTerms } from '@/lib/substitution';

interface Props {
  documentName: string;
  fields: Record<string, string>;
  standardTerms: string;
}

function Filled({ value, placeholder }: { value: string; placeholder: string }) {
  if (!value) return <span className="text-gray-400 italic">{placeholder}</span>;
  return <mark className="bg-amber-100 rounded px-0.5">{value}</mark>;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function KeyTerms({ fields }: { fields: Record<string, string> }) {
  const rows = [
    { label: 'Provider', key: 'providerCompany', placeholder: '[Provider Company]' },
    { label: 'Customer', key: 'customerCompany', placeholder: '[Customer Company]' },
    { label: 'Effective Date', key: 'effectiveDate', placeholder: '[Effective Date]', format: formatDate },
    { label: 'Governing Law', key: 'governingLaw', placeholder: '[Governing Law]' },
    { label: 'Chosen Courts', key: 'chosenCourts', placeholder: '[Chosen Courts]' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Key Terms</h2>
      <div className="space-y-2">
        {rows.map(({ label, key, placeholder, format }) => {
          const raw = fields[key] || '';
          const value = format ? (raw ? format(raw) : '') : raw;
          return (
            <div key={key} className="text-sm">
              <span className="font-semibold text-gray-700">{label}: </span>
              <Filled value={value} placeholder={placeholder} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GenericPreview({ documentName, fields, standardTerms }: Props) {
  const bodyHtml = useMemo(() => {
    const processed = substituteGenericTerms(standardTerms, fields);
    return marked.parse(processed) as string;
  }, [standardTerms, fields]);

  return (
    <div className="p-8">
      <div id="nda-document" className="max-w-2xl mx-auto">
        <div className="legal-document">
          <h1 className="text-sm font-bold text-center uppercase tracking-widest mb-5">
            {documentName}
          </h1>
          <KeyTerms fields={fields} />
        </div>

        <div className="my-8 border-t-2 border-dashed border-gray-300 relative">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 tracking-wide">
            Standard Terms
          </span>
        </div>

        <div
          className="legal-document"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </div>
  );
}
