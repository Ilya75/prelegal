'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import { NdaFormData } from '@/lib/types';
import { substituteStandardTerms } from '@/lib/substitution';

interface Props {
  data: NdaFormData;
  standardTerms: string;
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

function Filled({ value, placeholder }: { value: string; placeholder: string }) {
  if (!value) return <span className="text-gray-400 italic">{placeholder}</span>;
  return <mark className="bg-amber-100 rounded px-0.5 not-italic">{value}</mark>;
}

function CoverPage({ data }: { data: NdaFormData }) {
  const dateDisplay = data.effectiveDate ? formatDate(data.effectiveDate) : null;

  return (
    <div>
      <h1 className="text-sm font-bold text-center uppercase tracking-widest mb-5">
        Mutual Non-Disclosure Agreement
      </h1>

      <p className="text-xs text-gray-600 mb-6 leading-relaxed">
        This Mutual Non-Disclosure Agreement (the "MNDA") consists of: (1) this Cover Page ("
        <strong>Cover Page</strong>") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("
        <strong>Standard Terms</strong>"). Any modifications of the Standard Terms should be made on the
        Cover Page, which will control over conflicts with the Standard Terms.
      </p>

      <div className="space-y-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-0.5">Purpose</h3>
          <p className="text-xs text-gray-400 italic mb-1">How Confidential Information may be used</p>
          <div className="text-sm">
            <Filled value={data.purpose} placeholder="[Purpose not specified]" />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Effective Date</h3>
          <div className="text-sm">
            {dateDisplay
              ? <mark className="bg-amber-100 rounded px-0.5">{dateDisplay}</mark>
              : <span className="text-gray-400 italic">[Effective Date]</span>}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-0.5">MNDA Term</h3>
          <p className="text-xs text-gray-400 italic mb-1">The length of this MNDA</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-start gap-2">
              <span>{data.mndaTermType === 'expires' ? '☑' : '☐'}</span>
              <span>
                Expires{' '}
                {data.mndaTermType === 'expires'
                  ? <mark className="bg-amber-100 rounded px-0.5">{data.mndaTermYears} year(s)</mark>
                  : <span className="text-gray-400">[X year(s)]</span>
                }{' '}
                from Effective Date.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>{data.mndaTermType === 'until_terminated' ? '☑' : '☐'}</span>
              <span>Continues until terminated in accordance with the terms of the MNDA.</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-0.5">Term of Confidentiality</h3>
          <p className="text-xs text-gray-400 italic mb-1">How long Confidential Information is protected</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-start gap-2">
              <span>{data.confidentialityType === 'years' ? '☑' : '☐'}</span>
              <span>
                {data.confidentialityType === 'years'
                  ? <mark className="bg-amber-100 rounded px-0.5">{data.confidentialityYears} year(s)</mark>
                  : <span className="text-gray-400">[X year(s)]</span>
                }{' '}
                from Effective Date, but in the case of trade secrets until Confidential Information is
                no longer considered a trade secret under applicable laws.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>{data.confidentialityType === 'perpetuity' ? '☑' : '☐'}</span>
              <span>In perpetuity.</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
            Governing Law &amp; Jurisdiction
          </h3>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-semibold">Governing Law: </span>
              <Filled value={data.governingLaw} placeholder="[Fill in state]" />
            </div>
            <div>
              <span className="font-semibold">Jurisdiction: </span>
              <Filled value={data.jurisdiction} placeholder="[Fill in city or county and state]" />
            </div>
          </div>
        </div>

        {data.modifications && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">MNDA Modifications</h3>
            <div className="text-sm">
              <mark className="bg-amber-100 rounded px-0.5">{data.modifications}</mark>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm mb-3">
            By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
          </p>
          <table className="w-full border-collapse text-xs">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-2 w-1/4 bg-gray-50" />
                <td className="border border-gray-300 px-2 py-2 text-center font-semibold bg-gray-50">
                  {data.party1Company
                    ? <mark className="bg-amber-100 rounded px-0.5">{data.party1Company}</mark>
                    : <span className="text-gray-400">PARTY 1</span>}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center font-semibold bg-gray-50">
                  {data.party2Company
                    ? <mark className="bg-amber-100 rounded px-0.5">{data.party2Company}</mark>
                    : <span className="text-gray-400">PARTY 2</span>}
                </td>
              </tr>
              {[
                ['Signature', '', ''],
                ['Print Name', data.party1Name, data.party2Name],
                ['Title', data.party1Title, data.party2Title],
                ['Notice Address', data.party1Address, data.party2Address],
                ['Date', '', ''],
              ].map(([label, v1, v2]) => (
                <tr key={label}>
                  <td className="border border-gray-300 px-2 py-2 font-medium text-gray-600 bg-gray-50">{label}</td>
                  <td className="border border-gray-300 px-2 py-3">
                    {v1 && <mark className="bg-amber-100 rounded px-0.5">{v1}</mark>}
                  </td>
                  <td className="border border-gray-300 px-2 py-3">
                    {v2 && <mark className="bg-amber-100 rounded px-0.5">{v2}</mark>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-5">
        Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" className="text-blue-600 underline">CC BY 4.0</a>.
      </p>
    </div>
  );
}

export default function NdaPreview({ data, standardTerms }: Props) {
  const standardTermsHtml = useMemo(() => {
    const processed = substituteStandardTerms(standardTerms, data);
    return marked.parse(processed) as string;
  }, [standardTerms, data]);

  return (
    <div className="p-8">
      <div id="nda-document" className="max-w-2xl mx-auto">
        <div className="legal-document">
          <CoverPage data={data} />
        </div>

        <div className="my-8 border-t-2 border-dashed border-gray-300 relative">
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400 tracking-wide">
            Standard Terms
          </span>
        </div>

        <div
          className="legal-document"
          dangerouslySetInnerHTML={{ __html: standardTermsHtml }}
        />
      </div>
    </div>
  );
}
