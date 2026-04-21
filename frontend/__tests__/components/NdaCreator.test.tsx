import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NdaCreator from '@/components/NdaCreator';

jest.mock('@/components/DownloadButton', () => ({
  __esModule: true,
  default: () => <button>Download PDF</button>,
}));

const STANDARD_TERMS = `# Agreement

Purpose: <span class="coverpage_link">Purpose</span>

Law: <span class="coverpage_link">Governing Law</span>`;

describe('NdaCreator', () => {
  describe('Header', () => {
    it('renders the Prelegal brand name', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Prelegal')).toBeInTheDocument();
    });

    it('renders the Mutual NDA Creator subtitle', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Mutual NDA Creator')).toBeInTheDocument();
    });

    it('renders the Download PDF button', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(screen.getByRole('button', { name: /Download PDF/i })).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders the form panel (NdaForm)', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(screen.getByText('Agreement Details')).toBeInTheDocument();
    });

    it('renders the preview panel (NdaPreview)', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(screen.getByRole('heading', { name: /Mutual Non-Disclosure Agreement/i })).toBeInTheDocument();
    });
  });

  describe('Initial state', () => {
    it("sets effectiveDate to today's date on mount", () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const today = new Date().toISOString().split('T')[0];
      expect(screen.getByDisplayValue(today)).toBeInTheDocument();
    });

    it('has the default purpose pre-filled in the form', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      expect(
        screen.getByPlaceholderText(/Evaluating whether/i)
      ).toHaveValue(
        'Evaluating whether to enter into a business relationship with the other party.'
      );
    });

    it('has expires selected as default MNDA Term', () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();
    });
  });

  describe('Form → Preview data flow', () => {
    it('updates governing law in preview when typed in form', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const lawInput = screen.getByPlaceholderText('e.g. Delaware');
      fireEvent.change(lawInput, { target: { value: 'Texas' } });
      await waitFor(() => {
        expect(screen.getAllByText('Texas').length).toBeGreaterThan(0);
      });
    });

    it('updates party company name in preview when typed in form', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const companyInputs = screen.getAllByPlaceholderText('Company name');
      fireEvent.change(companyInputs[0], { target: { value: 'NewCo LLC' } });
      await waitFor(() => {
        expect(screen.getByText('NewCo LLC')).toBeInTheDocument();
      });
    });

    it('updates party name in preview when typed in form', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const nameInput = screen.getAllByPlaceholderText('Full name')[0];
      fireEvent.change(nameInput, { target: { value: 'Alice Wong' } });
      await waitFor(() => {
        expect(screen.getByText('Alice Wong')).toBeInTheDocument();
      });
    });

    it('shows modifications in preview when entered in form', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const modTextarea = screen.getByPlaceholderText(/List any modifications/i);
      fireEvent.change(modTextarea, { target: { value: 'Section 4 amended.' } });
      await waitFor(() => {
        // Text appears in textarea value AND in the preview mark
        expect(screen.getAllByText('Section 4 amended.').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('hides modifications section when modifications is cleared', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const modTextarea = screen.getByPlaceholderText(/List any modifications/i);
      fireEvent.change(modTextarea, { target: { value: 'Some mod' } });
      // Wait for the preview's <h3> to appear (the form label is always there)
      await waitFor(() =>
        expect(screen.getByText('MNDA Modifications', { selector: 'h3' })).toBeInTheDocument()
      );
      fireEvent.change(modTextarea, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.queryByText('MNDA Modifications', { selector: 'h3' })).not.toBeInTheDocument();
      });
    });

    it('switches to until_terminated in preview when radio is changed', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[1]); // until_terminated
      await waitFor(() => {
        expect(
          screen.getByText('Continues until terminated in accordance with the terms of the MNDA.')
        ).toBeInTheDocument();
      });
    });

    it('switches to perpetuity in preview when radio is changed', async () => {
      render(<NdaCreator standardTerms={STANDARD_TERMS} />);
      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[3]); // perpetuity
      await waitFor(() => {
        expect(screen.getByText('In perpetuity.')).toBeInTheDocument();
      });
    });
  });
});
