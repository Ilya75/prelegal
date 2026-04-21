import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NdaForm from '@/components/NdaForm';
import { defaultFormData, NdaFormData } from '@/lib/types';

function renderForm(data: NdaFormData = defaultFormData, onChange = jest.fn()) {
  return { onChange, ...render(<NdaForm data={data} onChange={onChange} />) };
}

describe('NdaForm', () => {
  describe('Section rendering', () => {
    it('renders Agreement Details section', () => {
      renderForm();
      expect(screen.getByText('Agreement Details')).toBeInTheDocument();
    });

    it('renders MNDA Term section', () => {
      renderForm();
      expect(screen.getByText('MNDA Term')).toBeInTheDocument();
    });

    it('renders Term of Confidentiality section', () => {
      renderForm();
      expect(screen.getByText('Term of Confidentiality')).toBeInTheDocument();
    });

    it('renders Governing Law & Jurisdiction section', () => {
      renderForm();
      expect(screen.getByText('Governing Law & Jurisdiction')).toBeInTheDocument();
    });

    it('renders Party 1 section', () => {
      renderForm();
      expect(screen.getByText('Party 1')).toBeInTheDocument();
    });

    it('renders Party 2 section', () => {
      renderForm();
      expect(screen.getByText('Party 2')).toBeInTheDocument();
    });

    it('renders Modifications section', () => {
      renderForm();
      expect(screen.getByText('Modifications (Optional)')).toBeInTheDocument();
    });
  });

  describe('Field values', () => {
    it('shows purpose value in textarea', () => {
      renderForm({ ...defaultFormData, purpose: 'Custom purpose' });
      expect(screen.getByPlaceholderText(/Evaluating whether/i)).toHaveValue('Custom purpose');
    });

    it('shows effective date value in date input', () => {
      renderForm({ ...defaultFormData, effectiveDate: '2024-06-15' });
      expect(screen.getByDisplayValue('2024-06-15')).toBeInTheDocument();
    });

    it('shows governing law value', () => {
      renderForm({ ...defaultFormData, governingLaw: 'Delaware' });
      expect(screen.getByDisplayValue('Delaware')).toBeInTheDocument();
    });

    it('shows jurisdiction value', () => {
      renderForm({ ...defaultFormData, jurisdiction: 'Wilmington, DE' });
      expect(screen.getByDisplayValue('Wilmington, DE')).toBeInTheDocument();
    });

    it('shows party 1 company value', () => {
      renderForm({ ...defaultFormData, party1Company: 'Acme Corp' });
      expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    });

    it('shows party 1 name value', () => {
      renderForm({ ...defaultFormData, party1Name: 'John Doe' });
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    it('shows party 1 title value', () => {
      renderForm({ ...defaultFormData, party1Title: 'CEO' });
      expect(screen.getByDisplayValue('CEO')).toBeInTheDocument();
    });

    it('shows party 2 company value', () => {
      renderForm({ ...defaultFormData, party2Company: 'Beta Inc' });
      expect(screen.getByDisplayValue('Beta Inc')).toBeInTheDocument();
    });

    it('shows modifications textarea value', () => {
      renderForm({ ...defaultFormData, modifications: 'Custom clause.' });
      expect(screen.getByPlaceholderText(/List any modifications/i)).toHaveValue('Custom clause.');
    });
  });

  describe('MNDA Term radio buttons', () => {
    it('expires radio is checked when mndaTermType is expires', () => {
      renderForm({ ...defaultFormData, mndaTermType: 'expires' });
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it('until_terminated radio is checked when mndaTermType is until_terminated', () => {
      renderForm({ ...defaultFormData, mndaTermType: 'until_terminated' });
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it('mndaTermYears input is enabled when expires is selected', () => {
      renderForm({ ...defaultFormData, mndaTermType: 'expires' });
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[0]).not.toBeDisabled();
    });

    it('mndaTermYears input is disabled when until_terminated is selected', () => {
      renderForm({ ...defaultFormData, mndaTermType: 'until_terminated' });
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[0]).toBeDisabled();
    });

    it('shows current mndaTermYears value', () => {
      renderForm({ ...defaultFormData, mndaTermType: 'expires', mndaTermYears: '5' });
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[0]).toHaveValue(5);
    });
  });

  describe('Term of Confidentiality radio buttons', () => {
    it('years radio is checked when confidentialityType is years', () => {
      renderForm({ ...defaultFormData, confidentialityType: 'years' });
      const radios = screen.getAllByRole('radio');
      expect(radios[2]).toBeChecked();
      expect(radios[3]).not.toBeChecked();
    });

    it('perpetuity radio is checked when confidentialityType is perpetuity', () => {
      renderForm({ ...defaultFormData, confidentialityType: 'perpetuity' });
      const radios = screen.getAllByRole('radio');
      expect(radios[2]).not.toBeChecked();
      expect(radios[3]).toBeChecked();
    });

    it('confidentialityYears input is enabled when years is selected', () => {
      renderForm({ ...defaultFormData, confidentialityType: 'years' });
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[1]).not.toBeDisabled();
    });

    it('confidentialityYears input is disabled when perpetuity is selected', () => {
      renderForm({ ...defaultFormData, confidentialityType: 'perpetuity' });
      const spinbuttons = screen.getAllByRole('spinbutton');
      expect(spinbuttons[1]).toBeDisabled();
    });
  });

  describe('onChange interactions', () => {
    it('calls onChange when purpose textarea changes', () => {
      const { onChange } = renderForm();
      fireEvent.change(screen.getByPlaceholderText(/Evaluating whether/i), {
        target: { value: 'New purpose' },
      });
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ purpose: 'New purpose' }));
    });

    it('calls onChange when governing law changes', () => {
      const { onChange } = renderForm();
      fireEvent.change(screen.getByPlaceholderText('e.g. Delaware'), {
        target: { value: 'Texas' },
      });
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ governingLaw: 'Texas' }));
    });

    it('calls onChange when jurisdiction changes', () => {
      const { onChange } = renderForm();
      fireEvent.change(screen.getByPlaceholderText(/courts located/i), {
        target: { value: 'Austin, TX' },
      });
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ jurisdiction: 'Austin, TX' }));
    });

    it('calls onChange with mndaTermType=expires when expires radio clicked', () => {
      const { onChange } = renderForm({ ...defaultFormData, mndaTermType: 'until_terminated' });
      fireEvent.click(screen.getAllByRole('radio')[0]);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ mndaTermType: 'expires' }));
    });

    it('calls onChange with mndaTermType=until_terminated when that radio clicked', () => {
      const { onChange } = renderForm({ ...defaultFormData, mndaTermType: 'expires' });
      fireEvent.click(screen.getAllByRole('radio')[1]);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mndaTermType: 'until_terminated' })
      );
    });

    it('calls onChange with confidentialityType=perpetuity when perpetuity radio clicked', () => {
      const { onChange } = renderForm({ ...defaultFormData, confidentialityType: 'years' });
      fireEvent.click(screen.getAllByRole('radio')[3]);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ confidentialityType: 'perpetuity' })
      );
    });

    it('calls onChange with confidentialityType=years when years radio clicked', () => {
      const { onChange } = renderForm({ ...defaultFormData, confidentialityType: 'perpetuity' });
      fireEvent.click(screen.getAllByRole('radio')[2]);
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ confidentialityType: 'years' })
      );
    });

    it('preserves all other fields when one field changes', () => {
      const data = {
        ...defaultFormData,
        party1Company: 'Existing Corp',
        party2Company: 'Other Inc',
      };
      const { onChange } = renderForm(data);
      fireEvent.change(screen.getByPlaceholderText('e.g. Delaware'), {
        target: { value: 'California' },
      });
      const call = onChange.mock.calls[0][0] as NdaFormData;
      expect(call.party1Company).toBe('Existing Corp');
      expect(call.party2Company).toBe('Other Inc');
      expect(call.governingLaw).toBe('California');
    });

    it('calls onChange when party1 company changes', () => {
      const { onChange } = renderForm();
      const inputs = screen.getAllByPlaceholderText('Company name');
      fireEvent.change(inputs[0], { target: { value: 'NewCo' } });
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ party1Company: 'NewCo' }));
    });

    it('calls onChange when party2 company changes', () => {
      const { onChange } = renderForm();
      const inputs = screen.getAllByPlaceholderText('Company name');
      fireEvent.change(inputs[1], { target: { value: 'VentureCo' } });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ party2Company: 'VentureCo' })
      );
    });

    it('calls onChange when modifications textarea changes', () => {
      const { onChange } = renderForm();
      fireEvent.change(screen.getByPlaceholderText(/List any modifications/i), {
        target: { value: 'No changes.' },
      });
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ modifications: 'No changes.' })
      );
    });
  });
});
