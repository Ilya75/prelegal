'use client';

import { NdaFormData } from '@/lib/types';

interface Props {
  data: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="px-6 py-3 bg-gray-100 border-y border-gray-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
      </div>
      <div className="px-6 py-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {hint && <span className="ml-1 text-xs font-normal text-gray-400">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}

const input = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#209dd7] focus:outline-none focus:ring-1 focus:ring-[#209dd7]';
const numInput = 'w-16 rounded border border-gray-300 px-2 py-1 text-sm text-center focus:border-[#209dd7] focus:outline-none focus:ring-1 focus:ring-[#209dd7] disabled:bg-gray-100 disabled:text-gray-400';

export default function NdaForm({ data, onChange }: Props) {
  const set = (field: keyof NdaFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="pb-8">
      <Section title="Agreement Details">
        <Field label="Purpose" hint="How confidential information may be used">
          <textarea
            className={input + ' resize-none'}
            rows={3}
            value={data.purpose}
            onChange={set('purpose')}
            placeholder="Evaluating whether to enter into a business relationship…"
          />
        </Field>
        <Field label="Effective Date">
          <input type="date" className={input} value={data.effectiveDate} onChange={set('effectiveDate')} />
        </Field>
      </Section>

      <Section title="MNDA Term">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === 'expires'}
              onChange={() => onChange({ ...data, mndaTermType: 'expires' })}
              className="accent-[#209dd7]"
            />
            <span className="text-sm text-gray-700">Expires after</span>
            <input
              type="number"
              min="1"
              max="10"
              className={numInput}
              value={data.mndaTermYears}
              onChange={set('mndaTermYears')}
              disabled={data.mndaTermType !== 'expires'}
            />
            <span className="text-sm text-gray-700">year(s) from Effective Date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mndaTermType"
              checked={data.mndaTermType === 'until_terminated'}
              onChange={() => onChange({ ...data, mndaTermType: 'until_terminated' })}
              className="accent-[#209dd7]"
            />
            <span className="text-sm text-gray-700">Continues until terminated</span>
          </label>
        </div>
      </Section>

      <Section title="Term of Confidentiality">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="confidentialityType"
              checked={data.confidentialityType === 'years'}
              onChange={() => onChange({ ...data, confidentialityType: 'years' })}
              className="accent-[#209dd7]"
            />
            <input
              type="number"
              min="1"
              max="10"
              className={numInput}
              value={data.confidentialityYears}
              onChange={set('confidentialityYears')}
              disabled={data.confidentialityType !== 'years'}
            />
            <span className="text-sm text-gray-700">year(s) from Effective Date</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="confidentialityType"
              checked={data.confidentialityType === 'perpetuity'}
              onChange={() => onChange({ ...data, confidentialityType: 'perpetuity' })}
              className="accent-[#209dd7]"
            />
            <span className="text-sm text-gray-700">In perpetuity</span>
          </label>
        </div>
      </Section>

      <Section title="Governing Law & Jurisdiction">
        <Field label="Governing Law" hint="State">
          <input
            type="text"
            className={input}
            value={data.governingLaw}
            onChange={set('governingLaw')}
            placeholder="e.g. Delaware"
          />
        </Field>
        <Field label="Jurisdiction" hint="City/county and state">
          <input
            type="text"
            className={input}
            value={data.jurisdiction}
            onChange={set('jurisdiction')}
            placeholder="e.g. courts located in New Castle, DE"
          />
        </Field>
      </Section>

      <Section title="Party 1">
        <Field label="Company">
          <input type="text" className={input} value={data.party1Company} onChange={set('party1Company')} placeholder="Company name" />
        </Field>
        <Field label="Signatory Name">
          <input type="text" className={input} value={data.party1Name} onChange={set('party1Name')} placeholder="Full name" />
        </Field>
        <Field label="Title">
          <input type="text" className={input} value={data.party1Title} onChange={set('party1Title')} placeholder="e.g. CEO" />
        </Field>
        <Field label="Notice Address" hint="Email or postal">
          <input type="text" className={input} value={data.party1Address} onChange={set('party1Address')} placeholder="email@company.com" />
        </Field>
      </Section>

      <Section title="Party 2">
        <Field label="Company">
          <input type="text" className={input} value={data.party2Company} onChange={set('party2Company')} placeholder="Company name" />
        </Field>
        <Field label="Signatory Name">
          <input type="text" className={input} value={data.party2Name} onChange={set('party2Name')} placeholder="Full name" />
        </Field>
        <Field label="Title">
          <input type="text" className={input} value={data.party2Title} onChange={set('party2Title')} placeholder="e.g. CEO" />
        </Field>
        <Field label="Notice Address" hint="Email or postal">
          <input type="text" className={input} value={data.party2Address} onChange={set('party2Address')} placeholder="email@company.com" />
        </Field>
      </Section>

      <Section title="Modifications (Optional)">
        <Field label="MNDA Modifications" hint="Any changes to the standard terms">
          <textarea
            className={input + ' resize-none'}
            rows={4}
            value={data.modifications}
            onChange={set('modifications')}
            placeholder="List any modifications to the standard MNDA terms…"
          />
        </Field>
      </Section>
    </div>
  );
}
