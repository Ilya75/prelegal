import { NdaFormData } from './types';

function formatDate(dateString: string): string {
  if (!dateString) return '<span style="color:#9ca3af;font-style:italic">[Effective Date]</span>';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getMndaTermText(data: NdaFormData): string {
  if (data.mndaTermType === 'until_terminated') {
    return 'the date when terminated in accordance with its terms';
  }
  return `${data.mndaTermYears || '1'} year(s) from the Effective Date`;
}

function getConfidentialityText(data: NdaFormData): string {
  if (data.confidentialityType === 'perpetuity') return 'in perpetuity';
  return `${data.confidentialityYears || '1'} year(s) from the Effective Date`;
}

function placeholder(text: string): string {
  return `<span style="color:#9ca3af;font-style:italic">[${text}]</span>`;
}

function highlight(value: string): string {
  return `<mark style="background:#fef3c7;padding:1px 4px;border-radius:3px;font-style:normal">${value}</mark>`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function substituteStandardTerms(content: string, data: NdaFormData): string {
  const fields: Record<string, string> = {
    'Purpose': data.purpose ? highlight(data.purpose) : placeholder('Purpose'),
    'Effective Date': data.effectiveDate ? highlight(formatDate(data.effectiveDate)) : formatDate(''),
    'MNDA Term': highlight(getMndaTermText(data)),
    'Term of Confidentiality': highlight(getConfidentialityText(data)),
    'Governing Law': data.governingLaw ? highlight(data.governingLaw) : placeholder('Governing Law'),
    'Jurisdiction': data.jurisdiction ? highlight(data.jurisdiction) : placeholder('Jurisdiction'),
  };

  let result = content;
  for (const [field, value] of Object.entries(fields)) {
    const regex = new RegExp(`<span class="coverpage_link">${escapeRegex(field)}<\\/span>`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// Generic document substitution — handles coverpage_link, keyterms_link, and orderform_link spans
export function substituteGenericTerms(content: string, fields: Record<string, string>): string {
  // Maps span display text to field key (and optional possessive transform)
  const fieldMap: Array<{ spanText: string; key: string; display?: (v: string) => string }> = [
    { spanText: 'Provider', key: 'providerCompany' },
    { spanText: "Provider's", key: 'providerCompany', display: (v) => `${v}'s` },
    { spanText: 'Customer', key: 'customerCompany' },
    { spanText: "Customer's", key: 'customerCompany', display: (v) => `${v}'s` },
    { spanText: 'Governing Law', key: 'governingLaw' },
    { spanText: 'Chosen Courts', key: 'chosenCourts' },
    {
      spanText: 'Effective Date',
      key: 'effectiveDate',
      display: (v) => (v ? formatDatePlain(v) : ''),
    },
  ];

  let result = content;

  for (const { spanText, key, display } of fieldMap) {
    const rawValue = fields[key] || '';
    const displayValue = display ? display(rawValue) : rawValue;
    const replacement = displayValue ? highlight(displayValue) : placeholder(spanText);

    for (const spanClass of ['coverpage_link', 'keyterms_link']) {
      const regex = new RegExp(
        `<span class="${spanClass}">${escapeRegex(spanText)}<\\/span>`,
        'g',
      );
      result = result.replace(regex, replacement);
    }
  }

  // Style remaining orderform_link spans as placeholders
  result = result.replace(
    /<span class="orderform_link">([^<]+)<\/span>/g,
    (_, fieldName) => placeholder(fieldName),
  );

  return result;
}

function formatDatePlain(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
