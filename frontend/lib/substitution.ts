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
