export interface NdaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTermType: 'expires' | 'until_terminated';
  mndaTermYears: string;
  confidentialityType: 'years' | 'perpetuity';
  confidentialityYears: string;
  governingLaw: string;
  jurisdiction: string;
  party1Company: string;
  party1Name: string;
  party1Title: string;
  party1Address: string;
  party2Company: string;
  party2Name: string;
  party2Title: string;
  party2Address: string;
  modifications: string;
}

export const defaultFormData: NdaFormData = {
  purpose: 'Evaluating whether to enter into a business relationship with the other party.',
  effectiveDate: '',
  mndaTermType: 'expires',
  mndaTermYears: '1',
  confidentialityType: 'years',
  confidentialityYears: '1',
  governingLaw: '',
  jurisdiction: '',
  party1Company: '',
  party1Name: '',
  party1Title: '',
  party1Address: '',
  party2Company: '',
  party2Name: '',
  party2Title: '',
  party2Address: '',
  modifications: '',
};

export type GenericFormData = Record<string, string>;

export const defaultGenericFormData: GenericFormData = {
  providerCompany: '',
  customerCompany: '',
  effectiveDate: '',
  governingLaw: '',
  chosenCourts: '',
};

export interface DocumentEntry {
  slug: string;
  name: string;
  description: string;
  filename: string;
}
