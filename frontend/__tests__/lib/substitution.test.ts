import { substituteStandardTerms } from '@/lib/substitution';
import { defaultFormData, NdaFormData } from '@/lib/types';

const base: NdaFormData = {
  ...defaultFormData,
  purpose: 'Test purpose',
  effectiveDate: '2024-01-15',
  mndaTermType: 'expires',
  mndaTermYears: '2',
  confidentialityType: 'years',
  confidentialityYears: '3',
  governingLaw: 'Delaware',
  jurisdiction: 'New Castle, DE',
};

const wrap = (field: string) => `<span class="coverpage_link">${field}</span>`;

const highlight = (value: string) =>
  `<mark style="background:#fef3c7;padding:1px 4px;border-radius:3px;font-style:normal">${value}</mark>`;

const ph = (text: string) =>
  `<span style="color:#9ca3af;font-style:italic">[${text}]</span>`;

describe('substituteStandardTerms', () => {
  describe('Purpose', () => {
    it('replaces Purpose placeholder with highlighted value', () => {
      const result = substituteStandardTerms(wrap('Purpose'), base);
      expect(result).toContain(highlight('Test purpose'));
      expect(result).not.toContain('coverpage_link');
    });

    it('shows placeholder when purpose is empty', () => {
      const result = substituteStandardTerms(wrap('Purpose'), { ...base, purpose: '' });
      expect(result).toContain(ph('Purpose'));
    });

    it('preserves surrounding content when replacing Purpose', () => {
      const content = `before ${wrap('Purpose')} after`;
      const result = substituteStandardTerms(content, base);
      expect(result).toContain('before');
      expect(result).toContain('after');
    });
  });

  describe('Effective Date', () => {
    it('replaces Effective Date placeholder with highlighted formatted date', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), base);
      expect(result).toContain(highlight('January 15, 2024'));
    });

    it('shows placeholder when effectiveDate is empty', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), { ...base, effectiveDate: '' });
      expect(result).toContain('[Effective Date]');
    });

    it('formats December 31 correctly', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), {
        ...base,
        effectiveDate: '2024-12-31',
      });
      expect(result).toContain('December 31, 2024');
    });

    it('formats February 29 in a leap year correctly', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), {
        ...base,
        effectiveDate: '2024-02-29',
      });
      expect(result).toContain('February 29, 2024');
    });

    it('formats March 1 correctly', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), {
        ...base,
        effectiveDate: '2024-03-01',
      });
      expect(result).toContain('March 1, 2024');
    });

    it('includes the year in the formatted date', () => {
      const result = substituteStandardTerms(wrap('Effective Date'), {
        ...base,
        effectiveDate: '2030-07-04',
      });
      expect(result).toContain('2030');
    });
  });

  describe('MNDA Term', () => {
    it('shows years term when mndaTermType is expires', () => {
      const result = substituteStandardTerms(wrap('MNDA Term'), {
        ...base,
        mndaTermType: 'expires',
        mndaTermYears: '2',
      });
      expect(result).toContain('2 year(s) from the Effective Date');
    });

    it('shows until_terminated text when mndaTermType is until_terminated', () => {
      const result = substituteStandardTerms(wrap('MNDA Term'), {
        ...base,
        mndaTermType: 'until_terminated',
      });
      expect(result).toContain('the date when terminated in accordance with its terms');
    });

    it('defaults mndaTermYears to 1 when empty', () => {
      const result = substituteStandardTerms(wrap('MNDA Term'), {
        ...base,
        mndaTermType: 'expires',
        mndaTermYears: '',
      });
      expect(result).toContain('1 year(s) from the Effective Date');
    });

    it('wraps MNDA Term in highlight markup', () => {
      const result = substituteStandardTerms(wrap('MNDA Term'), base);
      expect(result).toContain('<mark');
    });

    it('handles 10 years correctly', () => {
      const result = substituteStandardTerms(wrap('MNDA Term'), {
        ...base,
        mndaTermType: 'expires',
        mndaTermYears: '10',
      });
      expect(result).toContain('10 year(s) from the Effective Date');
    });
  });

  describe('Term of Confidentiality', () => {
    it('shows years term when confidentialityType is years', () => {
      const result = substituteStandardTerms(wrap('Term of Confidentiality'), {
        ...base,
        confidentialityType: 'years',
        confidentialityYears: '3',
      });
      expect(result).toContain('3 year(s) from the Effective Date');
    });

    it('shows in perpetuity when confidentialityType is perpetuity', () => {
      const result = substituteStandardTerms(wrap('Term of Confidentiality'), {
        ...base,
        confidentialityType: 'perpetuity',
      });
      expect(result).toContain('in perpetuity');
    });

    it('defaults confidentialityYears to 1 when empty', () => {
      const result = substituteStandardTerms(wrap('Term of Confidentiality'), {
        ...base,
        confidentialityType: 'years',
        confidentialityYears: '',
      });
      expect(result).toContain('1 year(s) from the Effective Date');
    });

    it('wraps Term of Confidentiality in highlight markup', () => {
      const result = substituteStandardTerms(wrap('Term of Confidentiality'), base);
      expect(result).toContain('<mark');
    });
  });

  describe('Governing Law', () => {
    it('replaces Governing Law with highlighted value', () => {
      const result = substituteStandardTerms(wrap('Governing Law'), base);
      expect(result).toContain(highlight('Delaware'));
    });

    it('shows placeholder when governingLaw is empty', () => {
      const result = substituteStandardTerms(wrap('Governing Law'), { ...base, governingLaw: '' });
      expect(result).toContain(ph('Governing Law'));
    });
  });

  describe('Jurisdiction', () => {
    it('replaces Jurisdiction with highlighted value', () => {
      const result = substituteStandardTerms(wrap('Jurisdiction'), base);
      expect(result).toContain(highlight('New Castle, DE'));
    });

    it('shows placeholder when jurisdiction is empty', () => {
      const result = substituteStandardTerms(wrap('Jurisdiction'), { ...base, jurisdiction: '' });
      expect(result).toContain(ph('Jurisdiction'));
    });

    it('handles commas and spaces in jurisdiction', () => {
      const result = substituteStandardTerms(wrap('Jurisdiction'), {
        ...base,
        jurisdiction: 'San Francisco, CA',
      });
      expect(result).toContain('San Francisco, CA');
    });
  });

  describe('Multiple substitutions', () => {
    it('substitutes all six fields in a single call', () => {
      const content = [
        wrap('Purpose'),
        wrap('Effective Date'),
        wrap('MNDA Term'),
        wrap('Term of Confidentiality'),
        wrap('Governing Law'),
        wrap('Jurisdiction'),
      ].join(' ');
      const result = substituteStandardTerms(content, base);
      expect(result).not.toContain('coverpage_link');
      expect(result).toContain('Test purpose');
      expect(result).toContain('January 15, 2024');
      expect(result).toContain('Delaware');
      expect(result).toContain('New Castle, DE');
    });

    it('replaces multiple occurrences of the same field', () => {
      const content = `${wrap('Purpose')} and again ${wrap('Purpose')}`;
      const result = substituteStandardTerms(content, base);
      const count = (result.match(/Test purpose/g) ?? []).length;
      expect(count).toBe(2);
    });

    it('replaces each field independently without cross-contamination', () => {
      const content = `${wrap('Governing Law')} ${wrap('Jurisdiction')}`;
      const result = substituteStandardTerms(content, base);
      expect(result).toContain('Delaware');
      expect(result).toContain('New Castle, DE');
    });
  });

  describe('Edge cases', () => {
    it('returns content unchanged when there are no placeholders', () => {
      const content = 'No placeholders here.';
      expect(substituteStandardTerms(content, base)).toBe(content);
    });

    it('handles empty content string', () => {
      expect(substituteStandardTerms('', base)).toBe('');
    });

    it('handles special regex characters in values without throwing', () => {
      const data = { ...base, governingLaw: 'State (CA)' };
      expect(() => substituteStandardTerms(wrap('Governing Law'), data)).not.toThrow();
      expect(substituteStandardTerms(wrap('Governing Law'), data)).toContain('State (CA)');
    });

    it('handles dollar signs in values without corrupting output', () => {
      const data = { ...base, purpose: '$100 test' };
      const result = substituteStandardTerms(wrap('Purpose'), data);
      expect(result).toContain('$100 test');
    });

    it('handles values with backslashes', () => {
      const data = { ...base, purpose: 'test\\value' };
      expect(() => substituteStandardTerms(wrap('Purpose'), data)).not.toThrow();
    });

    it('handles content with unrelated HTML tags', () => {
      const content = `<p>${wrap('Purpose')}</p>`;
      const result = substituteStandardTerms(content, base);
      expect(result).toContain('<p>');
      expect(result).toContain('Test purpose');
    });

    it('does not substitute unknown field names', () => {
      const content = `<span class="coverpage_link">Unknown Field</span>`;
      const result = substituteStandardTerms(content, base);
      expect(result).toBe(content);
    });
  });
});
