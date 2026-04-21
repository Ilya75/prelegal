import React from 'react';
import { render, screen } from '@testing-library/react';
import NdaPreview from '@/components/NdaPreview';
import { defaultFormData, NdaFormData } from '@/lib/types';

// Use a heading that does NOT collide with the "Standard Terms" divider label
const STANDARD_TERMS = `## Agreement Body

Some text about <span class="coverpage_link">Purpose</span>.

Governed by <span class="coverpage_link">Governing Law</span> law.

Term: <span class="coverpage_link">MNDA Term</span>.

Confidentiality: <span class="coverpage_link">Term of Confidentiality</span>.

Jurisdiction: <span class="coverpage_link">Jurisdiction</span>.

Effective: <span class="coverpage_link">Effective Date</span>.`;

const base: NdaFormData = {
  ...defaultFormData,
  purpose: 'Partnership evaluation',
  effectiveDate: '2024-06-01',
  mndaTermType: 'expires',
  mndaTermYears: '2',
  confidentialityType: 'years',
  confidentialityYears: '3',
  governingLaw: 'Delaware',
  jurisdiction: 'Wilmington, DE',
  party1Company: 'Acme Corp',
  party1Name: 'John Doe',
  party1Title: 'CEO',
  party1Address: 'john@acme.com',
  party2Company: 'Beta Inc',
  party2Name: 'Jane Smith',
  party2Title: 'CTO',
  party2Address: 'jane@beta.com',
  modifications: '',
};

function renderPreview(data: NdaFormData = base, terms: string = STANDARD_TERMS) {
  return render(<NdaPreview data={data} standardTerms={terms} />);
}

describe('NdaPreview', () => {
  describe('Document container', () => {
    it('renders the #nda-document element for PDF export', () => {
      const { container } = renderPreview();
      expect(container.querySelector('#nda-document')).toBeInTheDocument();
    });

    it('renders the Standard Terms divider label', () => {
      renderPreview();
      // The divider is a <span>; intro paragraph has <strong>Standard Terms</strong>
      expect(screen.getByText('Standard Terms', { selector: 'span' })).toBeInTheDocument();
    });
  });

  describe('Cover Page — title and intro', () => {
    it('renders the MNDA document title as a heading', () => {
      renderPreview();
      expect(
        screen.getByRole('heading', { name: /Mutual Non-Disclosure Agreement/i })
      ).toBeInTheDocument();
    });

    it('renders the Cover Page intro paragraph', () => {
      renderPreview();
      // "Standard Terms Version 1.0" only appears in the intro paragraph
      expect(
        screen.getByText(/Standard Terms Version 1\.0/, { selector: 'p' })
      ).toBeInTheDocument();
    });
  });

  describe('Cover Page — Purpose', () => {
    it('renders purpose value (appears in cover page and standard terms)', () => {
      renderPreview();
      // Purpose appears highlighted in CoverPage AND substituted in standard terms
      expect(screen.getAllByText('Partnership evaluation').length).toBeGreaterThanOrEqual(2);
    });

    it('renders placeholder when purpose is empty', () => {
      renderPreview({ ...base, purpose: '' });
      expect(screen.getByText('[Purpose not specified]')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Effective Date', () => {
    it('renders formatted effective date (appears in cover page and standard terms)', () => {
      renderPreview();
      expect(screen.getAllByText('June 1, 2024').length).toBeGreaterThanOrEqual(2);
    });

    it('renders placeholder when effectiveDate is empty', () => {
      renderPreview({ ...base, effectiveDate: '' });
      // Placeholder appears in CoverPage and in substituted standard terms
      expect(screen.getAllByText('[Effective Date]').length).toBeGreaterThanOrEqual(1);
    });

    it('renders December date correctly', () => {
      renderPreview({ ...base, effectiveDate: '2025-12-25' });
      expect(screen.getAllByText('December 25, 2025').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Cover Page — MNDA Term', () => {
    it('shows checkmark for expires option when selected', () => {
      renderPreview({ ...base, mndaTermType: 'expires' });
      expect(screen.getAllByText('☑').length).toBeGreaterThanOrEqual(1);
    });

    it('shows unchecked box for until_terminated when expires is selected', () => {
      renderPreview({ ...base, mndaTermType: 'expires' });
      expect(screen.getAllByText('☐').length).toBeGreaterThanOrEqual(1);
    });

    it('shows until_terminated label when selected', () => {
      renderPreview({ ...base, mndaTermType: 'until_terminated' });
      expect(
        screen.getByText('Continues until terminated in accordance with the terms of the MNDA.')
      ).toBeInTheDocument();
    });

    it('displays mndaTermYears value when expires is selected', () => {
      // Use '5' so it doesn't collide with confidentialityYears ('3' from base)
      renderPreview({ ...base, mndaTermType: 'expires', mndaTermYears: '5' });
      expect(screen.getByText('5 year(s)')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Term of Confidentiality', () => {
    it('shows years value when confidentialityType is years', () => {
      // mndaTermYears=2 and confidentialityYears=3, both show "X year(s)"
      // Use base where confidentialityYears=3 and mndaTermYears=2 so they are distinct
      renderPreview({ ...base, mndaTermYears: '2', confidentialityYears: '3' });
      expect(screen.getByText('3 year(s)')).toBeInTheDocument();
    });

    it('shows In perpetuity when confidentialityType is perpetuity', () => {
      renderPreview({ ...base, confidentialityType: 'perpetuity' });
      expect(screen.getByText('In perpetuity.')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Governing Law & Jurisdiction', () => {
    it('renders governing law value in cover page and standard terms', () => {
      renderPreview();
      expect(screen.getAllByText('Delaware').length).toBeGreaterThanOrEqual(2);
    });

    it('renders jurisdiction value in cover page and standard terms', () => {
      renderPreview();
      expect(screen.getAllByText('Wilmington, DE').length).toBeGreaterThanOrEqual(2);
    });

    it('renders placeholder when governingLaw is empty', () => {
      renderPreview({ ...base, governingLaw: '' });
      expect(screen.getByText('[Fill in state]')).toBeInTheDocument();
    });

    it('renders placeholder when jurisdiction is empty', () => {
      renderPreview({ ...base, jurisdiction: '' });
      expect(screen.getByText('[Fill in city or county and state]')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Modifications', () => {
    it('does not render modifications section when empty', () => {
      renderPreview({ ...base, modifications: '' });
      expect(screen.queryByText('MNDA Modifications')).not.toBeInTheDocument();
    });

    it('renders modifications section when text is provided', () => {
      renderPreview({ ...base, modifications: 'Clause 5 is amended.' });
      expect(screen.getByText('MNDA Modifications')).toBeInTheDocument();
      expect(screen.getByText('Clause 5 is amended.')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Signature table', () => {
    it('renders party 1 company name', () => {
      renderPreview();
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });

    it('renders party 2 company name', () => {
      renderPreview();
      expect(screen.getByText('Beta Inc')).toBeInTheDocument();
    });

    it('renders PARTY 1 placeholder when party1Company is empty', () => {
      renderPreview({ ...base, party1Company: '' });
      expect(screen.getByText('PARTY 1')).toBeInTheDocument();
    });

    it('renders PARTY 2 placeholder when party2Company is empty', () => {
      renderPreview({ ...base, party2Company: '' });
      expect(screen.getByText('PARTY 2')).toBeInTheDocument();
    });

    it('renders party 1 name in signature table', () => {
      renderPreview();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders party 2 name in signature table', () => {
      renderPreview();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('renders party 1 title', () => {
      renderPreview();
      expect(screen.getByText('CEO')).toBeInTheDocument();
    });

    it('renders party 2 title', () => {
      renderPreview();
      expect(screen.getByText('CTO')).toBeInTheDocument();
    });

    it('renders Signature row label', () => {
      renderPreview();
      expect(screen.getByText('Signature')).toBeInTheDocument();
    });

    it('renders Date row label', () => {
      renderPreview();
      expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('renders Notice Address row label', () => {
      renderPreview();
      expect(screen.getByText('Notice Address')).toBeInTheDocument();
    });
  });

  describe('Cover Page — Attribution', () => {
    it('renders CC BY 4.0 license link', () => {
      renderPreview();
      expect(screen.getByText('CC BY 4.0')).toBeInTheDocument();
    });

    it('CC BY 4.0 link points to Creative Commons', () => {
      renderPreview();
      const link = screen.getByText('CC BY 4.0').closest('a');
      expect(link).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
    });
  });

  describe('Standard Terms substitution', () => {
    it('does not render raw coverpage_link spans in output', () => {
      const { container } = renderPreview();
      expect(container.innerHTML).not.toContain('coverpage_link');
    });

    it('renders the standard terms markdown heading', () => {
      renderPreview();
      // STANDARD_TERMS uses "## Agreement Body" which should render as h2
      expect(screen.getByRole('heading', { name: 'Agreement Body' })).toBeInTheDocument();
    });

    it('handles empty standard terms without crashing', () => {
      expect(() => renderPreview(base, '')).not.toThrow();
    });
  });

  describe('Cover Page — perpetuity confidentiality', () => {
    it('shows perpetuity checkmark row when confidentialityType is perpetuity', () => {
      renderPreview({ ...base, confidentialityType: 'perpetuity' });
      expect(screen.getByText('In perpetuity.')).toBeInTheDocument();
    });
  });
});
